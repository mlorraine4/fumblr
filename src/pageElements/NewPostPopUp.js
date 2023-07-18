import Button from "../Button";
import {
  ref as storageRef,
  uploadBytes,
  getStorage,
  getDownloadURL,
} from "firebase/storage";
import { ref as dbRef, child, push, update } from "firebase/database";
import { db, storage } from "../firebase-config";
import uniqid from "uniqid";
// TODO: add drag and drop feature for adding photos
// TODO: can only add one photo at a time right now
const NewPostPopUp = ({ user }) => {

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

  // Saves photo data to firebase cloud, passes img ref to get url.
  function savePicture(title, body, file) {
    const uid = user.uid;

    // Get a key for a new Post.
    const newPostKey = push(child(dbRef(db), "posts")).key;
    // Parent folder for all of post's images.
    const imgFilePathName =
      "posts/" + uid + "/" + newPostKey + "/" + uniqid() + file.name;

    // Create a unique reference in cloud storage using the user's post key and user id.
    const newImgRef = storageRef(storage, imgFilePathName);

    uploadBytes(newImgRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        getImgUrl(title, body, imgFilePathName, newPostKey);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Get post's img url from firebase storage.
  function getImgUrl(title, body, imgFilePath, postKey) {
    getDownloadURL(storageRef(storage, imgFilePath))
      .then((url) => {
        // `url` is the download URL for 'images/stars.jpg'
        console.log("got img url");
        writeNewPost(title, body, url, postKey);
      })
      .catch((error) => {
        // Handle any errors
      });
  }

  function writeNewPost(title, body, url, postKey) {
    const uid = user.uid;

    // A post entry.
    const postData = {
      author: user.displayName,
      uid: uid,
      body: body,
      title: title,
      starCount: 0,
      authorPic: user.photoURL,
      imgUrl: url,
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
    document.getElementById("newPostPopUp").classList.toggle("hide");
    document.getElementById("content").classList.toggle("fade");
    document.getElementById("content").classList.toggle("stop-scrolling");
    document.getElementById("header").classList.toggle("fade");
    document.getElementById("postForm").reset();
  }

  return (
    <div id="newPostPopUp" className="hide">
      <img src={user.photoURL} id="newPostUserImg" alt=""></img>
      <form id="postForm">
        <input id="title" placeholder="title"></input>
        <input id="body" placeholder="Your text here"></input>
        <input type="file" id="fileInput"></input>
        <div id="formError"></div>
        <button onClick={togglePostForm}>cancel</button>
        <Button onClick={submitForm}>post</Button>
      </form>
    </div>
  );
};

export default NewPostPopUp;
