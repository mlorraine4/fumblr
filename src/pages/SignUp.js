import { useEffect } from "react";
import Button from "../Button";
import { Link, useNavigate } from "react-router-dom";
import { submitSignUpForm } from "../HelperFunctions";

const SignUp = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.emailVerified) {
      return navigate("/");
    }
  }, [navigate, user]);

  if (user === null) {
    return (
      <>
        <form onSubmit={submitSignUpForm}>
          <div>Sign Up</div>
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
