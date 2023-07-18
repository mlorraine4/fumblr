
const NotificationsPopUp = ({user}) => {
  return (
  <div id="notificationsPopUp" className="hide">
    <div>{user.displayName}</div>
    <div>Check out this tab to see new followers, likes, and reblogs.</div>
  </div>
  )
};

export default NotificationsPopUp;