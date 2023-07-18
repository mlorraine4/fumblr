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
import { togglePostForm } from "../HelperFunctions";
import NewPostPopUp from "./NewPostPopUp";

const Header = ({ user }) => {
  function toggleNotificationsDisplay() {
    if (!document.getElementById("accountPopUp").classList.contains("hide")) {
      document.getElementById("accountPopUp").classList.add("hide");
    }
    document.getElementById("notificationsPopUp").classList.toggle("hide");
  }

  function toggleAccountDisplay() {
    if (
      !document.getElementById("notificationsPopUp").classList.contains("hide")
    ) {
      document.getElementById("notificationsPopUp").classList.add("hide");
    }
    document.getElementById("accountPopUp").classList.toggle("hide");
  }

  function hidePopUps() {
    if (
      !document.getElementById("notificationsPopUp").classList.contains("hide")
    ) {
      document.getElementById("notificationsPopUp").classList.add("hide");
    }
    if (!document.getElementById("accountPopUp").classList.contains("hide")) {
      document.getElementById("accountPopUp").classList.add("hide");
    }
  }

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
              width: "250px",
              justifyContent: "space-evenly",
              marginRight: "20px"
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
              <AccountPopUp user={user} toggleDisplay={toggleAccountDisplay} />
            </div>
            <div style={{ position: "relative" }}>
              <img
                src={bell}
                alt=""
                className="navBarIcons"
                onClick={toggleNotificationsDisplay}
              ></img>
              <NotificationsPopUp user={user} />
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
