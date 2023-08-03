import { useNavigate } from "react-router-dom";
import { markNotificationAsSeen, removeNotification, toggleNotificationsDisplay } from "../HelperFunctions";
import dot from "../images/dot.png";

const NotificationsPopUp = ({ user, notifications }) => {
  const navigate = useNavigate();

  function removeNotificationDot(e) {
    if (e.target.querySelector(".notificationDot")) {
      e.target.querySelector(".notificationDot").classList.add("noOpacity");
    }
  }

  function showDeleteNotificationBtn(e) {
    if (e.target.querySelector(".deleteNotification")) {
      e.target
        .querySelector(".deleteNotification")
        .classList.add("fullOpacity");
      e.target
        .querySelector(".deleteNotification")
        .classList.remove("noOpacity");
    }
  }

  function hideDeleteNotificationBtn(e) {
    if (e.target.querySelector(".deleteNotification")) {
      e.target
        .querySelector(".deleteNotification")
        .classList.remove("fullOpacity");
      e.target.querySelector(".deleteNotification").classList.add("noOpacity");
    }
  }

  function getNotificationClassName(seen) {
    if (seen) {
      return "notificationDot noOpacity";
    } else {
      return "notificationDot fullOpacity";
    }
  }

  function showNotification(notification) {
    if (notification.type === "like") {
      return navigate(`/fumblr/post/${notification.id}`);
    } if (notification.type === "message") {
      return navigate("/fumblr/inbox");
    }
    if (notification.type === "follow") {
      return navigate(`/fumblr/blog/${notification.sender}`);
    }
  }

  if (notifications.length !== 0) {
    return (
      <div id="notificationsPopUp" className="hide">
        <div>Notifications</div>
        {notifications.map((notification) => {
          return (
            <div
              className="notificationDiv"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              key={notification.id}
              onClick={() => {showNotification(notification)
              toggleNotificationsDisplay()}}
              onMouseEnter={(e) => {
                removeNotificationDot(e);
                showDeleteNotificationBtn(e);
                markNotificationAsSeen(
                  e,
                  notification.seen,
                  notification.sender,
                  notification.type,
                  notification.id,
                  notification.recipient
                );
              }}
              onMouseLeave={hideDeleteNotificationBtn}
            >
              <div className="notificationDotContainer">
                <img
                  src={dot}
                  className={getNotificationClassName(notification.seen)}
                ></img>
              </div>
              <div>{notification.notification}</div>
              <button
                className="deleteNotification noOpacity"
                onClick={() => {
                  removeNotification(
                    notification.type,
                    notification.sender,
                    notification.recipient,
                    notification.id
                  );
                }}
              >
                x
              </button>
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div id="notificationsPopUp" className="hide">
        <div>{user.displayName}</div>
        <div>Check out this tab to see new followers, likes, and messages.</div>
        <div>You have no new notifications.</div>
      </div>
    );
  }
};

export default NotificationsPopUp;
