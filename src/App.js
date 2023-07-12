import "./styles/App.css";
import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirebaseConfig, db } from "./firebase-config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { HashRouter, Routes, Route } from "react-router-dom";
import AccountSettings from "./pages/AccountSettings";
import Inbox from "./pages/Inbox";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import HomePage from "./pages/HomePage";
import UserPosts from "./pages/UserPosts";
import Header from "./pageElements/Header";
import ProfileSettings from "./pages/ProfileSettings";

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
  const [theme, setTheme] = useState("default");
  const [userFeed, setUserFeed] = useState("home");

  function updateFeed(feed) {
    console.log(feed);
    setUserFeed(feed);
  }

  // Observer for user sign in status.
  function initalizeFirebaseAuth() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        // ...
        setCurrentUser(user);
      } else {
        // User is signed out
        // ...
        setCurrentUser(user);
      }
    });
  }

  function changeTheme() {
    if (theme === 'default') {
      setTheme('dark');
    } else {
      setTheme('default');
    }
  }

  const firebaseAppConfig = getFirebaseConfig();
  initializeApp(firebaseAppConfig);
  initalizeFirebaseAuth();

  return (
    <div className="App" data-theme={"dark"}>
      <HashRouter>
        <Header user={currentUser} />
        <Routes>
          <Route
            path={"/"}
            element={<HomePage user={currentUser} />}
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
            element={<ProfileSettings user={currentUser} />}
          ></Route>
          <Route
            path={"/fumblr/inbox"}
            element={<Inbox user={currentUser} />}
          ></Route>
          <Route
            // TODO: how to make dynamic links using user name (want user = display name)
            path={"/fumblr/posts/user"}
            element={<UserPosts user={currentUser} />}
          ></Route>
        </Routes>
      </HashRouter>
    </div>
  );
}

export default App;
