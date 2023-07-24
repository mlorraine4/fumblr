import { signOutUser, toggleAccountDisplay } from "../HelperFunctions";
import { Link } from "react-router-dom";

const AccountPopUp = () => {
  return (
    <div id="accountPopUp" className="hide">
      <div
        className="accountPopUpItem"
        style={{
          display: "flex",
          justifyContent: "space-around",
          borderBottom: "0.5px solid var(--text-primary)",
        }}
      >
        <div>Account</div>
        <div id="logOutBtn" onClick={signOutUser}>
          Log Out
        </div>
      </div>
      <Link to={"/fumblr/posts/user"}>
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Posts
        </div>
      </Link>
      <Link to={"/fumblr/account/followers"}>
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Followers
        </div>
      </Link>
      <Link to="/fumblr/account/liked-posts">
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Saved Posts
        </div>
      </Link>
      <Link to={"/fumblr/settings/account"}>
        <div className="accountPopUpItem" onClick={toggleAccountDisplay}>
          Settings
        </div>
      </Link>
    </div>
  );
};

export default AccountPopUp;