import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import { db } from "../firebase-config";
import {
  ref as dbRef,
  onValue,
  update,
  off,
  push,
  child,
} from "firebase/database";
import Messages from "../pageElements/Messages";
import {
  doesChatExist,
  getUserProfilePic,
  toggleChatForm,
  getChatDiv,
  loadMessages,
} from "../HelperFunctions";
import edit from "../images/edit.png";
import NewChatForm from "../pageElements/NewChatForm";

const Inbox = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, loading, error] = useAuthState(auth);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProfile, setUserProfile] = useState("");
  const [chatID, setChatID] = useState(null);

  // Add new chat between users to database, and set id to new chat.
  async function saveNewChat(recipient) {
    const user = getAuth().currentUser;
    const updates = {};
    const newChatKey = push(child(dbRef(db), "/chat-messages/")).key;

    updates["/chat-users/" + user.displayName + "/" + newChatKey] = {
      user: recipient,
    };
    updates["/chat-users/" + recipient + "/" + newChatKey] = {
      user: user.displayName,
    };

    update(dbRef(db), updates).then(() => {
      setChatID(newChatKey);
    });
  }

  // User is selected from form
  function changeChat(user) {
    setSelectedUser(user);
    if (doesChatExist(user)) {
      const div = getChatDiv(user);
      setChatID(div.getAttribute("data-key"));
    } else {
      saveNewChat(user);
    }
  }

  // TODO: this fnc doesn't work since when called with a state change
  function changeActiveChat(currentDiv) {
    console.log("displaying active");
    let divs = document.querySelectorAll(".chatListElement");
    divs.forEach((div) => {
      div.classList.remove("active");
    });
    currentDiv.classList.add("active");
    console.log(currentDiv);
  }

  useEffect(() => {
    if (chatID) {
      const messageRef = dbRef(db, "chat-messages/");
      off(messageRef);
      loadMessages(chatID);
    }
  }, [chatID]);

  useEffect(() => {
    if (selectedUser) {
      getUserProfilePic(selectedUser).then((snapshot) => {
        if (snapshot.exists()) {
          setUserProfile(snapshot.val());
        }
      });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (user) {
      // Get chats for current user from database.
      async function loadChats() {
        const user = getAuth().currentUser.displayName;
        const chatListRef = dbRef(db, "chat-users/" + user);
        onValue(
          chatListRef,
          (snapshot) => {
            if (snapshot.exists()) {
              snapshot.forEach((child) => {
                displayChat(child.val(), child.key);
              });
            }
          },
          {
            onlyOnce: true,
          }
        );
      }

      // Display each chat element.
      function displayChat(snapshot, id) {
        let div = document.getElementById(id) || createAndInsertChatDiv(id);

        div.setAttribute("key", id);
        div.setAttribute("class", "chatListElement");
        div.setAttribute("data-key", id);

        div.innerHTML = snapshot.user;

        return div;
      }

      // Create chat div if new chat.
      function createAndInsertChatDiv(id) {
        const container = document.querySelector("#chatList");
        const div = document.createElement("div");

        div.setAttribute("key", id);
        div.setAttribute("class", "chatListElement");
        div.setAttribute("data-key", id);
        div.setAttribute("id", id);

        div.addEventListener("click", (e) => {
          setChatID(e.target.getAttribute("data-key"));
          setSelectedUser(e.target.innerHTML);
        });

        container.appendChild(div);

        return div;
      }

      loadChats();
    }
    if (!user && !loading) {
      return navigate("/fumblr/account/login");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div id="content">Loading . . .</div>;
  } else {
    return (
      <>
        <NewChatForm changeChat={changeChat} />
        <div id="content">
          <div id="inboxContent">
            <div id="chatListContent">
              <div id="chatListHeader">
                <div>{user.displayName}</div>
                <div id="newChatBackground">
                  <img
                    src={edit}
                    id="newChatIcon"
                    alt=""
                    onClick={toggleChatForm}
                  ></img>
                </div>
              </div>
              <div style={{ margin: "10px 0 10px" }}>Messages</div>
              <div id="chatList"></div>
              {/* {chats.map((el, index) => {
                return (
                  <div
                    key={index}
                    className="chatListElement"
                    data-key={el.id}
                    onClick={(e) => {
                      removePreviousChat();
                      setIsSelected(true);
                      setSelectedUser(e.target.innerHTML);
                      changeActiveChat(e.target);
                      setChatID(e.target.getAttribute("data-key"));
                    }}
                  >
                    {el.user}
                  </div>
                );
              })} */}
            </div>
            <Messages
              selectedUser={selectedUser}
              userProfile={userProfile}
              chatID={chatID}
            />
          </div>
          <div>[footer]</div>
        </div>
      </>
    );
  }
};

export default Inbox;
