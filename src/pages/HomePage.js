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
import { Link } from "react-router-dom";

const HomePage = ({ isFollowing, following }) => {
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [allPosts, setAllPosts] = useState([]);

  // TODO: add sign up pop up for users trying to like/follow when they aren't logged in!
  // TODO: REMOVE THIS WHEN DONE ADDING POSTS BY OTHER USERS!
  function writeNewPost() {
    const postKey = push(child(dbRef(db), "posts")).key;
    const uid = user.uid;
    // const user = "fakeUser";
    const author = user.displayName;

    // A post entry.
    const postData = {
      author: author,
      uid: uid,
      body: "Kermit the Fog",
      title: "What do you get if you cross a frog with some mist?",
      starCount: 0,
      authorPic:
        "https://firebasestorage.googleapis.com/v0/b/fake-social-app-e763d.appspot.com/o/profileImgs%2FN8i95WIgBYckPhENmbKwVKnjhJt1%2FuserProfileImg?alt=media&token=2e790913-2c7d-4024-aec6-14f9ac1c3069",
      imgUrl:
        "https://firebasestorage.googleapis.com/v0/b/fake-social-app-e763d.appspot.com/o/posts%2FN8i95WIgBYckPhENmbKwVKnjhJt1%2F-NYZQLGlmr6CoJO9mXCB%2Flj7hul7t39CUYMP8vJqHAYGVzUghBX-1200-80.jpg?alt=media&token=0dd6ecd2-2392-4bda-8f41-1daeaa5e023e",
    };

    // Write the new post's data simultaneously in two database locations.
    const updates = {};
    // Masterlist of all posts.
    updates["/posts/" + postKey] = postData;
    // Posts sorted by each user.
    updates["/user-posts/" + author + "/" + postKey] = postData;

    // Saves multiple values to database.
    update(dbRef(db), updates)
      .then(() => {
        // Data saved successfully!
        console.log("post saved");
      })
      .catch((error) => {
        // The write failed...
        console.log(error);
      });
  }

  // After signing up, creates a following/followers subdirectory for user, and adds user info to each.
  function createUserInfo() {
    const uid = "fakeUser2";
    const user = "fisharefriends";

    // A post entry.
    const data = {
      uid: uid,
      user: user,
    };

    const updates = {};
    updates["/user-info/" + user + "/followers/" + user] = data;
    updates["/user-info/" + user + "/following/" + user] = data;

    // Writes data simutaneoulsy in database.
    update(dbRef(db), updates)
      .then(() => {
        // Data saved successfully!
        console.log("info saved!");
      })
      .catch((error) => {
        // The write failed...
        console.log(error);
      });
  }

  useEffect(() => {
  }, [following]);

  useEffect(() => {

    if (user) {
      // Get all posts in database.
      const postsRef = query(
        dbRef(db, "posts/"),
        orderByChild("descendingOrder")
      );
      onValue(postsRef, (snapshot) => {
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
        } else {
          setAllPosts([]);
        }
      }, {
        onlyOnce: true,
      });
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
          {/* <button onClick={writeNewPost}>add post</button> */}
          <div>Footer</div>
          <Link to={`/fumblr/blog/${user.displayName}`}>
            <button>go to blog</button>
          </Link>
        </div>
      </>
    );
  }
  if (!user && !loading) {
    // TODO: what do you want to see? posts without follow/like buttons?
    return (
      <>
        <div id="content">User is logged out.</div>
      </>
    );
  }
};

export default HomePage;
