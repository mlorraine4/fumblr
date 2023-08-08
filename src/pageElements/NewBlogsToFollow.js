import { useEffect, useState } from "react";
import {
  RadarClassNames,
  getBlogProfiles,
  pickRandomBlogs,
  pickRandomPost,
} from "../HelperFunctions";
import RandomBlogs from "./RandomBlogs";
import PostsWithoutProfile from "./PostsWithoutProfile";
import Footer from "./Footer";

const NewBlogsToFollow = ({ posts, isFollowing }) => {
  const [randomBlogs, setRandomBlogs] = useState([]);
  const [randomPost, setRandomPost] = useState([]);

  useEffect(() => {
    getBlogProfiles().then((snapshot) => {
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

  useEffect(() => {}, [randomPost]);

  return (
    <>
      <div className="newBlogsContainer">
        <div className="newBlogsTitle">Check out these bloggers</div>
        <RandomBlogs blogs={randomBlogs} isFollowing={isFollowing} />
      </div>
      <div className="newBlogsContainer">
        <div className="newBlogsTitle">
          <div>Radar</div>
          <button
            className="accentBtn"
            onClick={() => {
              setRandomPost(pickRandomPost(posts));
            }}
          >
            Refresh
          </button>
        </div>
        <PostsWithoutProfile
          posts={randomPost}
          classNames={RadarClassNames}
          isFollowing={isFollowing}
        />
        <Footer />
      </div>
    </>
  );
};

export default NewBlogsToFollow;
