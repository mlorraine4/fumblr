import { Link } from "react-router-dom";
import logo from "../images/letter-f.png";
import Button from "../Button";
import NotificationsPopUp from "./NotificationsPopUp";
import AccountPopUp from "./AccountPopUp";
import home from "../images/home.png";
import profile from "../images/user.png";
import bell from "../images/bell.png";
import message from "../images/envelope.png";
import edit from "../images/edit.png";
import {
  hidePopUps,
  toggleAccountDisplay,
  toggleNotificationsDisplay,
  toggleTextOnlyPostForm,
} from "../HelperFunctions";
import { NewPostTextOnlyForm } from "./NewPostPopUp";
import { useEffect } from "react";

const Header = ({ user, notifications }) => {

  if (user) {
    return (
      <>
        <NewPostTextOnlyForm user={user} />
        <div id="header">
          <div style={{ display: "flex" }}>
            <img id="logo" alt="" src={logo}></img>
            <input placeholder="Search Fumblr" id="searchBar"></input>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "250px",
              justifyContent: "space-evenly",
              marginRight: "20px",
            }}
          >
            <Link to="/">
              <img
                src={home}
                alt=""
                className="navBarIcons"
                onClick={hidePopUps}
              ></img>
            </Link>
            <Link to="/fumblr/inbox">
              <img
                src={message}
                alt=""
                className="navBarIcons"
                onClick={hidePopUps}
              ></img>
            </Link>
            <div style={{ position: "relative" }}>
              <img
                src={profile}
                alt=""
                className="navBarIcons"
                onClick={toggleAccountDisplay}
              ></img>
              <AccountPopUp user={user} />
            </div>
            <div style={{ position: "relative" }}>
              <img
                src={bell}
                alt=""
                className="navBarIcons"
                onClick={toggleNotificationsDisplay}
              ></img>
              <div id="notificationIcon"></div>
              <NotificationsPopUp user={user} notifications={notifications} />
            </div>
            <div id="headerEditBackground">
              <img
                style={{ height: "30px", width: "30px" }}
                src={edit}
                alt=""
                id="headerNewPostIcon"
                onClick={toggleTextOnlyPostForm}
              ></img>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div id="header">
        <div style={{ display: "flex" }}>
          <img id="logo" alt="" src={logo}></img>
          <input placeholder="Search Fumblr" id="searchBar"></input>
        </div>
        <div>
          <Link to={"/fumblr/account/login"}>
            <button className="logInBtn">Log In</button>
          </Link>
          <Link to={"/fumblr/account/signup"}>
            <button className="signUpBtn">Sign Up</button>
          </Link>
        </div>
      </div>
    );
  }
};

export default Header;
