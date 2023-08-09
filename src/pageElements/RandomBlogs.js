import { Link } from "react-router-dom";
import { saveFollow } from "../HelperFunctions";

const RandomBlogs = ({ blogs, isFollowing }) => {
  return (
    <div id="randomBlogsContent">
      {blogs.map((blog) => {
        return (
          <Link to={`/blog/${blog.user}`} key={blog.user}>
            <div
              style={{ display: "flex", justifyContent: "space-between" }}
              className="blogContainer"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={blog.photoURL} className="randomBlogPic cover"></img>
                <div>
                  <div className="blogUserName">{blog.user}</div>
                  <div className="blogTitle">{blog.title}</div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <button
                  className={isFollowing(blog.user)}
                  onClick={() => {
                    saveFollow(blog.user);
                  }}
                >
                  Follow
                </button>
                <div className="close">x</div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default RandomBlogs;
