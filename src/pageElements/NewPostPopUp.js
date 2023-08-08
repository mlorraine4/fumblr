import { ref as dbRef, child, push } from "firebase/database";
import { db } from "../firebase-config";
import {
  savePicture,
  toggleTextOnlyPostForm,
  toggleWithPhotoPostForm,
  writeTextOnlyPost,
} from "../HelperFunctions";

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

const NewPostTextOnlyForm = ({ user }) => {
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

export { NewPostWithPhotoForm, NewPostTextOnlyForm };
