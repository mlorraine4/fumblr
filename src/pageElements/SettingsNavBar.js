import { Link } from "react-router-dom";

const SettingsNavBar = () => {
    return (
      <div>
        <div>Account</div>
        <Link to={"/fumblr/settings/blog"}>
          <div>Blog Appearance</div>
        </Link>
        <div>Dashboard</div>
        <div>Notifications</div>
        <div>Payments & Purchases</div>
      </div>
    );
}

export default SettingsNavBar;