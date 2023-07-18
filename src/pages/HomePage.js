import Header from "../pageElements/Header";
import NewPostButtons from "../pageElements/NewPostButtons";
import NewPostPopUp from "../pageElements/NewPostPopUp";
import PostsMain from "../pageElements/PostsMain";
import NewBlogsToFollow from "../pageElements/NewBlogsToFollow";
import { db, storage } from "../firebase-config";
import {
  push,
  child,
  ref as dbRef,
  update,
  getDatabase,
  get,
  onValue
} from "firebase/database";
import uniqid from "uniqid";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import like from "../images/like.png";
import liked from "../images/liked.png";
import { useState, useEffect } from "react";
import UserPosts from "./UserPosts";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const HomePage = () => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);

  // TODO: REMOVE THIS WHEN DONE ADDING POSTS BY OTHER USERS!
  function writeNewPost() {
    const postKey = push(child(dbRef(db), "posts")).key;
    const uid = user.uid;
    // const user = "fakeUser";
    const author = user.displayName;

    // A post entry.
    const postData = {
      author: author,
      uid: uid,
      body: "Kermit the Fog",
      title: "What do you get if you cross a frog with some mist?",
      starCount: 0,
      authorPic:
        "https://firebasestorage.googleapis.com/v0/b/fake-social-app-e763d.appspot.com/o/profileImgs%2FN8i95WIgBYckPhENmbKwVKnjhJt1%2FuserProfileImg?alt=media&token=2e790913-2c7d-4024-aec6-14f9ac1c3069",
      imgUrl:
        "https://firebasestorage.googleapis.com/v0/b/fake-social-app-e763d.appspot.com/o/posts%2FN8i95WIgBYckPhENmbKwVKnjhJt1%2F-NYZQLGlmr6CoJO9mXCB%2Flj7hul7t39CUYMP8vJqHAYGVzUghBX-1200-80.jpg?alt=media&token=0dd6ecd2-2392-4bda-8f41-1daeaa5e023e",
    };

    // Write the new post's data simultaneously in two database locations.
    const updates = {};
    // Masterlist of all posts.
    updates["/posts/" + postKey] = postData;
    // Posts sorted by each user.
    updates["/user-posts/" + author + "/" + postKey] = postData;

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

  // After signing up, creates a following/followers subdirectory for user, and adds user info to each.
  function createUserInfo() {
    const uid = "fakeUser2";
    const user = "fisharefriends";

    // A post entry.
    const data = {
      uid: uid,
      user: user,
    };

    const updates = {};
    updates["/user-info/" + user + "/followers/" + user] = data;
    updates["/user-info/" + user + "/following/" + user] = data;

    // Writes data simutaneoulsy in database.
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

  function getUserProfilePic() {
    const user = getAuth().currentUser;
    const profileRef = dbRef(db, "profile-pictures/" + user.displayName);
    onValue(profileRef, (snapshot) => {
      const data = snapshot.val();
      console.log(data);
      document.querySelector("#" + user.displayName).src = data.photoURL;
    });
  }

  // Saves new profile picture to firebase database.
  function saveProfilePicture(photoURL = "https://firebasestorage.googleapis.com/v0/b/fake-social-app-e763d.appspot.com/o/profileImgs%2FN8i95WIgBYckPhENmbKwVKnjhJt1%2FuserProfileImg?alt=media&token=2e790913-2c7d-4024-aec6-14f9ac1c3069") {
    // const user = getAuth().currentUser;
    const displayName = "stickyfrogs"

    const data = {
      user: displayName,
      photoURL: photoURL,
    };

    const updates = {};
    updates["/profile-pictures/" + displayName] = data;

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


useEffect(() => {
    if (loading) {
      document.querySelector("#content").innerHTML = "Loading . . .";
    }
  }, [loading]);

  if (user) {
    return (
      <>
        <NewPostPopUp user={user} />
        <div id="content">
          <div style={{ display: "flex" }}>
            <div id="homePosts">
              <NewPostButtons user={user} />
              <PostsMain user={user} />
            </div>
            <div id="homeNewBlogs">
              <NewBlogsToFollow />
            </div>
          </div>
          {/* <button onClick={writeNewPost}>add post</button> */}
          <div>Footer</div>
        </div>
      </>
    );
  }
  if (!user) {
    return (
      <>
        <div id="content">User is logged out.</div>
      </>
    );
  }
};

export default HomePage;
