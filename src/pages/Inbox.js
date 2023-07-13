import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Header from "../pageElements/Header";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

const Inbox = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!user) navigate("/fumblr/account/login");
  }, [user]);

  useEffect(() => {
    if (loading) {
      document.querySelector("#content").innerHTML = "Loading . . .";
      return;
    }
    if (user) {
    }
    if (!user) return navigate("/fumblr/account/login");
  }, [user, loading]);

  return (
    <div id="content">
      <div id="inboxContent">
        <div>You have no new messages.</div>
        <div>View all your messages here.</div>
      </div>
      <div>[footer]</div>
    </div>
  );
};

export default Inbox;