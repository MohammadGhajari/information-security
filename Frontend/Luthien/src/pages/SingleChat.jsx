import { useState, useEffect, useRef } from "react";
import styles from "./../styles/single-chat.module.css";
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
import { createUniqueId } from "./../helper/helper";

export default function SingleChat() {
  const [username, setUsername] = useState("");
  const [sentMessage, setSentMessage] = useState("");
  const [receiver, setReciever] = useState({});
  const [uniqueId, setUniqueId] = useState("");
  const { chat } = useSelector((state) => state.chat);
  const chatContainerRef = useRef(null);

  const dispatch = useDispatch();
  const {
    username: senderUsername,
    privateKey,
    receiverUsername,
  } = useSelector((state) => state.user);

  async function handleSubmit(e) {
    e.preventDefault();

    if (username[0] !== "@") return toastError("username starts with @");

    const user = await getUserByUsername(username.slice(1));

    if (user.status === "no result")
      return toastError("there is no user with this username.");
    if (user.status === "error") return toastError("error getting user.");
    setReciever(user.data);

    dispatch(setReceiverUsername(username));
    const uID = await createUniqueId(username.slice(1), senderUsername);
    setUniqueId(uID);
    socket.emit("join_room", uID);
  }

  async function sendMessage() {
    if (sentMessage.length < 1) return;

    let encrypt1 = new JSEncrypt();
    encrypt1.setPublicKey(privateKey);
    const encryptedMessage = encrypt1.encrypt(sentMessage); //encrypted message length is always 88

    let encrypt2 = new JSEncrypt();
    encrypt2.setPublicKey(receiver.privateKey);

    const signedMessage1 = encrypt2.encrypt(encryptedMessage.slice(0, 44));
    const signedMessage2 = encrypt2.encrypt(encryptedMessage.slice(44, 88));

    socket.emit("send_message", {
      sender: senderUsername,
      reciever: username.slice(1),
      uniqueId: uniqueId,
      message: signedMessage1 + signedMessage2,
    });

    dispatch(
      setChat([
        ...chat,
        {
          sender: senderUsername,
          reciever: username,
          uniqueId: uniqueId,
          message: sentMessage,
        },
      ])
    );
    setSentMessage("");
  }

  useEffect(() => {
    async function fetchData() {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }

      if (receiverUsername.length > 0) {
        const user = await getUserByUsername(username.slice(1));

        socket.on("receive_message", async (data) => {
          const rUser = await getUserByUsername(data.reciever);

          let decrypt1 = new JSEncrypt();
          decrypt1.setPrivateKey(rUser.data.publicKey);
          const decryptedMessage1 = decrypt1.decrypt(data.message.slice(0, 88));
          const decryptedMessage2 = decrypt1.decrypt(
            data.message.slice(88, 196)
          );

          let decrypt = new JSEncrypt();
          decrypt.setPrivateKey(user.data.publicKey);
          const decryptedMessage3 = decrypt.decrypt(
            decryptedMessage1 + decryptedMessage2
          );
          console.log(decryptedMessage3);

          let temp = { ...data, message: decryptedMessage3 };

          dispatch(setChat([...chat, temp]));
        });
      }
    }

    fetchData();
  }, [chat, socket, receiverUsername]);
  // [chat, socket, receiverUsername]
  return (
    <div className={styles["container"]}>
      {receiverUsername.length === 0 && (
        <form onSubmit={handleSubmit}>
          <div>
            <p>Enter username to enter Pv</p>
            <div>
              <label htmlFor="username">User username</label>
              <input
                type="text"
                id="username"
                placeholder="@example"
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <button type="submit">Start messaging</button>
        </form>
      )}
      {receiverUsername.length > 0 && (
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
                  <p className={styles["sender"]}>{m.sender}</p>
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
