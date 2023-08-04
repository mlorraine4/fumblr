import { signOutUser, toggleAccountDisplay } from "../HelperFunctions";
import { Link } from "react-router-dom";

const AccountPopUp = ({ user }) => {
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
      <Link>
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Following
        </div>
      </Link>
      <Link to="/fumblr/account/liked-posts">
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Saved Posts
        </div>
      </Link>
      <Link to={"/fumblr/settings/account"}>
        <div
          className="accountPopUpItem"
          onClick={toggleAccountDisplay}
          style={{ borderBottom: "0.5px solid var(--text-primary)" }}
        >
          Settings
        </div>
      </Link>
      <Link to={`/fumblr/blog/${user.displayName}`}>
        <div onClick={toggleAccountDisplay}>{user.displayName}'s Blog</div>
      </Link>
      <Link to={"/fumblr/account/posts"}>
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Posts
        </div>
      </Link>
      <Link to={"/fumblr/account/followers"}>
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Followers
        </div>
      </Link>
    </div>
  );
};

export default AccountPopUp;
