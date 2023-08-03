import {
  newMessageHandler,
  sendBtnHandler,
  toggleChatForm,
} from "../HelperFunctions";
import { useState } from "react";

const Messages = ({ selectedUser, userProfile, chatID }) => {
  const [disabled, setDisabled] = useState(true);

  if (!chatID) {
    return (
      <div id="messagesContainer">
        <div style={{padding: "50px"}}>Start chatting now.</div>
        <button onClick={toggleChatForm} className="accentBtn">send message</button>
        <div id="chatMessages"></div>
      </div>
    );
  } else {
    return (
      <div id="messagesContainer">
        <div className="chatHeader">
          <img
            src={userProfile}
            alt=""
            className="chatUserProfilePic cover"
          ></img>
          <div>{selectedUser}</div>
        </div>
        <div id="chatMessages"></div>
        <form id="messageForm">
          <input
            type="text"
            name="messageInput"
            id="messageInput"
            placeholder="Message..."
            onChange={(e) => {
              setDisabled(sendBtnHandler(e));
            }}
          ></input>
          <button
            type="submit"
            disabled={disabled}
            onClick={(e) => {
              newMessageHandler(e, chatID, selectedUser);
              setDisabled(true);
            }}
          >
            send
          </button>
        </form>
      </div>
    );
  }
};

export default Messages;
