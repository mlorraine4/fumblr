import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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
      <div id="content">
        <div id="followersPage">
          <div id="followersPageTitle">Your Followers</div>
          {followers.map((follower) => {
            return (
              <Link to={`/blog/${follower.user}`} key={follower.user}>
                <div className="followersPageProfile">
                  <img
                    src={follower.photoURL}
                    className="followerProfile cover"
                  ></img>
                  <div>{follower.user}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <div id="followers">Loading . . .</div>;
  }
};

export default Followers;
