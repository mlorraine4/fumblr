import { useEffect, useState } from "react";
import { findMatchingUsers, getUserNames, submitNewChatForm, toggleChatForm } from "../HelperFunctions";

const NewChatForm = ({ changeChat }) => {
  const [matchingUsers, setMatchingUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    let userNamesArray = [];
    getUserNames().then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((child) => {
          userNamesArray.push(child.val().userName);
        })
        setUsers(userNamesArray);
      }
    });
  }, []);

  useEffect(() => {
    if (document.querySelector("#chatBtn")) {
      if (selected) {
        document.querySelector("#chatBtn").disabled = false;
      } else {
        document.querySelector("#chatBtn").disabled = true;
      }
    }
  }, [selected]);

  useEffect(() => {
    if (
      document.querySelector("#usersList") &&
      document.querySelector("#noUsers")
    ) {
      if (matchingUsers.length !== 0) {
        document.querySelector("#usersList").style.display = "block";
        document.querySelector("#noUsers").style.display = "none";
      } else {
        document.querySelector("#usersList").style.display = "none";
        document.querySelector("#noUsers").style.display = "block";
      }
    }
  }, [matchingUsers]);

  return (
    <div id="newChatForm" className="hide">
      <div>
        <div>New Message</div>
        <button onClick={toggleChatForm}>x</button>
      </div>
      <label htmlFor="search">To:</label>
      <input
        name="search"
        id="search"
        placeholder="Search..."
        onChange={(e) => {
          setMatchingUsers(findMatchingUsers(e, users));
        }}
      ></input>
      <form id="chatForm">
        <div id="usersList">
          {matchingUsers.map((user, index) => {
            return (
              <div className="matchingUserDiv" key={index}>
                <input
                  type="radio"
                  name="user"
                  id={user}
                  value={user}
                  onChange={() => {
                    setSelected(true);
                  }}
                ></input>
                <label htmlFor={user}>{user}</label>
              </div>
            );
          })}
        </div>
        <div id="noUsers">Account not found.</div>
        <button
          type="submit"
          id="chatBtn"
          onClick={(e) => {
            changeChat(submitNewChatForm(e));
            toggleChatForm();
          }}
        >
          Chat
        </button>
      </form>
    </div>
  );
};

export default NewChatForm;
