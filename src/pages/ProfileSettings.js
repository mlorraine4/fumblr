import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase-config";
import { updateProfile, getAuth } from "firebase/auth";

const ProfileSettings = ({user}) => {
  // TODO: this page: fumblr/settings/blog/{displayName}
  // TODO: display new photo before saving it
  // the pathway for user profile images on storage: profileImgs/userid/userProfileImg
  function getImg() {
    let file = document.getElementById("profileInput").files[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function () {
      downloadImg(file);
    };

    reader.onerror = function () {
      console.log(reader.error);
    };
  }

  function downloadImg(file) {
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
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      photoURL: photoURL,
    })
      .then(() => {
        // Profile updated!
        // ...
        console.log("profile updated");
        // TODO: find a better way to update only images?
        // Reloads page to show updated profile image.
        document.location.reload();
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  }
  return (
    <div id="content">
      <label htmlFor="profileInput">choose profile image</label>
      <input
        type="file"
        id="profileInput"
        style={{ visibility: "hidden" }}
        onChange={getImg}
      ></input>
      <div id="profileImg"></div>
      <img src={user.photoURL}></img>
    </div>
  );
};

export default ProfileSettings;