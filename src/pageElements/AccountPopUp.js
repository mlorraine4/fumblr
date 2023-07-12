import { signOutUser } from "../HelperFunctions";
import { Link } from "react-router-dom";

const AccountPopUp = ({user}) => {
// TODO: toggle display after clicking link
  return (
    <div id="accountPopUp" className="hide">
      <div
        className="pad"
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
        <div className="pad">Posts</div>
      </Link>
      <Link to={"/fumblr/posts/user"}>
        <div className="pad">Followers</div>
      </Link>
      <div className="pad">Saved Posts</div>
      <Link to={"/fumblr/settings/account"}>
        <div className="pad">Settings</div>
      </Link>
    </div>
  );
};

export default AccountPopUp;