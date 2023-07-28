import "./styles/App.css";
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig, db } from "./firebase-config";
import {
  getAuth,
  onAuthStateChanged,
} from "firebase/auth";
import { child, ref as dbRef, getDatabase, get, onValue, query, orderByChild } from "firebase/database";
import { HashRouter, Routes, Route } from "react-router-dom";
import AccountSettings from "./pages/AccountSettings";
import Inbox from "./pages/Inbox";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import UserPosts from "./pages/UserPosts";
import Header from "./pageElements/Header";
import ProfileSettings from "./pages/ProfileSettings";
import Followers from "./pages/Followers";
import SavedPosts from "./pages/SavedPosts";
import { getFollowers, getProfilePic, getUserNotifications } from "./HelperFunctions";

/*                                              -----TO DO LIST-----
  1. notification functionality (user has new follower, user's post has a new like, user recieves new message)
    --this will be under the heart icon in the header
  2. messaging functionality
  3. reblog functionality
  4. set up pathway and design  for user's profiles 
    --how to set up links for all users?
    --add unfollow fnc on other's profiles, add edit own profile fnc
  5. page that shows user's liked posts
  6. comment on post fnc
*/

function App() {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [theme, setTheme] = useState("default");

  // TODO: LEAVE ALL FUNCTIONS IN APP.
  // Observer for user sign in status.
  function initalizeFirebaseAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(-1690571073998 > -1690571100137);
        const uid = user.uid;
        setCurrentUser(user);
      } else {
        // User is signed out
        setCurrentUser(user);
      }
    });
  }

// TODO: might be unneccessary to save the notification id.
  function iterateNotifications(notificationsObj) {
    const notificationIDs = Object.keys(notificationsObj);
    const notifications = Object.values(notificationsObj);
    let notificationsArray = [];
    notifications.forEach((notification, index) => {
      notificationsArray.push({
        ...notification,
        notificationID: notificationIDs[index]
      })
    })
    return notificationsArray;
  }

  // Get each follower's profile picture and add to followers array.
  async function iterateFollowers(followersObj) {
    let followersArray = [];
    let followers = Object.values(followersObj);
    followers.forEach((el) => {
      getProfilePic(el.user).then((snapshot) => {
        if (snapshot.exists()) {
          followersArray.push({
            user: el.user,
            photoURL: snapshot.val(),
          });
        }
        if (followersArray.length === followers.length) {
          setFollowers(followersArray);
        }
      });
    });
  }

  // Determine if user is following another user.
  function isFollowing(author) {
    if (followers.some((el) => el.user === author)) {
      return "followBtn hide";
    } else {
      return "followBtn";
    }
  }

  function changeTheme() {
    if (theme === "default") {
      setTheme("dark");
    } else {
      setTheme("default");
    }
  }

  const firebaseAppConfig = getFirebaseConfig();
  initializeApp(firebaseAppConfig);
  initalizeFirebaseAuth();

  useEffect(() => {
    if (currentUser) {
      console.log("app user logged in");
      getFollowers(currentUser).then((snapshot) => {
        if (snapshot.exists()) {
          iterateFollowers(snapshot.val());
        }
      });

      // Listen for new notifications in database.
      function notificationListener() {
        const notificationsRef = query(
          dbRef(db, "notifications/" + currentUser.displayName),
          orderByChild("descendingOrder")
        );
        onValue(notificationsRef, (snapshot) => {
          if (snapshot.exists()) {
            let notifications = [];
            snapshot.forEach((child) => {
              notifications.push({ ...child.val(), notificationID: child.key });
              if (
                Object.values(snapshot.val()).length === notifications.length
              ) {
                setNotifications(notifications);
              }
            });
          } else {
            setNotifications([]);
          }
        });
      }

      notificationListener();
    }
  }, [currentUser]);

  return (
    <div className="App" data-theme={"dark"}>
      <HashRouter>
        <Header user={currentUser} notifications={notifications} />
        <Routes>
          <Route
            path={"/"}
            element={
              <HomePage followers={followers} isFollowing={isFollowing} />
            }
          ></Route>
          <Route
            path={"/fumblr/account/login"}
            element={<LogIn user={currentUser} />}
          ></Route>
          <Route
            path={"/fumblr/account/signup"}
            element={<SignUp user={currentUser} />}
          ></Route>
          <Route
            path={"/fumblr/settings/account"}
            element={<AccountSettings user={currentUser} />}
          ></Route>
          <Route
            // TODO: how to put user display name after blog?
            path={"/fumblr/settings/blog"}
            element={<ProfileSettings />}
          ></Route>
          <Route path={"/fumblr/inbox"} element={<Inbox />}></Route>
          <Route
            // TODO: how to make dynamic links using user name (want user = display name)
            path={"/fumblr/posts/user"}
            element={<UserPosts isFollowing={isFollowing} />}
          ></Route>
          <Route
            path={"/fumblr/account/followers"}
            element={<Followers followers={followers} />}
          ></Route>
          <Route
            path={"/fumblr/account/liked-posts"}
            element={<SavedPosts isFollowing={isFollowing} />}
          ></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
