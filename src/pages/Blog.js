import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Posts from "../pageElements/Posts";
import { getAuth } from "firebase/auth";
import {
  MainPostClassNames,
  getUserProfileFromDB,
} from "../HelperFunctions";
import { query, ref as dbRef, orderByChild, onValue } from "firebase/database";
import { db } from "../firebase-config";
import like from "../images/like.png";
import liked from "../images/liked.png";

const Blog = ({ isFollowing }) => {
  const params = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [userProfilePic, setUserProfilePic] = useState("");
  const [userBackground, setUserBackground] = useState("");
  const [userTitle, setUserTitle] = useState("");
  const [userDescription, setUserDescription] = useState("");
  // USER = params.user
  // TODO: get profile picture, blog title/description, user created posts!


  useEffect(() => {
    const user = getAuth().currentUser;

    getUserProfileFromDB(params.user).then((snapshot) => {
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
          document.querySelector("#userProfileContainer").style.backgroundColor = snapshot.val().backgroundColor;
        }
      }
    });

    if (user) {
      const userPosts = query(
        dbRef(db, "user-posts/" + params.user),
        orderByChild("descendingOrder")
      );
      onValue(userPosts, (snapshot) => {
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
      });
    }
  }, []);

  return (
    <div id="content">
      <div id="userProfileContainer">
        <div>{params.user}</div>
        <img
          id="blogProfilePic"
          className="cover"
          src={userProfilePic}
        ></img>
        <div>{userTitle}</div>
        <div>{userDescription}</div>
        <Posts
          posts={userPosts}
          classNames={MainPostClassNames}
          isFollowing={isFollowing}
        />
      </div>
    </div>
  );
};

export default Blog;
