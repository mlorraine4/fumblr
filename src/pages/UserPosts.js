import Header from "../pageElements/Header";
import like from "../images/like.png";
import liked from "../images/liked.png";
import { child, ref, getDatabase, get } from "firebase/database";
import { useState, useEffect } from "react";
import Posts from "../pageElements/Posts";

const UserPosts = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    // Retrieves all posts from firebase database.
    function getPosts() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "user-posts/" + user.displayName))
        .then((snapshot) => {
          if (snapshot.exists()) {
            console.log("getting snapshot")
            iteratePosts(snapshot.val());
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }

    // Saves all posts, orders them by most recent, and saves if user has already liked each post.
    function iteratePosts(postsObj) {
      let postsArray = [];
      let sortedArray = [];
      let posts = Object.values(postsObj);
      let ids = Object.keys(postsObj);
      posts.forEach((el) => {
        if (
          el.favorites !== undefined &&
          Object.keys(el.favorites).includes(user.uid)
        ) {
          postsArray.push({
            ...el,
            id: ids[posts.indexOf(el)],
            src: liked,
            className: "liked",
          });
        } else {
          postsArray.push({
            ...el,
            id: ids[posts.indexOf(el)],
            src: like,
            className: "like",
          });
        }
      });
      for (let i = postsArray.length - 1; i >= 0; i--) {
        sortedArray.push(postsArray[i]);
      }
      setPosts(sortedArray);
    }

    //  Retreives who a user is following from firebase.
    function getFollowers() {
      const dbRef = ref(getDatabase());
      get(child(dbRef, "user-info/" + user.displayName + "/following"))
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

    getPosts();
    getFollowers();
  }, []);

  if (user !== null) {
    return (
      <>
        <div
          style={{
            width: "min-content",
            marginLeft: "calc((100vw - 500px)/2 - 225px)",
            paddingTop: "50px",
          }}
        >
          <Posts posts={posts} followers={followers} />
        </div>
        <div>FOOTER</div>
      </>
    );
  } else {
    return (
      <div>user not logged in</div>
    )
  }
};

export default UserPosts;
