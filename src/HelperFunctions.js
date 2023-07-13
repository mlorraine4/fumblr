import { db } from "./firebase-config";
import { ref, update, onValue, increment, get } from "firebase/database";
import { updateEmail, updateProfile, getAuth, signOut } from "firebase/auth";

/* ---------FIREBASE FUNCTIONS-------- */

// TODO: When updating user profile picture, need to save it in 
// 1. firebase auth
// 2. user-posts/user/authorPic:
// 3. posts/user/authorPic:
// 4. profile-pictures/user/photoURL

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

// Updates name and photo for current user.
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

// Saves new profile picture to firebase database.
function saveProfilePicture(photoURL) {
  const user = getAuth().currentUser;

  const data = {
    user: user.displayName,
    photoURL: photoURL,
  };

  const updates = {};
  updates["/profile-pictures/" + user.displayName] = data;

  // Writes data simutaneoulsy in database.
  update(ref(db), updates)
    .then(() => {
      // Data saved successfully!
      console.log("info saved");
    })
    .catch((error) => {
      // The write failed...
      console.log(error);
    });
}

export function getUserProfilePic() {
  const user = getAuth().currentUser;
  const profileRef = ref(db, "profile-pictures/" + user.displayName);
  onValue(profileRef, (snapshot) => {
    const data = snapshot.val();
    console.log(data);
  });
}

// Updates user's email address.
export function updateUserEmail(email) {
  const auth = getAuth();

  updateEmail(auth.currentUser, email)
    .then(() => {
      // Email updated!
      // ...
    })
    .catch((error) => {
      // An error occurred
      // ...
    });
}

// After user follows another, saves info in database.
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

  // Writes data simutaneoulsy in database.
  update(ref(db), updates)
    .then(() => {
      // Data saved successfully!
      console.log("info saved");
    })
    .catch((error) => {
      // The write failed...
      console.log(error);
    });
}

// Retrieves a post favorite count.
export function getPostFavorites(postId, postElement) {
  const favoriteCountRef = ref(db, "posts/" + postId + "/favorites");
  onValue(favoriteCountRef, (snapshot) => {
    const data = snapshot.val();
    updateFavoriteCount(postElement, data);
  });
}

// Changes favorite count for posts.
export function updateFavoriteCount() {}

// Saves like to firebase database.
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

  update(ref(db), updates)
    .then(() => {
      console.log("data saved!");
    })
    .catch((error) => {
      console.log(error);
    });
}

// Saves unlike from firebase database.
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

  update(ref(db), updates);
}
