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
import SettingsNavBar from "../pageElements/SettingsNavBar";

// TODO: add functionality for updating title/description for user's profile

const ProfileSettings = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [file, setFile] = useState("");
  const [title, setTitle] = useState("Title");
  const [description, setDescription] = useState("Description");

  // Read image file selected from input and display new img for user.
  async function getImg() {
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

  async function saveEdit() {
    console.log("save button clicked");
    if (file !== "") {
      console.log("downloading file");
      // await downloadImg();
      setFile("");
    }
    if (title !== "Title" && title !== "") {
      saveTitle();
    }
    if (description !== "Description" && description !== "") {
      saveDescription();
    }
  }

  async function saveTitle() {
    console.log(title);
    // const updates = {};
    // updates["/profile-info/" + user.displayName + "/title"] = title;

    // update(dbRef(db), updates)
    //   .then(() => {
    //     // Data saved successfully!
    //     console.log("info saved!");
    //   })
    //   .catch((error) => {
    //     // The write failed...
    //     console.log(error);
    //   });
  }

  async function saveDescription() {
    console.log(description);
    // const updates = {};
    // updates["/profile-info/" + user.displayName + "/description"] = description;

    // update(dbRef(db), updates)
    //   .then(() => {
    //     // Data saved successfully!
    //     console.log("info saved!");
    //   })
    //   .catch((error) => {
    //     // The write failed...
    //     console.log(error);
    //   });
  }

  // Save image to firebase storage.
  async function downloadImg() {
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
  async function getImgUrl(imgFilePath) {
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
  async function updateUserProfile(photoURL) {
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
  async function getUserPostIDs(url) {
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
  async function updateDB(url, posts) {
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
    document.querySelector("#displayDescription").classList.toggle("hide");
    document.querySelector("#displayDescription").classList.toggle("show");
    document.querySelector("#editDescription").classList.toggle("hide");
    document.querySelector("#editDescription").classList.toggle("show");
  }

  function cancelUpload() {
    toggleEdit();
    document.querySelector("#userProfileImg").src = user.photoURL;
    setFile("");
    if (title === "") {
      setTitle("Title");
    }
    if (description === "") {
      setDescription("Description");
    }
  }

  function updateTitle(e) {
    setTitle(e.target.value);
    console.log(title);
  }

  function updateDescription(e) {
    setDescription(e.target.value);
  }

  useEffect(() => {
    if (!user) return navigate("/fumblr/account/login");
  }, [user, navigate]);

  useEffect(() => {
    if (
      (description !== "Description" && description !== "") ||
      file !== "" ||
      (title !== "Title" && title !== "")
    ) {
      console.log("button clickable");
      document.getElementById("saveBtn").disabled = false;
      console.log(document.getElementById("saveBtn").disabled);
    } else {
      console.log("button unclickable");
      document.getElementById("saveBtn").disabled = true;
      console.log(document.getElementById("saveBtn").disabled);
    }
  }, [file, title, description]);

  if (loading) {
    return <div id="content">Loading . . .</div>;
  } else {
    return (
      <div id="content" style={{ display: "flex", height: "calc(99vh)" }}>
        <div id="editProfileContainer">
          <div className="btnContainer">
            <button id="editBtn" onClick={toggleEdit}>
              Edit Appearance
            </button>
          </div>
          <div className="btnContainer">
            <button id="saveBtn" disabled className="hide" onClick={saveEdit}>
              Save
            </button>
            <button id="cancelBtn" className="hide" onClick={cancelUpload}>
              Cancel
            </button>
          </div>
          <div
            style={{
              position: "relative",
              width: "100px",
              margin: "50px auto 50px auto",
            }}
          >
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
          <div id="displayDescription" className="show">
            <div id="profileTitle" className="editProfile">
              {title}
            </div>
            <div id="profileDescription" className="editProfile">
              {description}
            </div>
          </div>
          <div id="editDescription" className="hide">
            <input
              placeholder="Title"
              onChange={updateTitle}
              className="editProfile"
              id="titleInput"
            ></input>
            <input
              placeholder="Description"
              onChange={updateDescription}
              className="editProfile"
            ></input>
          </div>
        </div>
        <SettingsNavBar />
      </div>
    );
  }
};

export default ProfileSettings;
