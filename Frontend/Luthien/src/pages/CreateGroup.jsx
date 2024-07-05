import styles from "./../styles/create-group.module.css";
import {
  createGroupChat,
  getUserByUsername,
  updateGroupChat,
} from "./../services/handleRequest";
import { useSelector } from "react-redux";
import { useState } from "react";
import { toastError, toastSuccess } from "../services/notify";
import { useNavigate } from "react-router-dom";

export default function CreateGroup() {
  const { username: myUesrname, id: userId } = useSelector(
    (state) => state.user
  );
  const [groupUsername, setGroupUsername] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const [created, setCreated] = useState(false);
  const [group, setGroup] = useState({});
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (groupUsername[0] !== "@")
      return toastError("group username should start with @");

    const tempGroup = await createGroupChat({
      username: groupUsername.slice(1),
      users: [userId],
      owner: userId,
    });
    if (tempGroup.status === "success") {
      setCreated(true);
      setGroup(tempGroup.data);
    }
  }

  async function handleAddUser(e) {
    e.preventDefault();

    if (userUsername[0] !== "@")
      return toastError("username should start with @");

    const user = await getUserByUsername(userUsername.slice(1));
    if (user.status === "no result")
      return toastError("there is no user with that username");
    if (user.status === "error") return toastError("error. try again");

    for (let i = 0; i < group.users.length; i++) {
      if (group.users[i].id === undefined)
        if (group.users[i] === user.data.id)
          return toastError("this user is already in the group");

      if (group.users[i].id === user.data.id)
        return toastError("this user is already in the group");
    }

    const updatedUsers = [...group.users, user.data.id];

    const updatedGroup = await updateGroupChat(group.id, {
      users: updatedUsers,
    });

    if (updatedGroup.status === "error")
      return toastError("error adding users");
    toastSuccess("User added successfully");

    setUserUsername("");

    setGroup(updatedGroup.data.data);
  }
  function handleFinish() {
    navigate("/");
  }

  return (
    <div className={styles["container"]}>
      {!created ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Group username</label>
            <input
              type="text"
              id="username"
              placeholder="@example"
              onChange={(e) => setGroupUsername(e.target.value)}
            />
          </div>
          <button type="submit">Create</button>
        </form>
      ) : (
        <form className={styles["add-uesr"]} onSubmit={handleAddUser}>
          <p>Add some users to your group.</p>
          <div className={styles["inp-container"]}>
            <label htmlFor="user-username">User username</label>

            <input
              type="text"
              id="user-username"
              placeholder="@example"
              onChange={(e) => setUserUsername(e.target.value)}
            />
          </div>
          <div className={styles["btn-container"]}>
            <button type="submit">Add</button>
            <button onClick={handleFinish} type="button">
              Finish
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
