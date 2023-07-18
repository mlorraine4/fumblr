import { Link } from "react-router-dom";

const SettingsNavBar = () => {
    return (
      <div id="settingsNavBar">
        <div className="navBarComponent">Account</div>
        <Link to={"/fumblr/settings/blog"}>
          <div className="navBarComponent">Blog Appearance</div>
        </Link>
        <div className="navBarComponent">Dashboard</div>
        <div className="navBarComponent">Notifications</div>
        <div className="navBarComponent">Payments & Purchases</div>
      </div>
    );
}

export default SettingsNavBar;