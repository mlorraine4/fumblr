import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { submitLogIn } from "../HelperFunctions";

const LogIn = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      return navigate("/");
    }
  }, [user, navigate]);

  return (
    <div id="content">
      <div id="logInPage">
        <div id="logInContent">
          <form id="logInForm" onSubmit={submitLogIn}>
            <div>Log In</div>
            <input type="email" placeholder="email" id="email" required></input>
            <input
              type="password"
              placeholder="password"
              id="password"
              required
            ></input>
            <button type="submit" className="logInBtn">
              Log In
            </button>
            <div id="logInError"></div>
          </form>
          <>
            <div>New to Fumblr?</div>
            <Link to="/fumblr/account/signup">
              <button className="signUpBtn">Sign Up</button>
            </Link>
          </>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
