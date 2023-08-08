import NewPostButtons from "../pageElements/NewPostButtons";
import {
  NewPostTextOnlyForm,
  NewPostWithPhotoForm,
} from "../pageElements/NewPostPopUp";
import NewBlogsToFollow from "../pageElements/NewBlogsToFollow";
import { db, storage } from "../firebase-config";
import {
  push,
  child,
  query,
  orderByChild,
  ref as dbRef,
  update,
  getDatabase,
  get,
  onValue,
} from "firebase/database";
import like from "../images/like.png";
import liked from "../images/liked.png";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { MainPostClassNames } from "../HelperFunctions";
import Posts from "../pageElements/Posts";
import LogInPopUp from "../pageElements/LogInPopUp";

const HomePage = ({ isFollowing, following }) => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    if (user) {
      // Get all posts in database.
      const postsRef = query(
        dbRef(db, "posts/"),
        orderByChild("descendingOrder")
      );
      onValue(
        postsRef,
        (snapshot) => {
          let postsArray = [];
          if (snapshot.exists()) {
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
            setAllPosts(postsArray);
          }
        },
        {
          onlyOnce: true,
        }
      );
    }

    if (!user && !loading) {
      // Get all posts in database.
      const postsRef = query(
        dbRef(db, "posts/"),
        orderByChild("descendingOrder")
      );
      onValue(
        postsRef,
        (snapshot) => {
          let postsArray = [];
          if (snapshot.exists()) {
            snapshot.forEach((child) => {
              postsArray.push({
                ...child.val(),
                id: child.key,
                src: like,
                className: "like",
              });
              setAllPosts(postsArray);
            });
          }
        },
        {
          onlyOnce: true,
        }
      );
    }
  }, [user, loading]);

  if (loading) {
    return <div id="content">Loading...</div>;
  }
  if (user) {
    return (
      <>
        <NewPostTextOnlyForm user={user} />
        <NewPostWithPhotoForm user={user} />
        <div id="content">
          <div style={{ display: "flex" }}>
            <div id="homePosts">
              <NewPostButtons user={user} />
              <div id="homePagePosts">
                <Posts
                  posts={allPosts}
                  classNames={MainPostClassNames}
                  following={following}
                />
              </div>
            </div>
            <div id="homeNewBlogs">
              <NewBlogsToFollow isFollowing={isFollowing} posts={allPosts} />
            </div>
          </div>
        </div>
      </>
    );
  }
  if (!user && !loading) {
    return (
      <>
        <LogInPopUp />
        <div id="content">
          <div style={{ display: "flex" }}>
            <div id="homePosts">
              <div id="homePagePosts">
                <Posts
                  posts={allPosts}
                  classNames={MainPostClassNames}
                  following={following}
                />
              </div>
            </div>
            <div id="homeNewBlogs">
              <NewBlogsToFollow isFollowing={isFollowing} posts={allPosts} />
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default HomePage;
