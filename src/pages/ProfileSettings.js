import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  ref as dbRef,
  update,
  get,
  child,
  getDatabase,
} from "firebase/database";
import { db, storage } from "../firebase-config";
import { updateProfile, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import edit from "../images/edit.png";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [file, setFile] = useState("");

  // TODO: this page: fumblr/settings/blog/{displayName}
  // TODO: display new photo before saving it
  // the pathway for user profile images on storage: profileImgs/userid/userProfileImg

  // ON PROFILE CHANGE: (database)
  // 1. update profile-pictures/userdisplayname/photoURL
  // 2. update user-posts/userdisplayname/(every child) ==> postID/authorPic
  // 3. send every child post id in order to save posts/postID/authorPic
  // 4. update (storage) profileImgs/userid/userProfileImg

  // Read image file selected from input and display new img for user.
  function getImg() {
    let file = document.getElementById("profileInput").files[0];
    let reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);

      reader.onload = function () {
        const imgSrc = reader.result;
        document.querySelector("#userProfileImg").src = imgSrc;
        setFile(file);
      };

      reader.onerror = function () {
        console.log(reader.error);
      };
    }
  }

  // Save image to firebase storage.
  function downloadImg() {
    const uid = user.uid;

    const imgFilePathName = "profileImgs/" + uid + "/userProfileImg";

    // Create a unique reference in cloud storage using the user's post key and user id.
    const newImgRef = storageRef(storage, imgFilePathName);

    uploadBytes(newImgRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        getImgUrl(imgFilePathName);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  // Get post's img url from firebase storage.
  function getImgUrl(imgFilePath) {
    getDownloadURL(storageRef(storage, imgFilePath))
      .then((url) => {
        console.log("got img url");
        updateUserProfile(url);
      })
      .catch((error) => {
        // Handle any errors
      });
  }

  // Update photo url for firebase auth user.
  function updateUserProfile(photoURL) {
    updateProfile(auth.currentUser, {
      photoURL: photoURL,
    })
      .then(() => {
        // Profile updated!
        // ...
        console.log("profile updated");
        getUserPostIDs(photoURL);
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  }

  // Get all user posts' ids from database.
  function getUserPostIDs() {
    const url =
      "https://firebasestorage.googleapis.com/v0/b/fake-social-app-e763d.appspot.com/o/profileImgs%2FN8i95WIgBYckPhENmbKwVKnjhJt1%2FuserProfileImg?alt=media&token=2e790913-2c7d-4024-aec6-14f9ac1c3069";
    const ref = dbRef(getDatabase());
    get(child(ref, "user-posts/" + user.displayName))
      .then((snapshot) => {
        if (snapshot.exists()) {
          updateDB(url, snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Update firebase database with new user photo.
  function updateDB(url, posts) {
    let ids = Object.keys(posts);
    const updates = {};
    updates["/profile-pictures/" + user.displayName + "/photoURL"] = url;

    ids.forEach((id) => {
      updates["/user-posts/" + user.displayName + "/" + id + "/authorPic"] =
        url;
      updates["posts/" + id + "/authorPic"] = url;
    });

    update(dbRef(db), updates)
      .then(() => {
        // Data saved successfully!
        console.log("info saved!");
      })
      .catch((error) => {
        // The write failed...
        console.log(error);
      });
  }

  function toggleEdit() {
    document.querySelector("#editBtn").classList.toggle("hide");
    document.querySelector("#saveBtn").classList.toggle("hide");
    document.querySelector("#cancelBtn").classList.toggle("hide");
    document.querySelector("#inputContainer").classList.toggle("hide");
  }

  function cancelUpload() {
    toggleEdit();
    document.querySelector("#userProfileImg").src = user.photoURL;
    setFile("");
  }

  useEffect(() => {
    if (!user) return navigate("/fumblr/account/login");
  }, [user, navigate]);

  if (loading) {
    return <div id="content">Loading . . .</div>;
  } else {
    return (
      <div id="content">
        <div>
          <button id="editBtn" onClick={toggleEdit}>
            edit appearance
          </button>
          <button id="saveBtn" className="hide" onClick={downloadImg}>
            save
          </button>
          <button id="cancelBtn" className="hide" onClick={cancelUpload}>
            cancel
          </button>
          <div style={{ position: "relative", width: "100px", margin: "auto" }}>
            <div
              id="inputContainer"
              style={{ position: "absolute", left: "40px", top: "40px" }}
              className="hide"
            >
              <label htmlFor="profileInput">
                <div className="editProfileBackground">
                  <img src={edit} className="editProfileIcon" alt=""></img>
                </div>
              </label>
              <input
                type="file"
                id="profileInput"
                style={{ visibility: "hidden" }}
                onChange={getImg}
              ></input>
            </div>
            <img
              id="userProfileImg"
              className="cover"
              src={user.photoURL}
              alt=""
            ></img>
          </div>
          <div>Title</div>
          <div>Description</div>
          <button onClick={getUserPostIDs}>click me</button>
        </div>
      </div>
    );
  }
};

export default ProfileSettings;
