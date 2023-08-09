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
    document.getElementById("withPhotoPostForm").reset();
  }

  return (
    <div id="newPostWithPhotoForm" className="hide">
      <img src={user.photoURL} id="newPostUserImg" alt=""></img>
      <form id="withPhotoPostForm">
        <input id="title" placeholder="title"></input>
        <textarea id="body" placeholder="Your text here"></textarea>
        <input type="file" id="fileInput"></input>
        <div id="formError"></div>
        <button className="accentBtn" onClick={submitForm}>
          post
        </button>
        <button
          className="cancelBtn"
          onClick={() => {
            toggleWithPhotoPostForm();
            document.getElementById("withPhotoPostForm").reset();
          }}
        >
          cancel
        </button>
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

    document.getElementById("textOnlyPostForm").reset();
    toggleTextOnlyPostForm();
  }

  return (
    <div id="newPostTextOnlyForm" className="hide">
      <img src={user.photoURL} id="newPostUserImg" alt=""></img>
      <form id="textOnlyPostForm">
        <input id="title" placeholder="title"></input>
        <textarea
          maxLength="200"
          id="body"
          placeholder="Your text here"
        ></textarea>
        <div id="formError"></div>
        <button className="accentBtn" onClick={submitForm}>
          post
        </button>
        <button
          className="cancelBtn"
          onClick={() => {
            toggleTextOnlyPostForm();
            document.getElementById("textOnlyPostForm").reset();
          }}
        >
          cancel
        </button>
      </form>
    </div>
  );
};

export { NewPostWithPhotoForm, NewPostTextOnlyForm };
