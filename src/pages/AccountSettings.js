import { getAuth, updateEmail } from "firebase/auth";
import SettingsNavBar from "../pageElements/SettingsNavBar";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AccountSettings = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const [emailDisabled, setEmailDisabled] = useState(true);
  const [passwordDisabled, setPasswordDisabled] = useState(true);

  useEffect(() => {
    if (!user && !loading) {
      return navigate("/fumblr/account/login");
    }
  }, [user, navigate, loading]);

  function toggleUpdateEmailForm() {
    document.querySelector("#updateEmailContainer").classList.toggle("hide");
    document.getElementById("content").classList.toggle("fade");
    document.getElementById("content").classList.toggle("stop-scrolling");
    document.getElementById("header").classList.toggle("fade");
  }

  function toggleUpdatePasswordForm() {
    document.querySelector("#updatePasswordContainer").classList.toggle("hide");
    document.getElementById("content").classList.toggle("fade");
    document.getElementById("content").classList.toggle("stop-scrolling");
    document.getElementById("header").classList.toggle("fade");
  }

  function updateUserEmail(e) {
    e.preventDefault();
    let currentEmail = document.getElementById("currentEmail").value;
    let newEmail = document.getElementById("newEmail");

    if (user.email === currentEmail) {
      updateEmail(user, newEmail)
        .then(() => {})
        .catch((error) => {
          console.log(error);
        });
    } else {
      document.getElementById("updateEmailError").innerHTML = "email does not match our records";
    }
  }

  function checkIfEmailsMatch() {
    let email = document.getElementById("newEmail").value;
    let confirmEmail = document.getElementById("confirmEmail").value;

    if (email === confirmEmail) {
      document.getElementById("emailInfo").innerHTML = "emails match!";
      document.getElementById("emailInfo").style.opacity = 1;
      setEmailDisabled(false);
    } else {
      document.getElementById("emailInfo").innerHTML = "*emails do not match";
      document.getElementById("emailInfo").style.opacity = 1;
      setEmailDisabled(true);
    }
  }

  if (user) {
    return (
      <div id="content" style={{ display: "flex" }}>
        <div id="accountPage">
          <div style={{fontWeight: "bold"}}>Account</div>
          <div id="updateEmailContainer" className="hide">
            <form id="updateEmailForm">
              <input
                id="currentEmail"
                placeholder="current email"
                type="email"
              ></input>
              <input
                id="newEmail"
                placeholder="new email"
                type="email"
                onChange={checkIfEmailsMatch}
              ></input>
              <input
                id="confirmEmail"
                placeholder="confirm new email"
                type="email"
                onChange={checkIfEmailsMatch}
              ></input>
              <div id="emailInfo"></div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button onClick={updateUserEmail} disabled={emailDisabled}>
                  update email
                </button>
                <button>cancel</button>
              </div>
              <div id="updateEmailError"></div>
            </form>
          </div>
          <div id="updatePasswordContainer" className="hide">
            <form id="updatePasswordForm">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <label htmlFor="currentPassword"></label>
                <input id="currentPassword"></input>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <label htmlFor="newPassword"></label>
                <input id="newPassword"></input>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <label htmlFor="confirmPassword"></label>
                <input id="confirmPassword"></input>
              </div>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <button>update password</button>
                <button>cancel</button>
              </div>
            </form>
          </div>
          <div id="accountInfo">
            <div className="flex-end">
              <div className="flex-left">
                <div className="accountSettingsHead">Email</div>
                <div>{user.email}</div>
              </div>
              <button>edit</button>
            </div>
            <div className="flex-end">
              <div className="flex-left">
                <div className="accountSettingsHead">Password</div>
                <div>*********</div>
              </div>
              <button>edit</button>
            </div>
          </div>
        </div>
        <SettingsNavBar />
      </div>
    );
  }
};

export default AccountSettings;
