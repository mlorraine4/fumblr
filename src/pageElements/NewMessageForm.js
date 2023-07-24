import { useEffect, useLayoutEffect, useState } from "react";
import { getUserNames } from "../HelperFunctions";

const NewMessageForm = ({ addChat }) => {
  const [matchingUsers, setMatchingUsers] = useState([]);
  // Users: all users in project
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(false);

  function findMatchingUsers() {
    let user = document.querySelector("#search").value;
    let matchingUserNames = [];
    users.forEach((el) => {
      if (el.startsWith(user)) {
        console.log(el);
        matchingUserNames.push(el);
      }
    });
    return matchingUserNames;
  }

  // Get selected user to start a new chat with.
  function submitNewChatForm(e) {
    e.preventDefault();
    let user;
    const data = new FormData(document.querySelector("#form"));
    for (const entry of data) {
      user = entry[1];
      return user;
    }
  }

  useEffect(() => {
    let userNamesArray = [];
    getUserNames().then((snapshot) => {
      if (snapshot.exists()) {
        Object.values(snapshot.val()).forEach((el) => {
          userNamesArray.push(el.userName);
        });
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
    <div id="newMessageForm" className="hide">
      <div>New Message</div>
      <label htmlFor="search">To:</label>
      <input
        name="search"
        id="search"
        placeholder="Search..."
        onChange={() => {
          setMatchingUsers(findMatchingUsers());
        }}
      ></input>
      <form id="form">
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
            addChat(submitNewChatForm(e));
          }}
        >
          Chat
        </button>
      </form>
    </div>
  );
};

export default NewMessageForm;
