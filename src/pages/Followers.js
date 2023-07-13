import { getAuth } from "firebase/auth";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db } from "../firebase-config";

const Followers = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [followers, setFollowers] = useState([]);

  //  Retreives who a user is following from firebase.
  function getFollowers() {
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
      const profileRef = ref(db, "profile-pictures/" + el.user);
      onValue(profileRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          followersArray.push({
            user: el.user,
            photoURL: data.photoURL,
          });
        }
      });
    });
    console.log(followersArray);
    setFollowers(followersArray);
  }

  useEffect(() => {
    if (loading) {
      document.querySelector("#followers").innerHTML = "Loading . . .";
    }
    if (!user) return navigate("/fumblr/account/login");
  }, [user, navigate, loading]);

  if (user) {
    getFollowers();
    return (
      <div id="followers">
        {followers.map((follower, index) => {
          return (
            <div key={index} style={{ display: "flex" }}>
              <img src={follower.photoURL} className="followerProfile"></img>
              <div>{follower.user}</div>
            </div>
          );
        })}
      </div>
    );
  } else return (
    <div id="followers"></div>
  )
};

export default Followers;
