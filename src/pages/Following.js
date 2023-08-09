import { getAuth } from "firebase/auth";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";

const Following = ({ following }) => {
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
          <div id="followersPageTitle">Following</div>
          {following.map((following) => {
            return (
              <Link to={`/blog/${following.user}`} key={following.user}>
                <div className="followersPageProfile">
                  <img
                    src={following.photoURL}
                    className="followerProfile cover"
                  ></img>
                  <div>{following.user}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <div id="following">Loading . . .</div>;
  }
};

export default Following;
