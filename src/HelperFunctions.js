import { db, storage } from "./firebase-config";
import {
  ref as dbRef,
  update,
  increment,
  get,
  child,
  getDatabase,
  onValue,
  push,
  serverTimestamp,
  query,
  orderByChild,
  onChildAdded,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  updateEmail,
  updateProfile,
  getAuth,
  signOut,
  sendEmailVerification,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import like from "./images/like.png";
import liked from "./images/liked.png";
import uniqid from "uniqid";

/* ---------FIREBASE FUNCTIONS-------- */

// Log in form submit.
export function submitLogIn(e) {
  e.preventDefault();
  let email = e.target["email"].value;
  let password = e.target["password"].value;
  signInUserWithEmail(email, password);
}

// Sign in user with email and password.
export function signInUserWithEmail(email, password) {
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      if (errorCode === "auth/user-not-found") {
        document.getElementById("logInError").innerHTML =
          "Account is not found. Sign up below!";
      }
      if (errorCode === "auth/wrong-password") {
        document.getElementById("logInError").innerHTML =
          "Email/password is incorrect.";
      }
    });
}

export async function submitLogInPopUp(e) {
  e.preventDefault();
  const auth = getAuth();
  let email = e.target["email"].value;
  let password = e.target["password"].value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
      toggleLogInPopUp();
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      if (errorCode === "auth/user-not-found") {
        document.getElementById("logInError").innerHTML =
          "Account is not found. Sign up below!";
      }
      if (errorCode === "auth/wrong-password") {
        document.getElementById("logInError").innerHTML =
          "Email/password is incorrect.";
      }
    });
}

