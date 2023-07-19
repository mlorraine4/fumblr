import { getDatabase, ref, child, get } from "firebase/database";
import { useState, useEffect } from "react";
import like from "../images/like.png";
import liked from "../images/liked.png";
import Posts from "./Posts";

const PostsMain = ({ user, followers, isFollowing }) => {
  const [posts, setPosts] = useState([]);

  const classNames = {
    post: "post",
    profile: "userProfile cover",
    postImg: "postImg",
    postTitle: "postTitle",
    postBody: "postBody"
  };

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

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <Posts
        posts={posts}
        classNames={classNames}
        isFollowing={isFollowing}
      />
    </>
  );
};

export default PostsMain;
