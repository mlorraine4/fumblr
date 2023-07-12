import { Link } from "react-router-dom";
import logo from "../images/letter-f.png";
import Button from "../Button";
import NotificationsPopUp from "./NotificationsPopUp";
import AccountPopUp from "./AccountPopUp";
const images = require.context("../images/headerIcons", true);
const imageList = images.keys().map((image) => images(image));

const Header = ({ user}) => {
  
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

  const writePost = () => {};

  if (user !== null) {
    return (
      <div id="header">
        <div style={{ display: "flex" }}>
          <img id="logo" alt="" src={logo}></img>
          <input placeholder="Search Fumblr" id="searchBar"></input>
        </div>
        <div style={{ display: "flex" }}>
          <Link to="/">
            <img src={imageList[0]} alt="" className="navBarIcons"></img>
          </Link>
          <Link to="/fumblr/inbox">
            <img src={imageList[1]} alt="" className="navBarIcons"></img>
          </Link>
          <div style={{ position: "relative" }}>
            <img
              src={imageList[2]}
              alt=""
              className="navBarIcons"
              onClick={toggleAccountDisplay}
            ></img>
            <AccountPopUp user={user}/>
          </div>
          <div style={{ position: "relative" }}>
            <img
              src={imageList[3]}
              alt=""
              className="navBarIcons"
              onClick={toggleNotificationsDisplay}
            ></img>
            <NotificationsPopUp user={user} />
          </div>
          <img
            src={imageList[4]}
            alt=""
            className="navBarIcons"
            onClick={writePost}
          ></img>
        </div>
      </div>
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
