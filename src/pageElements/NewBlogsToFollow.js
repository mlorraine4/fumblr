import { getDatabase, ref, child, get } from "firebase/database";
import { useEffect, useState } from "react";
import Blogs from "./Blogs";
import Posts from "./Posts";
import like from "../images/like.png";
import liked from "../images/liked.png";
import { getAuth } from "firebase/auth";

const NewBlogsToFollow = ({ followers, isFollowing }) => {
  const [randomBlogs, setRandomBlogs] = useState([]);
  const [randomPosts, setRandomPosts] = useState([]);

  const classNames = {
    post: "radarPost",
    // posts
    profile: "radarProfile cover",
    // userProfile cover
    postImg: "radarImg",
    // postImg
    postTitle: "radarTitle",
    // postTitle
    postBody: "radarBody",
  };

  function getBlogs() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, "user-profiles"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          pickRandomBlogs(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function pickRandomBlogs(blogsObj) {
    let blogs = Object.values(blogsObj);
    console.log(blogs);
    if (blogs.length > 4) {
    } else {
      setRandomBlogs(blogs);
    }
  }

  function getPosts() {
    const dbRef = ref(getDatabase());
    get(child(dbRef, "posts"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          pickRandomPost(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function pickRandomPost(postsObj) {
    let user = getAuth().currentUser;
    let posts = Object.values(postsObj);
    let maxIndex = posts.length + 1;
    let randomIndex = Math.floor(Math.random()*maxIndex);
    let post = posts[randomIndex];
    console.log(randomIndex)
    let currentPost = [];
    if (
      post.favorites !== undefined &&
      Object.keys(post.favorites).includes(user.uid)
    ) {
      currentPost.push({
        ...post,
        id: randomIndex,
        src: liked,
        className: "liked",
      });
    } else {
      currentPost.push({
        ...post,
        id: randomIndex,
        src: like,
        className: "like",
      });
    }
    setRandomPosts(currentPost);
  }

  useEffect(() => {
    getBlogs();
    getPosts();
  }, []);

  return (
    <>
      <div className="newBlogsContainer">
        <div className="newBlogsTitle">Check out these bloggers</div>
        <Blogs blogs={randomBlogs} isFollowing={isFollowing} />
      </div>
      <div className="newBlogsContainer">
        <div className="newBlogsTitle">
          <div>Radar</div>
          <button id="refreshBtn" onClick={getPosts}>Refresh</button>
        </div>
        <Posts
          posts={randomPosts}
          followers={followers}
          classNames={classNames}
          isFollowing={isFollowing}
        />
      </div>
    </>
  );
};

export default NewBlogsToFollow;
