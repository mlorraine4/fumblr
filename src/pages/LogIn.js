import Button from "../Button";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useEffect } from "react";

const LogIn = ({ user }) => {
  const navigate = useNavigate();

  function submitLogIn(e) {
    e.preventDefault();
    let email = e.target["email"].value;
    let password = e.target["password"].value;
    signInUserWithEmail(email, password);
  }

  // Sign in user with email and password.
  function signInUserWithEmail(email, password) {
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
        // console.log(errorCode);
        if (errorCode === "auth/user-not-found") {
          document.getElementById("logInError").innerHTML =
            "Account is not found. Sign up below!";
        }
      });
  }

  useEffect(() => {
    console.log(user);
    // Checks if user is already logged in, if so redirects to dashboard.
    if (user !== null) {
      navigate("/");
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
