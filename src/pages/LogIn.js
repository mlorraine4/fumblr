import Button from "../Button";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const LogIn = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);

  function submitLogIn(e) {
    e.preventDefault();
    let email = e.target["email"].value;
    let password = e.target["password"].value;
    signInUserWithEmail(email, password);
  }

  // Sign in user with email and password.
  function signInUserWithEmail(email, password) {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // console.log(errorCode);
        if (errorCode === "auth/user-not-found") {
          document.getElementById("logInError").innerHTML =
            "Account is not found. Sign up below!";
        }
      });
  }

  useEffect(() => {
    if (!user) {
      return navigate("/");
    }
  }, [user]);

  return (
    <>
      <form onSubmit={submitLogIn}>
        <div>Log In</div>
        <input type="email" placeholder="email" id="email" required></input>
        <input
          type="password"
          placeholder="password"
          id="password"
          required
        ></input>
        <Button type="submit">Log In</Button>
        <Button>x</Button>
        <div id="logInError"></div>
      </form>
      <>
        <div>New to Fumblr?</div>
        <Link to="/fumblr/account/signup">
          <Button>Sign Up</Button>
        </Link>
      </>
    </>
  );
};

export default LogIn;
