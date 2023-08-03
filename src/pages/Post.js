import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainPostClassNames, getPost } from "../HelperFunctions";
import Posts from "../pageElements/Posts";
import like from "../images/like.png";
import liked from "../images/liked.png";

// TODO: get post based on id
const Post = ({ isFollowing, user }) => {
  const params = useParams();
  const [post, setPost] = useState([]);

  useEffect(() => {
    if (user) {
      getPost(params.id).then((snapshot) => {
        let postArray = [];
        if (
          snapshot.val().favorites !== undefined &&
          Object.keys(snapshot.val().favorites).includes(user.uid)
        ) {
          postArray.push({
            ...snapshot.val(),
            id: snapshot.key,
            src: liked,
            className: "liked",
          });
        } else {
          postArray.push({
            ...snapshot.val(),
            id: snapshot.key,
            src: like,
            className: "like",
          });
        }
        setPost(postArray);
      });
    }
  }, []);

  return (
    <div id="content">
      <div id="postPage">
        <Posts
          posts={post}
          classNames={MainPostClassNames}
          isFollowing={isFollowing}
        />
      </div>
    </div>
  );
};

export default Post;
