import { removeNotification } from "../HelperFunctions";

const NotificationsPopUp = ({user, notifications}) => {

  if (notifications.length !== 0) {
    return (
      <div id="notificationsPopUp" className="hide">
        <div>{user.displayName}</div>
        {notifications.map((notification) => {
          return (
            <div className="notificationDiv" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}} key={notification.notificationID}>
              <div>{notification.notification}</div>
              <button id="deleteNotification" onClick={() => {
                removeNotification(notification.type, notification.sender, notification.recipient, notification.id);
                }}>x</button>
            </div>
          )
        })}
      </div>
    );
  } else { return (
    <div id="notificationsPopUp" className="hide">
      <div>{user.displayName}</div>
      <div>Check out this tab to see new followers, likes, and messages.</div>
      <div>You have no new notifications.</div>
    </div>
  )
  }
};

export default NotificationsPopUp;