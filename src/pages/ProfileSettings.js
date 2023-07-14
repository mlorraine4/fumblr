import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase-config";
import { updateProfile, getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import edit from "../images/edit.png";
import { update } from "firebase/database";

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

  function getImg() {
    let file = document.getElementById("profileInput").files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
      // downloadImg(file);
      const imgSrc = reader.result;
      document.querySelector("#userProfileImg").src = imgSrc;
      setFile(file);
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
  }

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

  // Updates name and photo for current user.
  function updateUserProfile(photoURL) {
    updateProfile(auth.currentUser, {
      photoURL: photoURL,
    })
      .then(() => {
        // Profile updated!
        // ...
        console.log("profile updated");
        updateDB(photoURL);
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  }

  function updateDB() {
    // TODO: write fnc
  }

  function toggleEdit() {
    document.querySelector("#editBtn").classList.toggle("hide");
    document.querySelector("#saveBtn").classList.toggle("hide");
    document.querySelector("#cancelBtn").classList.toggle("hide");
    document.querySelector("#profileInput").classList.toggle("hide");
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
          <button id="saveBtn" className="hide">
            save
          </button>
          <button id="cancelBtn" className="hide" onClick={toggleEdit}>
            cancel
          </button>
          <div style={{ position: "relative", width: "100px", margin: "auto" }}>
            <div
              id="profileInput"
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
            <img id="userProfileImg" src={user.photoURL} alt=""></img>
          </div>
          <div>Title</div>
          <div>Description</div>
        </div>
      </div>
    );
  }
};

export default ProfileSettings;
