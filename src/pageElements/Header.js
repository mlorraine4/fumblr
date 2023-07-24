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
  togglePostForm,
} from "../HelperFunctions";
import NewPostPopUp from "./NewPostPopUp";
import { useEffect } from "react";

const Header = ({ user, notifications }) => {
  useEffect(() => {
    if (document.querySelector("#notificationIcon")) {
      if (notifications.length !== 0) {
        document.querySelector("#notificationIcon").style.opacity = 1;
      } else {
        document.querySelector("#notificationIcon").style.opacity = 0;
      }
    }
  }, [notifications]);

  if (user !== null) {
    return (
      <>
        <NewPostPopUp user={user} />
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
              <div id="notificationIcon">{notifications.length}</div>
              <NotificationsPopUp user={user} notifications={notifications} />
            </div>
            <div id="headerEditBackground">
              <img
                style={{ height: "30px", width: "30px" }}
                src={edit}
                alt=""
                id="headerNewPostIcon"
                onClick={togglePostForm}
              ></img>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div id="header">
        <img id="logo" alt="" src={logo}></img>
        <div>Search Bar</div>
        <Link to={"/fumblr/account/login"}>
          <Button>Log In</Button>
        </Link>
        <Link to={"/fumblr/account/signup"}>
          <Button>Sign Up</Button>
        </Link>
      </div>
    );
  }
};

export default Header;
