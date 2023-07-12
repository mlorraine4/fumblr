import SettingsNavBar from "../pageElements/SettingsNavBar";

const AccountSettings = ({ user }) => {
  if (user !== null) {
    return (
      <div id="content" style={{ display: "flex" }}>
        <div>
          <div>Account Settings</div>
          <div>Email</div>
          <div>Password</div>
          <div>Log In Options</div>
        </div>
        <SettingsNavBar />
      </div>
    );
  }
};

export default AccountSettings;
