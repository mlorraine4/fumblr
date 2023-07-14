import like from "../images/like.png";
import liked from "../images/liked.png";
import { child, ref, getDatabase, get } from "firebase/database";
import { useState, useEffect } from "react";
import Posts from "../pageElements/Posts";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

// TODO: delete post on unlike, or refresh posts?

const SavedPosts = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [hasLikes, setHasLikes] = useState(true);
  const [user, loading, error] = useAuthState(auth);

  // Retrieves all posts from firebase database.
  function getIDs(displayName) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, "user-info/" + displayName + "/liked-posts"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log("getting snapshot");
          iterateIDs(snapshot.val());
        } else {
          console.log("No data available");
          setHasLikes(false);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function iterateIDs(postsObj) {
    let postIDs = [];
    let ids = Object.values(postsObj);
    ids.forEach((el) => {
      postIDs.push(el.id);
    });
    getLikedPosts(postIDs);
  }

  function getLikedPosts(ids) {
    const postArray = [];
    ids.forEach((id) => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "posts/" + id))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log("getting snapshot");
            postArray.push({
              ...snapshot.val(),
              id: id,
              src: liked,
              className: "liked",
            });
            if (postArray.length === ids.length) {
              sortLikedPosts(postArray);
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }

  // Saves all posts, orders them by most recent, and saves if user has already liked each post.
  function sortLikedPosts(posts) {
    const sortedArray = [];
    for (let i = posts.length - 1; i >= 0; i--) {
      sortedArray.push(posts[i]);
    }
    setPosts(sortedArray);
  }

  //  Retreives who a user is following from firebase.
  function getFollowers(displayName) {
    const dbRef = ref(getDatabase());
    get(child(dbRef, "user-info/" + displayName + "/following"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          iterateFollowers(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  // Saves user followers.
  function iterateFollowers(followersObj) {
    let followersArray = [];
    let followers = Object.values(followersObj);
    followers.forEach((el) => {
      followersArray.push(el.user);
    });
    setFollowers(followersArray);
  }

  useEffect(() => {
    if (user) {
      getIDs(user.displayName);
      getFollowers(user.displayName);
    }
    if (!user) return navigate("/fumblr/account/login");
  }, [user]);

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
          <Posts posts={posts} followers={followers} />
        </div>
        <div>FOOTER</div>
      </>
    );
  }
};

export default SavedPosts;
