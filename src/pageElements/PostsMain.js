import { getDatabase, ref, child, get } from "firebase/database";
import { useState, useEffect } from "react";
import like from "../images/like.png";
import liked from "../images/liked.png";
import Posts from "./Posts";

const PostsMain = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [followers, setFollowers] = useState([]);

  // Retrieves all posts from firebase database.
  function getPosts() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, "posts"))
      .then((snapshot) => {
        if (snapshot.exists()) {
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
    console.log(user);
    const dbRef = ref(getDatabase());
    get(child(dbRef, "user-info/" + user.displayName + "/following"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          console.log(snapshot.val());
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
    getPosts();
    getFollowers();
  }, []);

  return (
    <>
      <Posts posts={posts} followers={followers} />
    </>
  );
};

export default PostsMain;