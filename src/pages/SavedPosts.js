import { useEffect } from "react";
import Posts from "../pageElements/Posts";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { MainPostClassNames, getPost } from "../HelperFunctions";
import Footer from "../pageElements/Footer";

const SavedPosts = ({ isFollowing, following, posts }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!user && !loading) return navigate("/fumblr/account/login");
  }, [user, loading]);

  if (loading) {
    return <div id="content">Loading . . .</div>;
  } else {
    return (
      <>
        <div id="content">
          <div id="savedPostPage">
            <div style={{width: "200px", fontWeight: "bold", margin: "auto"}}>Your Saved Posts</div>
            <Posts
              posts={posts}
              classNames={MainPostClassNames}
              isFollowing={isFollowing}
              following={following}
            />
          </div>
        </div>
        <Footer />
      </>
    );
  }
};

export default SavedPosts;
