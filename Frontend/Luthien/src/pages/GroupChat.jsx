import { useState, useEffect, useRef } from "react";
import styles from "./../styles/group-chat.module.css";
import { toastError } from "../services/notify.js";
import {
  setReceiverUsername,
  setCurrentGroupUsername,
} from "../state management/userSlice.js";
import { useDispatch, useSelector } from "react-redux";
import io from "socket.io-client";
import {
  getUserByUsername,
  getGroupChatByUsername,
} from "../services/handleRequest.js";
const socket = io.connect("http://localhost:8000");
import { setChat } from "../state management/chatSlice.js";
import JSEncrypt from "jsencrypt";

export default function GroupChat() {
  const colors = {
    reza: "#4A90E2",
    daenerys: "#3b9d88",
    ali: "#B8E986",
    hasan: "#F8E71C",
    ghasem: "#D0021B",
    karim: "#8B572A",
    mojtaba: "#7ED321",
    hosein: "#BD10E0",
    kir: "#9013FE",
  };

  const [username, setUsername] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const { chat } = useSelector((state) => state.chat);
  const chatContainerRef = useRef(null);

  const dispatch = useDispatch();
  const {
    currentGroupUsername,
    username: senderUsername,
    privateKey,
  } = useSelector((state) => state.user);

  async function handleSubmit(e) {
    e.preventDefault();

    if (username[0] !== "@") return toastError("username starts with @");

    const group = await getGroupChatByUsername(username.slice(1));

    if (group.status === "no result")
      return toastError("there is no group with this username.");
    if (group.status === "error") return toastError("error getting group.");

    //check if user have this group or not
    let userExists = false;
    for (let i = 0; i < group.data.users.length; i++) {
      if (group.data.users[i].username === senderUsername) {
        userExists = true;
        break;
      }
    }
    if (!userExists) return toastError("you don't have this group.");

    dispatch(setCurrentGroupUsername(username));
    socket.emit("join_room", username);
  }

  const sendMessage = () => {
    if (sentMessage.length < 1) return;

    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(privateKey);

    const encryptedMessage = encrypt.encrypt(sentMessage);

    socket.emit("send_message", {
      sender: senderUsername,
      reciever: username,
      uniqueId: username,
      message: encryptedMessage,
    });

    dispatch(
      setChat([
        ...chat,
        {
          sender: senderUsername,
          reciever: username,
          uniqueId: username,
          message: sentMessage,
        },
      ])
    );
    setSentMessage("");
  };

  useEffect(() => {
    async function fetchData() {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }

      if (currentGroupUsername.length > 0) {
        const group = await getGroupChatByUsername(username.slice(1));
        socket.on("receive_message", (data) => {
          let decrypt = new JSEncrypt();
          let publicKey;

          for (let i = 0; i < group.data.users.length; i++) {
            if (group.data.users[i].username === data.sender) {
              publicKey = group.data.users[i].publicKey;
              break;
            }
          }

          decrypt.setPrivateKey(publicKey);

          const decryptedMessage = decrypt.decrypt(data.message);

          let temp = { ...data, message: decryptedMessage };

          dispatch(setChat([...chat, temp]));
        });
      }
    }

    fetchData();
  }, [chat, socket, currentGroupUsername]);

  return (
    <div className={styles["container"]}>
      {currentGroupUsername.length === 0 && (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Group username</label>
            <input
              type="text"
              id="username"
              placeholder="@example"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <button type="submit">Connect</button>
        </form>
      )}
      {currentGroupUsername.length > 0 && (
        <div className={styles["outer-chat-container"]}>
          <div className={styles["chat-container"]} ref={chatContainerRef}>
            {chat.map((m, i) => (
              <div
                className={`${styles["message"]} ${
                  m.sender === senderUsername ? styles["my-message"] : ""
                }`}
                key={i}
              >
                {m.sender !== senderUsername && (
                  <p
                    className={styles["sender"]}
                    style={{ color: colors[m.sender] }}
                  >
                    {m.sender}
                  </p>
                )}
                <p>{m.message}</p>
              </div>
            ))}
          </div>
          <div className={styles["send-container"]}>
            <input
              value={sentMessage}
              onChange={(e) => setSentMessage(e.target.value)}
              type="text"
              placeholder="message..."
            />
            <button onClick={sendMessage}>send message</button>
          </div>
        </div>
      )}
    </div>
  );
}
