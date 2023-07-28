import { Link } from "react-router-dom";
import { setCurrentPage } from "../HelperFunctions";

const SettingsNavBar = () => {

    return (
      <div id="settingsNavBar">
        <div className="navBarComponent" onClick={setCurrentPage}>
          Account
        </div>
        <Link to={"/fumblr/settings/blog"}>
          <div className="navBarComponent" onClick={setCurrentPage}>
            Blog Appearance
          </div>
        </Link>
        <div className="navBarComponent" onClick={setCurrentPage}>
          Dashboard
        </div>
        <div className="navBarComponent" onClick={setCurrentPage}>
          Notifications
        </div>
        <div className="navBarComponent" onClick={setCurrentPage}>
          Payments & Purchases
        </div>
      </div>
    );
}

export default SettingsNavBar;