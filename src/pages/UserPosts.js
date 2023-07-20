import { useState, useEffect } from "react";
import Posts from "../pageElements/Posts";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { MainPostClassNames, getUserPosts, iteratePosts } from "../HelperFunctions";

const UserPosts = ({isFollowing}) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      getUserPosts().then((snapshot) => {
        if (snapshot.exists()) {
          setUserPosts(iteratePosts(snapshot.val()));
        }
      })
    }
    if (!user) navigate("/fumblr/account/login");
  }, [user, getUserPosts]);

  if (loading) {
    return <div id="content">Loading . . .</div>;
  } else {
    return (
      <>
        <div
          id="content"
          style={{
            width: "min-content",
            marginLeft: "calc((100vw - 500px)/2 - 225px)",
          }}
        >
          <div id="userPostTitle">Your Blog Posts</div>
          <Posts posts={userPosts} isFollowing={isFollowing} classNames={MainPostClassNames} />
        </div>
        <div>FOOTER</div>
      </>
    );
  }
};

export default UserPosts;
