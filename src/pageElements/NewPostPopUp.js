import {
  ref as dbRef,
  child,
  push,
  update,
  serverTimestamp,
} from "firebase/database";
import { db } from "../firebase-config";
import { getAuth } from "firebase/auth";
import { savePicture, toggleTextOnlyPostForm, toggleWithPhotoPostForm, writeTextOnlyPost } from "../HelperFunctions";

const NewPostWithPhotoForm = ({ user }) => {

  function submitForm(e) {
    e.preventDefault();
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;
    let file = document.getElementById("fileInput").files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
      savePicture(title, body, file);
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
    document.getElementById("postForm").reset();
  }

  return (
    <div id="newPostWithPhotoForm" className="hide">
      <img src={user.photoURL} id="newPostUserImg" alt=""></img>
      <form id="withPhotoPostForm">
        <input id="title" placeholder="title"></input>
        <input id="body" placeholder="Your text here"></input>
        <input type="file" id="fileInput"></input>
        <div id="formError"></div>
        <button onClick={toggleWithPhotoPostForm}>cancel</button>
        <button onClick={submitForm}>post</button>
      </form>
    </div>
  );
};

const NewPostTextOnlyForm = ({user}) => {

  function submitForm(e) {
    e.preventDefault();
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;

    const newPostKey = push(child(dbRef(db), "posts")).key;
    writeTextOnlyPost(title, body, newPostKey);

    document.getElementById("postForm").reset();
  }

  return (
    <div id="newPostTextOnlyForm" className="hide">
      <img src={user.photoURL} id="newPostUserImg" alt=""></img>
      <form id="textOnlyPostForm">
        <input id="title" placeholder="title"></input>
        <input id="body" placeholder="Your text here"></input>
        <input type="file" id="fileInput"></input>
        <div id="formError"></div>
        <button onClick={toggleTextOnlyPostForm}>cancel</button>
        <button onClick={submitForm}>post</button>
      </form>
    </div>
  );
};

// TODO: write for quotes
const NewPostWithQuoteForm = ({user}) => {
  function submitForm(e) {
    e.preventDefault();
    let title = document.getElementById("title").value;
    let body = document.getElementById("body").value;

    const newPostKey = push(child(dbRef(db), "posts")).key;
    writeTextOnlyPost(title, body, newPostKey);

    document.getElementById("postForm").reset();
  }

  function writeTextOnlyPost(title, body, postKey) {
    const user = getAuth().currentUser;
    const uid = user.uid;

    // A post entry.
    const postData = {
      author: user.displayName,
      uid: uid,
      body: body,
      title: title,
      starCount: 0,
      authorPic: user.photoURL,
      timestamp: serverTimestamp,
      descendingOrder: -1 * new Date().getTime(),
      imgUrl: "",
    };

    // Write the new post's data simultaneously in two database locations.
    const updates = {};
    // Masterlist of all posts.
    updates["/posts/" + postKey] = postData;
    // Posts sorted by each user.
    updates["/user-posts/" + user.displayName + "/" + postKey] = postData;

    // Saves multiple values to database.
    update(dbRef(db), updates)
      .then(() => {
        // Data saved successfully!
        console.log("post saved");
      })
      .catch((error) => {
        // The write failed...
        console.log(error);
      });
  }

  function togglePostForm() {
    document.getElementById("newPostTextOnlyForm").classList.toggle("hide");
    document.getElementById("content").classList.toggle("fade");
    document.getElementById("content").classList.toggle("stop-scrolling");
    document.getElementById("header").classList.toggle("fade");
    document.getElementById("textOnlyPostForm").reset();
  }

  return (
    <div id="newPostTextOnlyForm" className="hide">
      <img src={user.photoURL} id="newPostUserImg" alt=""></img>
      <form id="textOnlyPostForm">
        <input id="title" placeholder="title"></input>
        <input id="body" placeholder="Your text here"></input>
        <input type="file" id="fileInput"></input>
        <div id="formError"></div>
        <button onClick={togglePostForm}>cancel</button>
        <button onClick={submitForm}>post</button>
      </form>
    </div>
  );
};

export { NewPostWithPhotoForm, NewPostTextOnlyForm, NewPostWithQuoteForm };
