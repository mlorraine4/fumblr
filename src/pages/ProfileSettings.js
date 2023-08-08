import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import edit from "../images/edit.png";
import SettingsNavBar from "../pageElements/SettingsNavBar";
import {
  getUserBlogProfile,
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
  const [newTitle, setNewTitle] = useState(null);
  const [description, setDescription] = useState("Description");
  const [newDescription, setNewDescription] = useState(null);
  const [background, setBackground] = useState("#fff");
  const [disabled, setDisabled] = useState(true);
  const [titleClass, setTitleClass] = useState("editProfile");
  const [descriptionClass, setDescriptionClass] = useState("editProfile");

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
    if (newTitle && newTitle !== "Title" && newTitle !== "") {
      await saveTitle(newTitle);
      setTitle(newTitle);
      setNewTitle(null);
      setTitleClass("editProfile");
    }
    if (
      newDescription &&
      newDescription !== "Description" &&
      newDescription !== ""
    ) {
      await saveDescription(newDescription);
      setDescription(newDescription);
      setNewDescription(null);
      setDescriptionClass("editProfile");
    }
    toggleEdit();
  }

  function handleChange(color) {
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
    if (
      !document
        .querySelector("#sketchPickerContainer")
        .classList.contains("hide")
    ) {
      toggleColorPicker();
    }
  }

  function toggleColorPicker() {
    document.querySelector("#sketchPickerContainer").classList.toggle("hide");
  }

  useEffect(() => {
    if (user) {
      getUserBlogProfile(user.displayName).then((snapshot) => {
        if (snapshot.exists()) {
          if (snapshot.val().title) {
            setTitle(snapshot.val().title);
          } else {
            setTitleClass("editProfile hide");
          }
          if (snapshot.val().description) {
            setDescription(snapshot.val().description);
          } else {
            setDescriptionClass("editProfile hide");
          }
          if (snapshot.val().backgroundColor) {
            setBackground(snapshot.val().backgroundColor);
          }
        }
      });
    }
    if (!user && !loading) return navigate("/fumblr/account/login");
  }, [user, navigate]);

  useEffect(() => {
    // TODO: rewrite
    if (newDescription || newFile !== "" || newTitle) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [newFile, newTitle, newDescription]);

  useEffect(() => {
    console.log(disabled);
  }, [disabled]);

  useEffect(() => {
    if (newTitle) {
      console.log(newTitle);
    }
  }, [newTitle]);

  if (loading) {
    return <div id="content">Loading . . .</div>;
  } else {
    return (
      <div id="content" style={{ display: "flex" }}>
        <div id="editProfileContainer" style={{ backgroundColor: background }}>
          <div id="sketchPickerContainer" className="hide">
            <SketchPicker
              color={background}
              onChange={handleChange}
              onChangeComplete={handleChangeComplete}
            />
            <button
              className="accentBtn"
              onClick={() => {
                saveBackgroundColor(background);
                toggleColorPicker();
                toggleEdit();
              }}
            >
              Save
            </button>
          </div>
          <div className="btnContainer" id="displayModeBtnContainer">
            <button id="editBtn" onClick={toggleEdit}>
              Edit Appearance
            </button>
          </div>
          <div className="btnContainer hide" id="editModeBtnContainer">
            <button onClick={toggleColorPicker} className="accentBtn">
              Change Background
            </button>
            <button id="saveBtn" onClick={saveEdit} disabled={disabled}>
              Save
            </button>
            <button id="cancelBtn" onClick={cancelUpload}>
              Cancel
            </button>
          </div>
          <div
            style={{
              position: "relative",
              width: "100px",
              margin: "60px auto 50px auto",
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
            <div id="profileTitle" className={titleClass}>
              {title}
            </div>
            <div id="profileDescription" className={descriptionClass}>
              {description}
            </div>
          </div>
          <div id="editDescription" className="hide">
            <input
              placeholder={title}
              onChange={(e) => {
                setNewTitle(e.target.value);
              }}
              className="editProfile"
              id="titleInput"
            ></input>
            <input
              placeholder={description}
              onChange={(e) => {
                setNewDescription(e.target.value);
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
