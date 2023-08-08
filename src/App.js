import "./styles/App.css";
import React, { useEffect, useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig, db } from "./firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  child,
  ref as dbRef,
  getDatabase,
  get,
  onValue,
  query,
  orderByChild,
} from "firebase/database";
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
import {
  getFollowers,
  getUserProfilePic,
  getUserNotifications,
  getFollowing,
  removeFollow,
  getPost,
} from "./HelperFunctions";
import Blog from "./pages/Blog";
import Post from "./pages/Post";
import liked from "./images/liked.png";
import Following from "./pages/Following";
// TODO: follow, like function needs to check if a user is signed in. if not, show sign in pop up

function App() {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [theme, setTheme] = useState("light");

  // Observer for user sign in status.
  function initalizeFirebaseAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        console.log("app user logged in");
        setCurrentUser(user);
      } else {
        // User is signed out
        setCurrentUser(user);
      }
    });
  }

  // Determine if user is following another user.
  function isFollowing(author) {
    if (following.some((el) => el.user === author)) {
      return "followBtn hide";
    } else {
      return "followBtn";
    }
  }

  function isFollowingBlogPage(user) {
    if (following.some((el) => el.user === user)) {
      return true;
    } else {
      return false;
    }
  }

  // Change UI theme.
  function changeTheme() {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }

  function followersListener(user) {
    // User followers listener.
    const followersRef = query(
      dbRef(db, "user-info/" + user.displayName + "/followers")
    );
    onValue(followersRef, (snapshot) => {
      let followersArray = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          getUserProfilePic(child.val().user).then((urlSnapshot) => {
            if (snapshot.exists()) {
              followersArray.push({
                user: child.val().user,
                photoURL: urlSnapshot.val(),
              });
            }
            setFollowers(followersArray);
          });
        });
      }
    });
  }

  function followingListener(user) {
    // User following listener.
    const followingRef = query(
      dbRef(db, "user-info/" + user.displayName + "/following")
    );
    onValue(followingRef, (snapshot) => {
      let followingArray = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          getUserProfilePic(child.val().user).then((urlSnapshot) => {
            if (snapshot.exists()) {
              followingArray.push({
                user: child.val().user,
                photoURL: urlSnapshot.val(),
              });
            }
            setFollowing(followingArray);
          });
        });
      }
    });
  }

  function notificationListener(user) {
    // Notifications listener.
    const notificationsRef = query(
      dbRef(db, "notifications/" + user.displayName),
      orderByChild("descendingOrder")
    );
    onValue(notificationsRef, (snapshot) => {
      if (snapshot.exists()) {
        let notifications = [];
        let newNotifications = [];
        snapshot.forEach((child) => {
          if (!child.val().seen) {
            newNotifications.push(child.val());
          }
          notifications.push(child.val());
        });
        setNotifications(notifications);
        updateNotificationIcon(newNotifications);
      } else {
        setNotifications([]);
        updateNotificationIcon([]);
      }
    });
  }

  function savedPostsListener(user) {
    // Saved posts listener.
    const likedPostsRef = query(
      dbRef(db, "user-info/" + user.displayName + "/liked-posts"),
      orderByChild("descendingOrder")
    );
    onValue(likedPostsRef, (snapshot) => {
      let postsArray = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          getPost(child.val().id).then((postSnapshot) => {
            if (postSnapshot.exists()) {
              postsArray.push({
                ...postSnapshot.val(),
                id: child.val().id,
                src: liked,
                className: "liked",
              });
            }
          });
        });
        setSavedPosts(postsArray);
      }
    });
  }

  // Set notification icon if user has existing notifications.
  function updateNotificationIcon(newNotificationArray) {
    if (newNotificationArray.length === 0) {
      document.querySelector("#notificationIcon").style.opacity = 0;
    } else {
      document.querySelector("#notificationIcon").style.opacity = 1;
      document.querySelector("#notificationIcon").innerHTML =
        newNotificationArray.length;
    }
  }

  const firebaseAppConfig = getFirebaseConfig();
  initializeApp(firebaseAppConfig);

  useEffect(() => {
    if (currentUser) {
      notificationListener(currentUser);
      savedPostsListener(currentUser);
      followersListener(currentUser);
      followingListener(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    initalizeFirebaseAuth();
  }, []);

  return (
    <div className="App" data-theme={theme}>
      <HashRouter>
        <Header
          user={currentUser}
          notifications={notifications}
          changeTheme={changeTheme}
        />
        <Routes>
          <Route
            path={"/"}
            element={
              <HomePage isFollowing={isFollowing} following={following} />
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
            path={"/fumblr/settings/blog"}
            element={<ProfileSettings />}
          ></Route>
          <Route path={"/fumblr/inbox"} element={<Inbox />}></Route>
          <Route
            path={"/fumblr/account/posts"}
            element={
              <UserPosts isFollowing={isFollowing} following={following} />
            }
          ></Route>
          <Route
            path={"/fumblr/account/followers"}
            element={<Followers followers={followers} />}
          ></Route>
          <Route
            path={"/fumblr/account/following"}
            element={<Following following={following} />}
          ></Route>
          <Route
            path={"/fumblr/account/liked-posts"}
            element={
              <SavedPosts
                isFollowing={isFollowing}
                following={following}
                posts={savedPosts}
              />
            }
          ></Route>
          <Route
            path="fumblr/blog/:user"
            element={
              <Blog following={following} isFollowing={isFollowingBlogPage} />
            }
          ></Route>
          <Route
            path="fumblr/post/:id"
            element={<Post isFollowing={isFollowing} user={currentUser} />}
          ></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
