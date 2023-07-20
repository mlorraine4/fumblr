import { useEffect, useState } from "react";
import Blogs from "./Blogs";
import Posts from "./Posts";
import {
  RadarClassNames,
  getBlogs,
  pickRandomBlogs,
  pickRandomPost,
} from "../HelperFunctions";

const NewBlogsToFollow = ({ posts, isFollowing }) => {
  const [randomBlogs, setRandomBlogs] = useState([]);
  const [randomPost, setRandomPost] = useState([]);

  useEffect(() => {
    getBlogs().then((snapshot) => {
      if (snapshot.exists()) {
        setRandomBlogs(pickRandomBlogs(snapshot.val()));
      }
    });
  }, []);

  useEffect(() => {
    if (posts.length !== 0) {
      setRandomPost(pickRandomPost(posts));
    }
  }, [posts]);

  useEffect(() => {
  }, [randomPost]);

  return (
    <>
      <div className="newBlogsContainer">
        <div className="newBlogsTitle">Check out these bloggers</div>
        <Blogs blogs={randomBlogs} isFollowing={isFollowing} />
      </div>
      <div className="newBlogsContainer">
        <div className="newBlogsTitle">
          <div>Radar</div>
          <button
            id="refreshBtn"
            onClick={() => {
              setRandomPost(pickRandomPost(posts));
            }}
          >
            Refresh
          </button>
        </div>
        <Posts
          posts={randomPost}
          classNames={RadarClassNames}
          isFollowing={isFollowing}
        />
      </div>
    </>
  );
};

export default NewBlogsToFollow;
