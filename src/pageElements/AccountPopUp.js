import { signOutUser, toggleAccountDisplay } from "../HelperFunctions";
import { Link } from "react-router-dom";

const AccountPopUp = ({ user, changeTheme }) => {
  return (
    <div id="accountPopUp" className="hide">
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          borderBottom: "0.5px solid var(--text-primary)",
        }}
      >
        <div>Account</div>
        <div id="logOutDiv" onClick={signOutUser}>
          Log Out
        </div>
      </div>
      <Link to="/account/following">
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Following
        </div>
      </Link>
      <Link to="/account/liked-posts">
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Saved Posts
        </div>
      </Link>
      <Link to={"/settings/account"}>
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Settings
        </div>
      </Link>
      <div
        className="accountPopUpItem"
        style={{ borderBottom: "0.5px solid var(--text-primary)" }}
      >
        <button className="accentBtn" onClick={changeTheme}>
          Change Theme
        </button>
      </div>
      <Link to={`/blog/${user.displayName}`}>
        <div onClick={toggleAccountDisplay}>{user.displayName}'s Blog</div>
      </Link>
      <Link to={"/account/posts"}>
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Posts
        </div>
      </Link>
      <Link to={"/account/followers"}>
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Followers
        </div>
      </Link>
    </div>
  );
};

export default AccountPopUp;
