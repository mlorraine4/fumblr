import { Link } from "react-router-dom";
import { toggleLikedStatus, toggleLogInPopUp } from "../HelperFunctions";
import comment from "../images/chat.png";
import repost from "../images/exchange.png";
import share from "../images/send.png";
import { getAuth } from "firebase/auth";

const PostsWithoutProfile = ({ posts, classNames }) => {
  if (posts) {
    return (
      <div id="posts">
        {posts.map((post) => {
          return (
            <div style={{ display: "flex" }} key={post.id}>
              <div className={classNames.post}>
                <div className="postHeader">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Link to={`/blog/${post.author}`}>
                      <div className="postAuthor">{post.author}</div>
                    </Link>
                  </div>
                </div>
                <div style={{ backgroundColor: "black" }}>
                  <img src={post.imgUrl} className={classNames.postImg}></img>
                </div>
                <div className={classNames.postTitle}>{post.title}</div>
                <div className={classNames.postBody}>{post.body}</div>
                <div className="postIconsContainer">
                  <div style={{ position: "relative" }}>
                    <img
                      className={post.className}
                      src={post.src}
                      onClick={(e) => {
                        if (getAuth().currentUser) {
                        toggleLikedStatus(e, post);
                        } else {
                          toggleLogInPopUp();
                        }
                      }}
                    ></img>
                    <div
                      className="postIconInfo"
                      style={{ top: "-12px", right: "12px" }}
                    >
                      like
                    </div>
                    <div className="starCount">{post.starCount}</div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <img className="postIcons" src={comment} alt=""></img>
                    <div
                      className="postIconInfo"
                      style={{ top: "-12px", right: "-8px" }}
                    >
                      comment
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <img className="postIcons" src={repost} alt=""></img>
                    <div
                      className="postIconInfo"
                      style={{ top: "-12px", right: "2px" }}
                    >
                      repost
                    </div>
                  </div>
                  <div style={{ position: "relative" }}>
                    <img className="postIcons" src={share} alt=""></img>
                    <div
                      className="postIconInfo"
                      style={{ top: "-12px", right: "6px" }}
                    >
                      share
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};

export default PostsWithoutProfile;