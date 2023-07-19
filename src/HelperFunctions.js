import { db, storage } from "./firebase-config";
import {
  ref as dbRef,
  update,
  increment,
  get,
  child,
  getDatabase,
  onValue,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { updateEmail, updateProfile, getAuth, signOut } from "firebase/auth";

/* ---------FIREBASE FUNCTIONS-------- */

// Sign out user.
export function signOutUser() {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
}

// User's profile information.
export function getUserProfile() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user !== null) {
    // The user object has basic properties such as display name, email, etc.
    const displayName = user.displayName;
    const email = user.email;
    const photoURL = user.photoURL;
    const emailVerified = user.emailVerified;
    // console.log("display name: " + displayName);
    // console.log("  email verified: " + emailVerified);
    // console.log("  Email: " + email);
    // console.log("  Photo URL: " + photoURL);

    // The user's ID, unique to the Firebase project. Do NOT use
    // this value to authenticate with your backend server, if
    // you have one. Use User.getToken() instead.
    const uid = user.uid;
  }
}

// User's profile information linked to a sign-in provider.
export function getUserLinkedProfile() {
  const auth = getAuth();

  const user = auth.currentUser;
  if (user !== null) {
    user.providerData.forEach((profile) => {
      // console.log("Sign-in provider: " + profile.providerId);
      // console.log("  Provider-specific UID: " + profile.uid);
      // console.log("  Name: " + profile.displayName);
      // console.log("  Email: " + profile.email);
      // console.log("  Photo URL: " + profile.photoURL);
    });
  }
}

// Update name and photo for current user.
export function updateUserProfile(displayName, photoURL) {
  const auth = getAuth();
  updateProfile(auth.currentUser, {
    displayName: displayName,
    photoURL: photoURL,
  })
    .then(() => {
      // Profile updated!
      // ...
    })
    .catch((error) => {
      // An error occurred
      // ...
    });
}

// TODO: get rid of both of these functions or rename to create generic user photo

export function updateUserProfilePicture(photoURL) {
  const auth = getAuth();
  updateProfile(auth.currentUser, {
    photoURL: photoURL,
  })
    .then(() => {
      // Profile updated!
      // ...
      saveProfilePicture(photoURL);
    })
    .catch((error) => {
      // An error occurred
      // ...
    });
}

// Update profile picture in firebase database.
export function saveProfilePicture(photoURL) {
  const user = getAuth().currentUser;

  const data = {
    user: user.displayName,
    photoURL: photoURL,
  };

  const updates = {};
  updates["/profile-pictures/" + user.displayName] = data;

  // Writes data simutaneoulsy in database.
  update(dbRef(db), updates)
    .then(() => {
      // Data saved successfully!
      console.log("info saved");
    })
    .catch((error) => {
      // The write failed...
      console.log(error);
    });
}

// export function getUserProfilePic() {
//   const user = getAuth().currentUser;
//   const profileRef = dbRef(db, "profile-pictures/" + user.displayName);
//   onValue(profileRef, (snapshot) => {
//     const data = snapshot.val();
//   });
// }

// Update user's email address.
// export function updateUserEmail(email) {
//   const auth = getAuth();

//   updateEmail(auth.currentUser, email)
//     .then(() => {
//       // Email updated!
//       // ...
//     })
//     .catch((error) => {
//       // An error occurred
//       // ...
//     });
// }

// After user follows another, save info in database.
// TODO: need to find another way to display photos, can't update photo URLs rn
export function saveFollow(newUser, photoURL) {
  // user is current user, wanting to follow new user
  const auth = getAuth();
  const user = auth.currentUser;

  // Current user's information.
  const userData = {
    user: user.displayName,
    photoURL: user.photoURL,
  };

  // New blog info current user wants to follow.
  const newUserData = {
    user: newUser,
    photoURL: photoURL,
  };

  const updates = {};
  updates["/user-info/" + user.displayName + "/following/" + newUser] =
    newUserData;
  updates["/user-info/" + newUser + "/followers/" + user.displayName] =
    userData;

  // Write data simutaneoulsy in database.
  update(dbRef(db), updates)
    .then(() => {
      // Data saved successfully!
      console.log("info saved");
    })
    .catch((error) => {
      // The write failed...
      console.log(error);
    });
}

// // Retrieve a post favorite count.
// export function getPostFavorites(postId, postElement) {
//   const favoriteCountRef = dbRef(db, "posts/" + postId + "/favorites");
//   onValue(favoriteCountRef, (snapshot) => {
//     const data = snapshot.val();
//     updateFavoriteCount(postElement, data);
//   });
// }

