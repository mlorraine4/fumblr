import {
  hideFollowButton,
  notifyUser,
  saveFollow,
  toggleLikedStatus,
  toggleLogInPopUp,
} from "../HelperFunctions";
import ellipsis from "../images/more.png";
import comment from "../images/chat.png";
import repost from "../images/exchange.png";
import share from "../images/send.png";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

const Posts = ({ posts, classNames, following }) => {
  return (
    <div id="posts">
      {posts.map((post) => {
        if (following.some((e) => e.user === post.author)) {
          return (
            <div style={{ display: "flex" }} key={post.id}>
              <img src={post.authorPic} className={classNames.profile}></img>
              <div className={classNames.post}>
                <div className="postHeader">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Link to={`/fumblr/blog/${post.author}`}>
                      <div className="postAuthor">{post.author}</div>
                    </Link>
                  </div>
                  <img alt="" src={ellipsis} style={{ height: "20px" }}></img>
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
                        toggleLikedStatus(e, post);
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
        } else {
          return (
            <div style={{ display: "flex" }} key={post.id}>
              <img src={post.authorPic} className={classNames.profile}></img>
              <div className={classNames.post}>
                <div className="postHeader">
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Link to={`/fumblr/blog/${post.author}`}>
                      <div className="postAuthor">{post.author}</div>
                    </Link>
                    <button
                      data-key={post.author}
                      className="followBtn"
                      onClick={() => {
                        if (getAuth().currentUser) {
                          saveFollow(post.author).then(() => {
                            notifyUser(
                              "follow",
                              getAuth().currentUser.displayName,
                              post.author,
                              ""
                            );
                            hideFollowButton(post.author);
                          });
                        } else {
                          toggleLogInPopUp();
                        }
                      }}
                    >
                      follow
                    </button>
                  </div>
                  <img alt="" src={ellipsis} style={{ height: "20px" }}></img>
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
        }
      })}
    </div>
  );
};

export default Posts;
