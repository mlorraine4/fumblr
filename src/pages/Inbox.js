import Header from "../pageElements/Header";

const Inbox = ({user}) => {
  return (
    <>
      <Header user={user} />
      <div id="inboxContent">
        <div>You have no new messages.</div>
        <div>View all your messages here.</div>
      </div>
      <div>[footer]</div>
    </>
  );
};

export default Inbox;