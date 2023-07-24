import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import NewMessageForm from "../pageElements/NewMessageForm";
import Messages from "../pageElements/Messages";
import { getListOfChats } from "../HelperFunctions";

const Inbox = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  // Chats: list of users, messages: messages with a specific user
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);

  function openMessageForm() {
    document.querySelector("#newMessageForm").classList.toggle("hide");
  }

  // TODO: Direct to user chat, i.e highlight user's name and set messages to that specific chat
  //  or add new chat if user is not in chats
  // hide form
  function addChat(user) {
    const data = {
      id: "",
      user: user
    }
    const newChatArray = [...chats, data];
    setChats(newChatArray);
  }

  function navigateToChat(user) {
    // get chat id tied to user from chat-users/{currentUser}/{mainChatID}/{user} <= this should already be set in chats!
    // if user not found, addChat
    // with user and chat id, setmessages from chat-messages/id
  }

  function iterateChatList(chatListObj) {
    const chatIDs = Object.keys(chatListObj);
    const users = Object.values(chatListObj);
    const chatsArray = [];
    chatIDs.forEach((el, index) => {
      chatsArray.push({
        id: el,
        user: users[index].user
      })
    })
    return chatsArray;
  }

  useEffect(() => {
    if (loading) {
      document.querySelector("#content").innerHTML = "Loading . . .";
      return;
    }
    if (user) {
      // TODO: get chat list for user from chat-users/{currentUser}
      getListOfChats().then((snapshot) => {
        if (snapshot.exists()) {
          setChats(iterateChatList(snapshot.val()));
        }
      })
    }
    if (!user) return navigate("/fumblr/account/login");
  }, [user, loading]);
    
  if (chats.length === 0) {
  return (
    <div id="content">
      <NewMessageForm addChat={addChat} />
      <div id="inboxContent">
        <div>You have no messages.</div>
        <div>View all your messages here.</div>
        <button onClick={openMessageForm}>write a new message</button>
      </div>
      <div>[footer]</div>
    </div>
  );
  } else {
    return (
      <div id="content">
        <NewMessageForm addChat={addChat} />
        <div>
          <button onClick={openMessageForm}>write a new message</button>
          <div id="inboxContent">
            {/* This will be a directory for each chat a user has with other users. */}
            <div id="chatList">
              {chats.map((el, index) => {
                return <div key={index} className="chatListElement">{el.user}</div>;
              })}
            </div>
            <Messages messages={messages} />
          </div>
        </div>
        <div>[footer]</div>
      </div>
    );
  }
};

export default Inbox;