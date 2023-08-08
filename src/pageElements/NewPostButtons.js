import { Link } from "react-router-dom";
import chat from "../images/newPostIcons/chat.png";
import text from "../images/newPostIcons/text-font.png";
import video from "../images/newPostIcons/video-camera.png";
import link from "../images/newPostIcons/link.png";
import quote from "../images/newPostIcons/quote.png";
import audio from "../images/newPostIcons/headphones.png";
import photo from "../images/newPostIcons/photo-camera.png";
import { toggleTextOnlyPostForm, toggleWithPhotoPostForm } from "../HelperFunctions";

const NewPostButtons = ({ user }) => {

  return (
    <div style={{ display: "flex" }}>
      <Link to="/fumblr/settings/blog">
        <img
          id="mainProfileImg"
          className="cover"
          alt=""
          src={user.photoURL}
        ></img>
      </Link>
      <div id="newPostButtons">
        <div className="newPostBtn" onClick={toggleTextOnlyPostForm}>
          <div className="imgBackground">
            <img src={text} className="newPostImg" alt=""></img>
          </div>
          <div>Text</div>
        </div>
        <div className="newPostBtn" onClick={toggleWithPhotoPostForm}>
          <div className="imgBackground">
            <img src={photo} className="newPostImg" alt=""></img>
          </div>
          <div>Photo</div>
        </div>
        <div className="newPostBtn">
          <div className="imgBackground">
            <img src={quote} className="newPostImg" alt=""></img>
          </div>
          <div>Quote</div>
        </div>
        <div className="newPostBtn">
          <div className="imgBackground">
            <img src={link} className="newPostImg" alt=""></img>
          </div>
          <div>Link</div>
        </div>
        <div className="newPostBtn">
          <div className="imgBackground">
            <img src={chat} className="newPostImg" alt=""></img>
          </div>
          <div>Chat</div>
        </div>
        <div className="newPostBtn">
          <div className="imgBackground">
            <img src={audio} className="newPostImg" alt=""></img>
          </div>
          <div>Audio</div>
        </div>
        <div className="newPostBtn">
          <div className="imgBackground">
            <img src={video} className="newPostImg" alt=""></img>
          </div>
          <div>Video</div>
        </div>
      </div>
    </div>
  );
};

export default NewPostButtons;
