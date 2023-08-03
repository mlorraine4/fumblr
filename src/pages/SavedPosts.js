import liked from "../images/liked.png";
import { useState, useEffect } from "react";
import Posts from "../pageElements/Posts";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { MainPostClassNames, getPost } from "../HelperFunctions";
import { db } from "../firebase-config";
import { ref as dbRef, onValue, orderByChild, query } from "firebase/database";

const SavedPosts = ({ isFollowing }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [hasLikes, setHasLikes] = useState(true);
  const [user, loading, error] = useAuthState(auth);

  function listener() {
    const likedPostsRef = query(
      dbRef(db, "user-info/" + user.displayName + "/liked-posts"),
      orderByChild("descendingOrder")
    );
    onValue(likedPostsRef, (snapshot) => {
      let postsArray = [];
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          getPost(child.val().id).then((postSnapshot) => {
            if (postSnapshot.exists()) {
              postsArray.push({
                ...postSnapshot.val(),
                id: child.val().id,
                src: liked,
                className: "liked",
              });
            }
          });
        });
        setPosts(postsArray);
      } else {
        setHasLikes(false);
      }
    });
  }

  useEffect(() => {
    if (user) {
      listener();
    }
    if (!user && !loading) return navigate("/fumblr/account/login");
  }, [user, loading]);

  useEffect(() => {
    console.log(posts);
  }, [posts]);

  if (loading) {
    return <div id="content">Loading . . .</div>;
  } else if (!hasLikes) {
    return (
      <div id="content">
        You have no saved posts. Explore your dashboard and like posts to see
        them here.
      </div>
    );
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
          <Posts
            posts={posts}
            classNames={MainPostClassNames}
            isFollowing={isFollowing}
          />
        </div>
        <div>FOOTER</div>
      </>
    );
  }
};

export default SavedPosts;
