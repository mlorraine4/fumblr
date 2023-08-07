import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import {
  MainPostClassNames,
  getUserBlogProfile,
  toggleFollow,
} from "../HelperFunctions";
import { query, ref as dbRef, orderByChild, onValue } from "firebase/database";
import { db } from "../firebase-config";
import like from "../images/like.png";
import liked from "../images/liked.png";
import PostsWithoutProfile from "../pageElements/PostsWithoutProfile";
import { useAuthState } from "react-firebase-hooks/auth";

const Blog = ({ isFollowing }) => {
  const params = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState("");
  const [userBackground, setUserBackground] = useState(
    "var(--background-secondary)"
  );
  const [userTitle, setUserTitle] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [user, loading] = useAuthState(getAuth());
  // USER = params.user

  useEffect(() => {
    getUserBlogProfile(params.user).then((snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val().photoURL) {
          setUserProfilePic(snapshot.val().photoURL);
        }
        if (snapshot.val().title) {
          setUserTitle(snapshot.val().title);
        }
        if (snapshot.val().description) {
          setUserDescription(snapshot.val().description);
        }
        if (snapshot.val().backgroundColor) {
          setUserBackground(snapshot.val().backgroundColor);
        }
      }
    });

    const userPosts = query(
      dbRef(db, "user-posts/" + params.user),
      orderByChild("descendingOrder")
    );
    onValue(
      userPosts,
      (snapshot) => {
        if (snapshot.exists()) {
          let postsArray = [];
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
          setUserPosts(postsArray);
        } else {
          setUserPosts([]);
        }
      },
      {
        onlyOnce: true,
      }
    );
    console.log(isFollowing(params.user));
  }, []);

  if (user && isFollowing(params.user)) {
    return (
      <div id="content">
        <div
          id="userProfileContainer"
          style={{ backgroundColor: userBackground }}
        >
          <img id="blogProfilePic" className="cover" src={userProfilePic}></img>
          <div id="blogUserName">{params.user}</div>
          <div id="blogTitle">{userTitle}</div>
          <div id="blogDescription">{userDescription}</div>
          <button
            className="followBtn"
            onClick={(e) => {
              toggleFollow(e, params.user);
            }}
          >
            Following
          </button>
          <PostsWithoutProfile
            posts={userPosts}
            classNames={MainPostClassNames}
          />
        </div>
      </div>
    );
  } else {
    return (
      <div id="content">
        <div
          id="userProfileContainer"
          style={{ backgroundColor: userBackground }}
        >
          <img id="blogProfilePic" className="cover" src={userProfilePic}></img>
          <div id="blogUserName">{params.user}</div>
          <div id="blogTitle">{userTitle}</div>
          <div id="blogDescription">{userDescription}</div>
          <button
            className="followBtn"
            onClick={(e) => {
              toggleFollow(e, params.user);
            }}
          >
            Follow
          </button>
          <PostsWithoutProfile
            posts={userPosts}
            classNames={MainPostClassNames}
          />
        </div>
      </div>
    );
  }
};

export default Blog;
