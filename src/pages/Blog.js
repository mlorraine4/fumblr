import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { MainPostClassNames, getUserBlogProfile, hidePopUps, toggleFollow } from "../HelperFunctions";
import { query, ref as dbRef, orderByChild, onValue } from "firebase/database";
import { db } from "../firebase-config";
import like from "../images/like.png";
import liked from "../images/liked.png";
import PostsWithoutProfile from "../pageElements/PostsWithoutProfile";

const Blog = ({ isFollowing }) => {
  // TODO: rewrite to display two options, one for user following blog and other for not
  const params = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState("");
  const [userBackground, setUserBackground] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userDescription, setUserDescription] = useState("");
  // USER = params.user

  useEffect(() => {
    hidePopUps();
    const user = getAuth().currentUser;

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
          document.querySelector(
            "#userProfileContainer"
          ).style.backgroundColor = snapshot.val().backgroundColor;
        }
      }
    });

    const userPosts = query(
      dbRef(db, "user-posts/" + params.user),
      orderByChild("descendingOrder")
    );
    onValue(userPosts, (snapshot) => {
      if (snapshot.exists()) {
        let postsArray = [];
        snapshot.forEach((child) => {
          console.log(child.val().favorites);
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
    });
    if (user) {
      // TODO: find out if following or not, then change follow btn

    }
  }, []);

  return (
    <div id="content">
      <div id="userProfileContainer">
        <img id="blogProfilePic" className="cover" src={userProfilePic}></img>
        <div id="blogUserName">{params.user}</div>
        <div id="blogTitle">{userTitle}</div>
        <div id="blogDescription">{userDescription}</div>
        <button
          id="followBtn"
          className={isFollowing("follow", params.user)}
          onClick={(e) => {
            toggleFollow(e, params.user);
          }}
        >
          Follow
        </button>
        <button
          id="followBtn"
          className={isFollowing("following", params.user)}
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
};

export default Blog;
