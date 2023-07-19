import { saveFollow, addLike, removeLike } from "../HelperFunctions";
import like from "../images/like.png";
import liked from "../images/liked.png";
import ellipsis from "../images/more.png";
import repost from "../images/exchange.png";
import share from "../images/send.png";
import comment from "../images/chat.png";

const Posts = ({ posts, classNames, isFollowing}) => {

  // Save user like or unlike of a post.
  function toggleLikedStatus(e, post) {
    console.log(e.target.nextSibling.nextSibling);
    if (e.target.classList[0] === "like") {
      e.target.nextSibling.nextSibling.innerHTML =
        Number(e.target.nextSibling.nextSibling.innerHTML) + 1;
      e.target.src = liked;
      e.target.setAttribute("class", "liked");
      addLike(post);
    } else {
      e.target.nextSibling.nextSibling.innerHTML =
        Number(e.target.nextSibling.nextSibling.innerHTMLP) - 1;
      e.target.src = like;
      e.target.setAttribute("class", "like");
      removeLike(post);
    }
  }

  return (
    <div id="posts">
      {posts.map((post) => {
        return (
          <div style={{ display: "flex" }} key={post.id}>
            <img src={post.authorPic} className={classNames.profile}></img>
            <div className={classNames.post}>
              <div className="postHeader">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <div className="postAuthor">{post.author}</div>
                  <button
                    className={isFollowing(post.author)}
                    onClick={() => {
                      saveFollow(post.author);
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
      })}
    </div>
  );
};

export default Posts;
