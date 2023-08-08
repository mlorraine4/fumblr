import { Link } from "react-router-dom";
import { submitLogInPopUp, toggleLogInPopUp } from "../HelperFunctions";

const LogInPopUp = () => {
  return (
    <div id="logInPopUp" className="hide">
      <button id="closeLogInPopUpBtn" className="closeBtn" onClick={toggleLogInPopUp}>x</button>
      <div id="logInPopUpTitle">Sign up to Fumblr to explore all of its features!</div>
      <div id="logInContent">
        <form id="logInForm" onSubmit={submitLogInPopUp}>
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
  );
};

export default LogInPopUp;