// Save like to firebase database.
export function addLike(post) {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;

  const userData = {
    follower: user.displayName,
    uid: uid,
  };

  const postData = {
    author: post.author,
    id: post.id,
  };

  const updates = {};
  updates["posts/" + post.id + "/favorites/" + uid] = userData;
  updates["/user-info/" + user.displayName + "/liked-posts/" + post.id] =
    postData;
  updates["posts/" + post.id + "/starCount"] = increment(1);
  updates["user-posts/" + post.author + "/" + post.id + "/starCount"] =
    increment(1);

  update(dbRef(db), updates)
    .then(() => {
      console.log("data saved!");
    })
    .catch((error) => {
      console.log(error);
    });
}

// Save unlike from firebase database.
export function removeLike(post) {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;

  const updates = {};
  updates["posts/" + post.id + "/favorites/" + uid] = null;
  updates["/user-info/" + user.displayName + "/liked-posts/" + post.id] = null;
  updates["posts/" + post.id + "/starCount"] = increment(-1);
  updates["user-posts/" + post.author + "/" + post.id + "/starCount"] =
    increment(-1);

  update(dbRef(db), updates);
}

// Save updated profile picture to firebase storage, and all references in database.
export async function savePhoto(newFile) {
  const user = getAuth().currentUser;
  const uid = user.uid;
  const imgFilePathName = "profileImgs/" + uid + "/userProfileImg";
  downloadImg(imgFilePathName, newFile).then(() => {
    getImgUrl(imgFilePathName).then((url) => {
      updateUserPhoto(url);
      getUserPostIDs(url).then((snapshot) => {
        updateDBWithNewPhoto(url, snapshot.val()).then(() => {
          displayUpdate();
        });
      });
    });
  });
}

//  Retreive who a user is following from firebase database.
export async function getFollowers(currentUser) {
  const ref = dbRef(getDatabase());
  return get(
    child(ref, "user-info/" + currentUser.displayName + "/following")
  );
}

export async function saveTitle(title) {
  const user = getAuth.currentUser();
  const updates = {};
  updates["/user-profiles/" + user.displayName + "/title"] = title;

  return update(dbRef(db), updates);
}

export async function saveDescription(description) {
  const user = getAuth.currentUser();
  const updates = {};
  updates["/user-profiles/" + user.displayName + "/description"] = description;

  return update(dbRef(db), updates);
}

// Save image to firebase storage.
export async function downloadImg(imgFilePathName, newFile) {
  // Create a unique reference in cloud storage using the user's post key and user id.
  const newImgRef = storageRef(storage, imgFilePathName);
  return uploadBytes(newImgRef, newFile);
}

// Get post's img url from firebase storage.
export async function getImgUrl(imgFilePath) {
  return getDownloadURL(storageRef(storage, imgFilePath));
}

// Update photo url for firebase auth user.
export async function updateUserPhoto(photoURL) {
  const auth = getAuth();
  return updateProfile(auth.currentUser, {
    photoURL: photoURL,
  });
}

// Get all user posts' ids from database.
export async function getUserPostIDs() {
  const user = getAuth().currentUser;
  const ref = dbRef(getDatabase());
  return get(child(ref, "user-posts/" + user.displayName));
}

// Update firebase database with new user photo.
export async function updateDBWithNewPhoto(url, posts) {
  const user = getAuth().currentUser;
  let ids = Object.keys(posts);
  const updates = {};
  updates["/user-profiles/" + user.displayName + "/photoURL"] = url;

  ids.forEach((id) => {
    updates["/user-posts/" + user.displayName + "/" + id + "/authorPic"] = url;
    updates["posts/" + id + "/authorPic"] = url;
  });

  return update(dbRef(db), updates);
}

/* ---------HELPER FUNCTIONS-------- */

// Return follower array from object.
export function iterateFollowers(followersObj) {
  let followersArray = [];
  let followers = Object.values(followersObj);
  followers.forEach((el) => {
    followersArray.push(el.user);
  });
  return followersArray;
}

/* ---------DISPLAY-------- */

export function togglePostForm() {
  document.getElementById("newPostPopUp").classList.toggle("hide");
  document.getElementById("content").classList.toggle("fade");
  document.getElementById("content").classList.toggle("stop-scrolling");
  document.getElementById("header").classList.toggle("fade");
}

export function toggleEdit() {
  document.querySelector("#editBtn").classList.toggle("hide");
  document.querySelector("#saveBtn").classList.toggle("hide");
  document.querySelector("#cancelBtn").classList.toggle("hide");
  document.querySelector("#inputContainer").classList.toggle("hide");
  document.querySelector("#displayDescription").classList.toggle("hide");
  document.querySelector("#displayDescription").classList.toggle("show");
  document.querySelector("#editDescription").classList.toggle("hide");
  document.querySelector("#editDescription").classList.toggle("show");
}

export function displayUpdate() {
  toggleEdit();
  document.querySelector("#updateInfo").innerHTML =
    "Profile successfully updated.";
}
