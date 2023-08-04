import { useState, useEffect } from "react";
import Posts from "../pageElements/Posts";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { MainPostClassNames } from "../HelperFunctions";
import { query, ref as dbRef, orderByChild, onValue } from "firebase/database";
import { db } from "../firebase-config";
import like from "../images/like.png";
import liked from "../images/liked.png";

const UserPosts = ({ isFollowing }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const userPosts = query(
        dbRef(db, "user-posts/" + user.displayName),
        orderByChild("descendingOrder")
      );
      onValue(userPosts, (snapshot) => {
        if (snapshot.exists()) {
          let postsArray = [];
          snapshot.forEach((child) => {
            if (
              child.val().favorites !== undefined &&
              Object.keys(child.val().favorites).includes(user.uid)
            ) {
              postsArray.push({
                ...child.val(),
                id: child.key,
                src: liked,
                className: "liked",
              });
            } else {
              postsArray.push({
                ...child.val(),
                id: child.key,
                src: like,
                className: "like",
              });
            }
          });
          setUserPosts(postsArray);
        } else {
          setUserPosts([]);
        }
      });
    }
    if (!user && !loading) navigate("/fumblr/account/login");
  }, [user, loading, navigate]);

  if (loading) {
    return <div id="content">Loading . . .</div>;
  } else {
    return (
      <>
        <div id="content">
          <div id="userPostsPage">
            <div id="userPostTitle">Your Blog Posts</div>
            <Posts
              posts={userPosts}
              isFollowing={isFollowing}
              classNames={MainPostClassNames}
            />
          </div>
        </div>
        <div>FOOTER</div>
      </>
    );
  }
};

export default UserPosts;
