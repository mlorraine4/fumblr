import { useEffect } from "react";
import Button from "../Button";
import { Link, useNavigate } from "react-router-dom";
import { submitSignUpForm } from "../HelperFunctions";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, sendEmailVerification } from "firebase/auth";

const SignUp = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user && user.emailVerified) {
      return navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div id="content">
        <div id="signUpPage">
          <div id="signUpContent">
            <form id="signUpForm" onSubmit={submitSignUpForm}>
              <div>Sign Up</div>
              <input
                type="email"
                placeholder="email"
                id="email"
                required
              ></input>
              <input
                type="password"
                placeholder="password"
                id="password"
                required
              ></input>
              <input
                placeholder="confirm your password"
                id="confirmPassword"
                required
              ></input>
              <input placeholder="username" required></input>
              <div id="userNameError"></div>
              <button type="submit" className="signUpBtn">
                Sign Up
              </button>
              <div id="signUpError"></div>
            </form>
            <>
              <div>Have an account?</div>
              <Link to="/fumblr/account/login">
                <button className="logInBtn">Log In</button>
              </Link>
            </>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div id="content">
        <div id="emailMsg" style={{ padding: "20px" }}>
          Your email isn't verified yet. Verify your account to post on Fumblr.
        </div>
        <button
          className="accentBtn"
          onClick={() => {
            if (!user.emailVerified) {
              sendEmailVerification(user);
            }
          }}
        >
          Resend Email
        </button>
        <Link to="/fumblr">
          <button className="logInBtn">Return to Dashboard</button>
        </Link>
      </div>
    );
  }
};

export default SignUp;
