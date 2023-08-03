import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const Followers = ({ followers }) => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!user & !loading) return navigate("/fumblr/account/login");
  }, [user, navigate, loading]);

  if (user) {
    return (
      <div id="followers">
        <div>Your Followers:</div>
        {followers.map((follower, index) => {
          return (
            <div key={index} style={{ display: "flex" }}>
              <img
                src={follower.photoURL}
                className="followerProfile cover"
              ></img>
              <div>{follower.user}</div>
            </div>
          );
        })}
      </div>
    );
  } else {
    return <div id="followers">Loading . . .</div>;
  }
};

export default Followers;
