import { Link } from "react-router-dom";
import chat from "../images/newPostIcons/chat.png";
import text from "../images/newPostIcons/text-font.png";
import video from "../images/newPostIcons/video-camera.png";
import link from "../images/newPostIcons/link.png";
import quote from "../images/newPostIcons/quote.png";
import audio from "../images/newPostIcons/headphones.png";
import photo from "../images/newPostIcons/photo-camera.png";

const NewPostButtons = ({ user }) => {
  function openPostForm() {
    document.getElementById("newPostPopUp").style.display = "block";
  }

  return (
    <div style={{ display: "flex" }}>
      <Link to="/fumblr/account/settings">
        <img id="mainProfileImg" alt="" src={user.photoURL}></img>
      </Link>
      <div id="newPostButtons">
        <div>
          <div className="imgBackground">
            <img src={text} className="newPostImg" alt=""></img>
          </div>
          <div onClick={openPostForm}>Text</div>
        </div>
        <div>
          <div className="imgBackground">
            <img src={photo} className="newPostImg" alt=""></img>
          </div>
          <div onClick={openPostForm}>Photo</div>
        </div>
        <div>
          <div className="imgBackground">
            <img src={quote} className="newPostImg" alt=""></img>
          </div>
          <div onClick={openPostForm}>Quote</div>
        </div>
        <div>
          <div className="imgBackground">
            <img src={link} className="newPostImg" alt=""></img>
          </div>
          <div onClick={openPostForm}>Link</div>
        </div>
        <div>
          <div className="imgBackground">
            <img src={chat} className="newPostImg" alt=""></img>
          </div>
          <div onClick={openPostForm}>Chat</div>
        </div>
        <div>
          <div className="imgBackground">
            <img src={audio} className="newPostImg" alt=""></img>
          </div>
          <div onClick={openPostForm}>Audio</div>
        </div>
        <div>
          <div className="imgBackground">
            <img src={video} className="newPostImg" alt=""></img>
          </div>
          <div onClick={openPostForm}>Video</div>
        </div>
      </div>
    </div>
  );
};

export default NewPostButtons;
