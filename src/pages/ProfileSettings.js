import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import edit from "../images/edit.png";
import SettingsNavBar from "../pageElements/SettingsNavBar";
import {
  saveBackgroundColor,
  saveDescription,
  savePhoto,
  saveTitle,
  toggleEdit,
} from "../HelperFunctions";
import { SketchPicker } from "react-color";

const ProfileSettings = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [newFile, setNewFile] = useState("");
  const [title, setTitle] = useState("Title");
  const [description, setDescription] = useState("Description");
  const [background, setBackground] = useState("#fff");

  // Read image file selected from input and display new img for user.
  async function getImg() {
    let file = document.getElementById("profileInput").files[0];
    let reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);

      reader.onload = function () {
        const imgSrc = reader.result;
        document.querySelector("#userProfileImg").src = imgSrc;
        setNewFile(file);
      };

      reader.onerror = function () {
        console.log(reader.error);
      };
    }
  }

  async function saveEdit() {
    if (newFile !== "") {
      await savePhoto(newFile);
    }
    if (title !== "Title" && title !== "") {
      await saveTitle();
    }
    if (description !== "Description" && description !== "") {
      await saveDescription();
    }
  }

  function handleChange(color) {
    console.log(color);
    setBackground(color.hex);
  }

  function handleChangeComplete() {}

  function cancelUpload() {
    toggleEdit();
    document.querySelector("#userProfileImg").src = user.photoURL;
    setNewFile("");
    if (title === "") {
      setTitle("Title");
    }
    if (description === "") {
      setDescription("Description");
    }
  }

  function toggleColorPicker() {
    document.querySelector("#sketchPickerContainer").classList.toggle("hide");
  }

  useEffect(() => {
    const backgroundDiv = document.querySelector("#editProfileContainer");
    if (backgroundDiv) {
      backgroundDiv.style.backgroundColor = background;
    }
  }, [background]);

  useEffect(() => {
    if (!user && !loading) return navigate("/fumblr/account/login");
  }, [user, navigate]);

  useEffect(() => {
    if (document.getElementById("saveBtn")) {
      if (
        (description !== "Description" && description !== "") ||
        newFile !== "" ||
        (title !== "Title" && title !== "")
      ) {
        document.getElementById("saveBtn").disabled = false;
      } else {
        document.getElementById("saveBtn").disabled = true;
      }
    }
  }, [newFile, title, description]);

  useEffect(() => {
// TODO: load profile and set props
  });

  if (loading) {
    return <div id="content">Loading . . .</div>;
  } else {
    return (
      <div id="content" style={{ display: "flex" }}>
        <div id="editProfileContainer">
          <div id="sketchPickerContainer" className="hide">
            <SketchPicker
              color={background}
              onChange={handleChange}
              onChangeComplete={handleChangeComplete}
            />
            <button
              onClick={() => {
                saveBackgroundColor(background);
                toggleColorPicker();
              }}
            >
              Save
            </button>
          </div>
          <div className="btnContainer">
            <button id="editBtn" onClick={toggleEdit}>
              Edit Appearance
            </button>
          </div>
          <div className="btnContainer">
            <button onClick={toggleColorPicker}>Change Background</button>
            <button id="saveBtn" className="hide" onClick={saveEdit}>
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
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              className="editProfile"
              id="titleInput"
            ></input>
            <input
              placeholder="Description"
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="editProfile"
            ></input>
          </div>
          <div id="updateInfo"></div>
        </div>
        <SettingsNavBar />
      </div>
    );
  }
};

export default ProfileSettings;