// Sign up handler for adding a new user.
export async function handleSignUp(email, password, displayName) {
  getUserNames().then((snapshot) => {
    if (snapshot.exists()) {
      if (!isUserFound(snapshot.val(), displayName)) {
        // Username is free to use.
        addNewUser(email, password)
          .then(() => {
            sendUserEmailVerification();
            createUserProfile(displayName).then(() => {
              // successful new user!
              // TODO: let user know sign up was successful.
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            if (errorCode === "auth/email-already-in-use") {
              displayAccountTaken();
            } else {
              displaySignUpError();
            }
          });
      } else {
        // Username is taken.
        displayUserTaken();
      }
    }
  });
}

// Send user a verification email.
async function sendUserEmailVerification() {
  const auth = getAuth();
  sendEmailVerification(auth.currentUser)
    .then(function () {
      // Verification email sent.
      document.getElementById("emailMsg").innerHTML =
        "Email verification sent!";
    })
    .catch(function (error) {
      console.log(error);
      document.getElementById("emailMsg").innerHTML =
        "There was an error sending your verification. Please try again.";
    });
}

// Create default user profile in firebase auth on sign up.
function createUserProfile(displayName) {
  const auth = getAuth();

  // Photo url is default user photo.
  updateProfile(auth.currentUser, {
    displayName: displayName,
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/fake-social-app-e763d.appspot.com/o/new_user.png?alt=media&token=445485db-8fce-4b84-8f71-136c1d7e92b1",
  })
    .then(() => {
      // Profile updated!
      createUserInfo();
    })
    .catch((error) => {
      // An error occurred
    });
}

// Create user profile in database on sign up.
async function createUserInfo() {
  const user = getAuth().currentUser;
  const uid = user.uid;

  const userData = {
    user: user.displayName,
  };

  const profileData = {
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/fake-social-app-e763d.appspot.com/o/new_user.png?alt=media&token=445485db-8fce-4b84-8f71-136c1d7e92b1",
    user: user.displayName,
  };

  const updates = {};
  updates["/user-info/" + user.displayName + "/followers/" + user.displayName] =
    userData;
  updates["/user-info/" + user.displayName + "/following/" + user.displayName] =
    userData;
  updates["/allUserNames/" + uid] = userData;
  updates["/user-profile/" + user.displayName] = profileData;

  // Writes data simutaneoulsy in database.
  update(dbRef(db), updates)
    .then(() => {
      // Data saved successfully!
    })
    .catch((error) => {
      // The write failed...
    });
}

// Save user to firebase auth.
export async function addNewUser(email, password) {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, email, password);
}

// Sign out user.
export async function signOutUser() {
  const auth = getAuth();
  return signOut(auth);
}

export function writeTextOnlyPost(title, body, postKey) {
  const user = getAuth().currentUser;
  const uid = user.uid;

  // A post entry.
  const postData = {
    author: user.displayName,
    uid: uid,
    body: body,
    title: title,
    starCount: 0,
    authorPic: user.photoURL,
    timestamp: serverTimestamp(),
    descendingOrder: -1 * new Date().getTime(),
    imgUrl: "",
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

// Saves a post's picture to cloud storage using database reference.
export function savePicture(title, body, file) {
  const user = getAuth().currentUser;
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
      getPostImgUrl(title, body, imgFilePathName, newPostKey);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Get post's img url from firebase storage.
export function getPostImgUrl(title, body, imgFilePath, postKey) {
  getDownloadURL(storageRef(storage, imgFilePath))
    .then((url) => {
      // `url` is the download URL for 'images/stars.jpg'
      console.log("got img url");
      writePostWithPhoto(title, body, url, postKey);
    })
    .catch((error) => {
      // Handle any errors
    });
}

export function writePostWithPhoto(title, body, url, postKey) {
  const user = getAuth().currentUser;
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
    timestamp: serverTimestamp(),
    descendingOrder: -1 * new Date().getTime(),
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

// Update name and photo for current user.
export function updateUserProfile(displayName, photoURL) {
  const auth = getAuth();
  return updateProfile(auth.currentUser, {
    displayName: displayName,
    photoURL: photoURL,
  });
}

// Update profile photo in firebase auth.
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

// Save user following another to database.
export async function saveFollow(newUser) {
  const auth = getAuth();
  const user = auth.currentUser;

  const follower = {
    user: user.displayName,
  };

  const following = {
    user: newUser,
  };

  const updates = {};
  updates["/user-info/" + user.displayName + "/following/" + newUser] =
    following;
  updates["/user-info/" + newUser + "/followers/" + user.displayName] =
    follower;

  return update(dbRef(db), updates);
}

// Remove follower from database.
export async function removeFollow(newUser) {
  const auth = getAuth();
  const user = auth.currentUser;

  const updates = {};
  updates["/user-info/" + user.displayName + "/following/" + newUser] = null;
  updates["/user-info/" + newUser + "/followers/" + user.displayName] = null;

  return update(dbRef(db), updates);
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
async function addLike(post) {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;

  const userData = {
    follower: user.displayName,
  };

  const postData = {
    author: post.author,
    id: post.id,
  };

  const updates = {};
  updates["posts/" + post.id + "/favorites/" + uid] = userData;
  updates["user-posts/" + post.author + "/" + post.id + "/favorites/" + uid] =
    userData;
  updates["/user-info/" + user.displayName + "/liked-posts/" + post.id] =
    postData;
  updates["posts/" + post.id + "/starCount"] = increment(1);
  updates["user-posts/" + post.author + "/" + post.id + "/starCount"] =
    increment(1);

  return update(dbRef(db), updates);
}

// Save unlike from firebase database.
async function removeLike(post) {
  const auth = getAuth();
  const user = auth.currentUser;
  const uid = user.uid;

  const updates = {};
  updates["posts/" + post.id + "/favorites/" + uid] = null;
  updates["user-posts/" + post.author + "/" + post.id + "/favorites/" + uid] =
    null;
  updates["/user-info/" + user.displayName + "/liked-posts/" + post.id] = null;
  updates["posts/" + post.id + "/starCount"] = increment(-1);
  updates["user-posts/" + post.author + "/" + post.id + "/starCount"] =
    increment(-1);

  return update(dbRef(db), updates);
}

// Save a new notification for a user when another likes their post, follows them, or messages them.
export async function notifyUser(type, sender, recipient, id) {
  // type: "message", "follow", "like"
  // ID: refers to the post's id for a like, message id for message, "" for follow
  const notification = createNotificationMsg(type, sender, recipient, id);
  const updates = {};
  const data = {
    type: type,
    sender: sender,
    recipient: recipient,
    id: id,
    notification: notification,
    seen: false,
    descendingOrder: -1 * new Date().getTime(),
  };

  const key = sender + type + id;

  updates["/notifications/" + recipient + "/" + key] = data;

  return update(dbRef(db), updates);
}

// Remove notification in database from user's list.
export async function removeNotification(type, sender, recipient, id) {
  const key = sender + type + id;
  const updates = {};
  updates["/notifications/" + recipient + "/" + key] = null;
  return update(dbRef(db), updates);
}

export function markNotificationAsSeen(e, seen, sender, type, id, recipient) {
  if (!seen) {
    const key = sender + type + id;
    const updates = {};
    updates["/notifications/" + recipient + "/" + key + "/seen"] = true;
    return update(dbRef(db), updates);
  } else {
    return;
  }
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

// Save title update for a user's profile.
export async function saveTitle(title) {
  const user = getAuth().currentUser;
  const updates = {};
  updates["/user-profiles/" + user.displayName + "/title"] = title;

  return update(dbRef(db), updates);
}

// Save description update for a user's profile.
export async function saveDescription(description) {
  const user = getAuth().currentUser;
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

// Get img url from firebase storage.
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

export function saveBackgroundColor(color) {
  const user = getAuth().currentUser;
  const updates = {};
  updates["/user-profiles/" + user.displayName + "/backgroundColor"] = color;
  return update(dbRef(db), updates);
}

export async function saveNewChat(recipient) {
  const user = getAuth().currentUser;
  const updates = {};
  const newChatKey = push(child(dbRef(db), "/chat-messages/")).key;

  updates["/chat-users/" + user.displayName + "/" + newChatKey] = {
    user: recipient,
  };
  updates["/chat-users/" + recipient + "/" + newChatKey] = {
    user: user.displayName,
  };

  return update(dbRef(db), updates);
}

export async function sendMessage(message, chatID, recipient) {
  const user = getAuth().currentUser;
  const newMessageKey = push(child(dbRef(db), "/chat-messages/" + chatID)).key;
  const updates = {};
  const messageData = {
    id: newMessageKey,
    message: message,
    user: user.displayName,
    timestamp: serverTimestamp(),
    descendingOrder: -1 * new Date().getTime(),
  };

  updates["/chat-messages/" + chatID + "/" + newMessageKey] = messageData;

  update(dbRef(db), updates).then(
    () => {
      notifyUser(
        "message",
        getAuth().currentUser.displayName,
        recipient,
        newMessageKey
      );
    },
    (reason) => {
      console.log(reason);
    }
  );
}

export async function loadMessages(chatID) {
  // Remove previous messages.
  document.querySelector("#chatMessages").innerHTML = "";

  const messageRef = query(
    dbRef(db, "chat-messages/" + chatID),
    orderByChild("timestamp")
  );
  onChildAdded(messageRef, (snapshot) => {
    if (snapshot.exists()) {
      displayMessage(snapshot.val(), snapshot.key);
    }
  });
}

// Get every username from database.
export async function getUserNames() {
  return get(child(dbRef(db), "/allUserNames"));
}

// Retrieve all posts from firebase database.
export async function getPosts() {
  const ref = dbRef(getDatabase());
  return get(child(ref, "posts"));
}

// Get a user's notifications.
export async function getUserNotifications() {
  const user = getAuth().currentUser;
  const ref = dbRef(getDatabase());
  return get(child(ref, "notifications/" + user.displayName));
}

// Retreive users that current user is following in database.
export async function getFollowing() {
  const user = getAuth().currentUser;
  const ref = dbRef(getDatabase());
  return get(child(ref, "user-info/" + user.displayName + "/following"));
}

// Retreive users that current user is following in database.
export async function getFollowers() {
  const user = getAuth().currentUser;
  const ref = dbRef(getDatabase());
  return get(child(ref, "user-info/" + user.displayName + "/followers"));
}

// Get all user profiles from database.
export async function getBlogProfiles() {
  const ref = dbRef(getDatabase());
  return get(child(ref, "user-profiles"));
}

//  TODO: replace get photoURL function for this one!
//  Get profile picture url, blog title, and blog description for a user.
export async function getUserBlogProfile(userDisplayName) {
  const ref = dbRef(getDatabase());
  return get(child(ref, "user-profiles/" + userDisplayName));
}

// Get profile photo url from database.
export async function getUserProfilePic(userDisplayName) {
  const ref = dbRef(getDatabase());
  return get(child(ref, "user-profiles/" + userDisplayName + "/photoURL"));
}

// Retrieves all posts from firebase database.
export async function getUserPosts() {
  const user = getAuth().currentUser;
  const ref = dbRef(getDatabase());
  return get(child(ref, "user-posts/" + user.displayName));
}

// Get current user's posts ids from database.
export async function getUserPostIDs() {
  const user = getAuth().currentUser;
  const ref = dbRef(getDatabase());
  return get(child(ref, "user-posts/" + user.displayName));
}

// Get post references from a user's liked post list.
export async function getUserLikedPostsIDs() {
  const user = getAuth().currentUser;
  const ref = dbRef(getDatabase());
  return get(child(ref, "user-info/" + user.displayName + "/liked-posts"));
}

// Get a user's post.
export async function getPost(id) {
  const ref = dbRef(getDatabase());
  return get(child(ref, "posts/" + id));
}

// Get a user's list of chat's.
export async function getListOfChats() {
  const user = getAuth().currentUser.displayName;
  const ref = dbRef(getDatabase());
  return get(child(ref, "chat-users/" + user));
}

//  Get chat messages between two users.
export async function getChatMessages(id) {
  const ref = dbRef(getDatabase());
  return get(child(ref, "chat-messages/" + id));
}

export async function toggleFollow(e, newUser) {
  if (e.target.innerHTML === "Following") {
    // unfollow user
    removeFollow(newUser);
    e.target.innerHTML = "Follow";
  } else {
    // follow user
    saveFollow(newUser);
    e.target.innerHTML = "Following";
  }
}

// Save user like or unlike of a post.
export async function toggleLikedStatus(e, post) {
  const user = getAuth().currentUser.displayName;
  if (e.target.classList[0] === "like") {
    e.target.nextSibling.nextSibling.innerHTML =
      Number(e.target.nextSibling.nextSibling.innerHTML) + 1;
    e.target.src = liked;
    e.target.setAttribute("class", "liked");
    addLike(post).then(() => {
      notifyUser("like", user, post.author, post.id);
    });
  } else {
    e.target.nextSibling.nextSibling.innerHTML =
      Number(e.target.nextSibling.nextSibling.innerHTML) - 1;
    e.target.src = like;
    e.target.setAttribute("class", "like");
    removeLike(post).then(() => {
      removeNotification("like", user, post.author, post.id);
    });
  }
}

/* ---------HELPER FUNCTIONS-------- */

// Sign up form.
export function submitSignUpForm(e) {
  e.preventDefault();
  let email = e.target["email"].value;
  let password = e.target["password"].value;
  let displayName = e.target["username"].value;

  handleSignUp(email, password, displayName);
}

// Iterates through all saved usernames to determine if a name is already taken.
export function isUserFound(userNames, newName) {
  let userInfo = Object.values(userNames);
  userInfo.forEach((el) => {
    if (newName === el.user) {
      return true;
    }
  });
  return false;
}

// Save all posts, order them by most recent, and save if user has already liked each post.
export function iteratePosts(postsObj) {
  const user = getAuth().currentUser;
  let postsArray = [];
  let posts = Object.values(postsObj);
  let ids = Object.keys(postsObj);
  posts.forEach((el) => {
    if (
      el.favorites !== undefined &&
      Object.keys(el.favorites).includes(user.uid)
    ) {
      postsArray.push({
        ...el,
        id: ids[posts.indexOf(el)],
        src: liked,
        className: "liked",
      });
    } else {
      postsArray.push({
        ...el,
        id: ids[posts.indexOf(el)],
        src: like,
        className: "like",
      });
    }
  });
  return postsArray;
}

// Return a random blog post.
export function pickRandomPost(posts) {
  let postArray = [];
  let maxIndex = posts.length - 1;
  let randomIndex = Math.floor(Math.random() * maxIndex);
  let randomPost = posts[randomIndex];
  postArray.push(randomPost);
  return postArray;
}

// Return 4 random blog profiles.
export function pickRandomBlogs(blogsObj) {
  const blogValues = Object.values(blogsObj);
  let blogs = [];
  if (blogValues.length > 4) {
  } else {
    blogValues.forEach((value) => {
      blogs.push(value);
    });
    return blogs;
  }
}

// Order posts by most recently liked.
export function sortLikedPosts(posts) {
  const sortedArray = [];
  for (let i = posts.length - 1; i >= 0; i--) {
    sortedArray.push(posts[i]);
  }
  return sortedArray;
}

// Return post ids from post object.
export function iterateIDs(postsObj) {
  let postIDs = [];
  let ids = Object.values(postsObj);
  ids.forEach((el) => {
    postIDs.push(el.id);
  });
  return postIDs;
}

function createNotificationMsg(type, sender) {
  let message;
  if (type === "like") {
    message = sender + " has liked your post.";
  } else if (type === "follow") {
    message = sender + " is now following you.";
  } else if (type === "message") {
    message = "You have a new message from " + sender;
  } else {
    message = "An error occurred.";
  }
  return message;
}

export function findMatchingUsers(e, users) {
  const user = e.target.value;
  let matchingUserNames = [];
  if (user !== "") {
    users.forEach((el) => {
      if (el.startsWith(user)) {
        matchingUserNames.push(el);
      }
    });
  }
  return matchingUserNames;
}

export function sendBtnHandler(e) {
  const message = e.target.value;
  if (message !== "") {
    return false;
  } else {
    return true;
  }
}

export function userNameClass(user) {
  if (user !== getAuth().currentUser.displayName) {
    return "messageContainer otherUser";
  } else {
    return "messageContainer currentUser";
  }
}

export function getChatDiv(user) {
  const divs = document.querySelectorAll(".chatListElement");
  let currentDiv;
  divs.forEach((div) => {
    if (div.innerHTML === user) {
      currentDiv = div;
    }
  });
  return currentDiv;
}

export function doesChatExist(user) {
  let userFound = false;
  let chats = document.querySelectorAll(".chatListElement");
  chats.forEach((chat) => {
    if (chat.innerHTML === user) {
      userFound = true;
    }
  });
  return userFound;
}

/* ----FORM SUBMIT HANDLERS------ */

// Notify message recipient and save message to database.
export function newMessageHandler(e, chatID, selectedUser) {
  e.preventDefault();
  const form = document.querySelector("#messageForm");
  const message = document.querySelector("#messageInput").value;
  sendMessage(message, chatID, selectedUser);
  form.reset();
}

// Get selected user to start a new chat with.
export function submitNewChatForm(e) {
  e.preventDefault();
  let user;
  const data = new FormData(document.querySelector("#chatForm"));
  for (const entry of data) {
    user = entry[1];
    return user;
  }
}

/* ---------DISPLAY-------- */

export function toggleTextOnlyPostForm() {
  document.getElementById("newPostTextOnlyForm").classList.toggle("hide");
  document.getElementById("content").classList.toggle("fade");
  document.getElementById("content").classList.toggle("stop-scrolling");
  document.getElementById("header").classList.toggle("fade");
}

export function toggleWithPhotoPostForm() {
  document.getElementById("newPostWithPhotoForm").classList.toggle("hide");
  document.getElementById("content").classList.toggle("fade");
  document.getElementById("content").classList.toggle("stop-scrolling");
  document.getElementById("header").classList.toggle("fade");
}

export function displayAccountTaken() {
  document.getElementById("signUpError").innerHTML = "Account already exists.";
}

export function displaySignUpError() {
  document.getElementById("signUpError").innerHTML =
    "There was an error signing up. Please try again.";
}

export function displayUserTaken() {
  document.getElementById("userNameError").innerHTML =
    "Username is already taken. Please choose another.";
}

export function toggleEdit() {
  document.querySelector("#displayModeBtnContainer").classList.toggle("hide");
  document.querySelector("#editModeBtnContainer").classList.toggle("hide");
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

export function toggleNotificationsDisplay() {
  if (!document.getElementById("accountPopUp").classList.contains("hide")) {
    document.getElementById("accountPopUp").classList.add("hide");
  }
  document.getElementById("notificationsPopUp").classList.toggle("hide");
}

export function toggleAccountDisplay() {
  if (
    !document.getElementById("notificationsPopUp").classList.contains("hide")
  ) {
    document.getElementById("notificationsPopUp").classList.add("hide");
  }
  document.getElementById("accountPopUp").classList.toggle("hide");
}

export function hidePopUps() {
  if (
    !document.getElementById("notificationsPopUp").classList.contains("hide")
  ) {
    document.getElementById("notificationsPopUp").classList.add("hide");
  }
  if (!document.getElementById("accountPopUp").classList.contains("hide")) {
    document.getElementById("accountPopUp").classList.add("hide");
  }
}

export function hideFollowButton(author) {
  const buttons = document.querySelectorAll(`[data-key="${author}"]`);
  buttons.forEach((button) => {
    button.classList = "followBtn hide";
  });
}

export function setCurrentPage(e) {
  let links = document.querySelectorAll(".navBarComponent");
  links.forEach((link) => {
    link.classList.remove("currentLink");
  });
  e.target.classList.add("currentLink");
}

export function toggleChatForm() {
  document.querySelector("#newChatForm").classList.toggle("hide");
  document.getElementById("content").classList.toggle("fade");
  document.getElementById("content").classList.toggle("stop-scrolling");
  document.getElementById("header").classList.toggle("fade");
}

export function removeNotificationDot(e) {
  if (e.target.querySelector(".notificationDot")) {
    e.target.querySelector(".notificationDot").classList.add("noOpacity");
  }
}

export function showDeleteNotificationBtn(e) {
  if (e.target.querySelector(".deleteNotification")) {
    e.target.querySelector(".deleteNotification").classList.add("fullOpacity");
    e.target.querySelector(".deleteNotification").classList.remove("noOpacity");
  }
}

export function hideDeleteNotificationBtn(e) {
  if (e.target.querySelector(".deleteNotification")) {
    e.target
      .querySelector(".deleteNotification")
      .classList.remove("fullOpacity");
    e.target.querySelector(".deleteNotification").classList.add("noOpacity");
  }
}

export function getNotificationClassName(seen) {
  if (seen) {
    return "notificationDot noOpacity";
  } else {
    return "notificationDot fullOpacity";
  }
}

// Displays a Message in the UI.
function displayMessage(snapshot, id) {
  let div = document.getElementById(id) || createAndInsertMsgDiv(id);

  div.setAttribute("class", userNameClass(snapshot.user));

  div.querySelector(".messageUserName").innerHTML = snapshot.user + ":";
  div.querySelector(".message").innerHTML = snapshot.message;
}

function createAndInsertMsgDiv(id) {
  const container = document.querySelector("#chatMessages");
  const div = document.createElement("div");

  div.setAttribute("id", id);
  div.setAttribute("data-key", id);

  const userNameDiv = document.createElement("div");
  userNameDiv.setAttribute("class", "messageUserName");

  div.appendChild(userNameDiv);

  const messageDiv = document.createElement("div");
  messageDiv.setAttribute("class", "message");

  div.appendChild(messageDiv);
  container.appendChild(div);

  return div;
}

export function toggleLogInPopUp() {
  document.querySelector("#logInPopUp").classList.toggle("hide");
  document.querySelector("#content").classList.toggle("fade");
  document.querySelector("#content").classList.toggle("stop-scrolling");
}

/* DATA */

export const MainPostClassNames = {
  post: "post",
  profile: "userProfile cover",
  postImg: "postImg",
  postTitle: "postTitle",
  postBody: "postBody",
};

export const RadarClassNames = {
  post: "radarPost",
  profile: "radarProfile cover",
  postImg: "radarImg",
  postTitle: "radarTitle",
  postBody: "radarBody",
};
