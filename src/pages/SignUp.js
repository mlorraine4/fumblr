import { useEffect } from "react";
import Button from "../Button";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  updateProfile,
} from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import { ref, update, child, get } from "firebase/database";
import { db } from "../firebase-config";

const SignUp = ({ user }) => {
  const navigate = useNavigate();

  // Sign up form.
  function submitForm(e) {
    e.preventDefault();
    let email = e.target["email"].value;
    let password = e.target["password"].value;
    let displayName = e.target["username"].value;

    if (!getUserNames(displayName)) {
      console.log("adding new user");
      addNewUser(email, password, displayName);
    } else {
      document.getElementById("userNameError").innerHTML =
        "Username is already taken. Please choose another.";
    }
  }

  // Gets every username from database.
  function getUserNames(displayName) {
    get(child(ref(db), "/allUserNames"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
          isNameTaken(snapshot.val(), displayName);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Iterates through all saved usernames to determine if a name is already taken.
  function isNameTaken(userNames, newName) {
    let userInfo = Object.values(userNames);
    userInfo.forEach((el) => {
      if (newName === el.userName) {
        return true;
      }
    });
    return false;
  }

  // Creates a new user with firebase auth.
  function addNewUser(email, password, displayName) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        sendUserEmailVerification();
        updateUserProfile(displayName);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        if (errorCode === "auth/email-already-in-use") {
          document.getElementById("signUpError").innerHTML =
            "Account already exists.";
        } else {
          document.getElementById("signUpError").innerHTML =
            "There was an error signing up. Please try again.";
        }
      });
  }

  // Sends new user a verification email.
  function sendUserEmailVerification() {
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

  // Update new user profile to firebase auth.
  function updateUserProfile(displayName) {
    const auth = getAuth();

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

  // After sign up, create and save user info in database.
  function createUserInfo() {
    const uid = user.uid;

    const data = {
      uid: uid,
      displayName: user.displayName,
    };

    const userNameData = {
      userName: user.displayName,
    };

    const pictureData = {
      photoURL:
        "https://firebasestorage.googleapis.com/v0/b/fake-social-app-e763d.appspot.com/o/new_user.png?alt=media&token=445485db-8fce-4b84-8f71-136c1d7e92b1",
      user: user.displayName,
    };

    const updates = {};
    updates[
      "/user-info/" + user.displayName + "/followers/" + user.displayName
    ] = data;
    updates[
      "/user-info/" + user.displayName + "/following/" + user.displayName
    ] = data;
    updates["/allUserNames/" + uid] = userNameData;
    updates["/profile-pictures/" + user.displayName] = pictureData;

    // Writes data simutaneoulsy in database.
    update(ref(db), updates)
      .then(() => {
        // Data saved successfully!
        console.log("info saved!");
      })
      .catch((error) => {
        // The write failed...
        console.log(error);
      });
  }

  useEffect(() => {
    if (user && user.emailVerified) {
      return navigate("/");
    }
  }, [navigate, user]);

  if (user === null) {
    return (
      <>
        <form onSubmit={submitForm}>
          <div>Sign Up</div>
          <button onClick={getUserNames}>save</button>
          <input type="email" placeholder="email" id="email"></input>
          <input type="password" placeholder="password" id="password"></input>
          <input
            placeholder="confirm your password"
            id="confirmPassword"
          ></input>
          <input placeholder="username"></input>
          <div id="userNameError"></div>
          <Button type="submit">Sign Up</Button>
          <Button>x</Button>
          <div id="signUpError"></div>
        </form>
        <>
          <div>Have an account?</div>
          <Link to="/fumblr/account/login">
            <Button>Log In</Button>
          </Link>
        </>
      </>
    );
  } else {
    return (
      <>
        <div id="emailMsg"></div>
        <Button>Resend Email</Button>
        <Button>Return to Dashboard</Button>
      </>
    );
  }
};

export default SignUp;
