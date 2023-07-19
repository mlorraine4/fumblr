import { signOutUser } from "../HelperFunctions";
import { Link } from "react-router-dom";

const AccountPopUp = ({user, toggleDisplay}) => {
// TODO: toggle display after clicking link
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
        <div className="accountPopUpItem" onClick={toggleDisplay}>
          Posts
        </div>
      </Link>
      <Link to={"/fumblr/account/followers"}>
        <div className="accountPopUpItem" onClick={toggleDisplay}>
          Followers
        </div>
      </Link>
      <Link to="/fumblr/account/liked-posts">
        <div className="accountPopUpItem" onClick={toggleDisplay}>
          Saved Posts
        </div>
      </Link>
      <Link to={"/fumblr/settings/account"}>
        <div className="accountPopUpItem" onClick={toggleDisplay}>
          Settings
        </div>
      </Link>
    </div>
  );
};

export default AccountPopUp;