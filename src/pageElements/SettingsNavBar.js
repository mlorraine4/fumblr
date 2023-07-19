import { Link } from "react-router-dom";

const SettingsNavBar = () => {

  function setCurrentPage(e) {
    let links = document.querySelectorAll(".navBarComponent");
    links.forEach((link) => {
      link.classList.remove("currentLink");
    })
    e.target.classList.add("currentLink");
  }

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