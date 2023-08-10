import { useNavigate } from "react-router-dom";
import { getNotificationClassName, hideDeleteNotificationBtn, markNotificationAsSeen, removeNotification, removeNotificationDot, showDeleteNotificationBtn, toggleNotificationsDisplay } from "../HelperFunctions";
import dot from "../images/dot.png";

const NotificationsPopUp = ({ user, notifications }) => {
  const navigate = useNavigate();

  function navigateToNotification(notification) {
    if (notification.type === "like") {
      return navigate(`/post/${notification.id}`);
    } if (notification.type === "message") {
      return navigate("/inbox");
    }
    if (notification.type === "follow") {
      return navigate(`/blog/${notification.sender}`);
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
              <div
                onClick={() => {
                  navigateToNotification(notification);
                  toggleNotificationsDisplay();
                }}
              >
                {notification.notification}
              </div>
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
