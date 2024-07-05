import { useNavigate, useParams } from "react-router-dom";
import styles from "./../styles/manage-group-detail.module.css";
import {
  getGroupChatByUsername,
  deleteGroup,
  getUserByUsername,
  updateGroupChat,
} from "./../services/handleRequest";
import { useEffect, useState } from "react";
import { toastError, toastSuccess } from "../services/notify";

export default function ManageGroupDetail() {
  const { username } = useParams();
  const [group, setGroup] = useState({});
  const [loading, setLoading] = useState(false);
  const [userUsername, setUserUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      console.log("hellllllo");
      const res = await getGroupChatByUsername(username);
      console.log(res);
      if (res.status === "success") {
        console.log(res.data);
        setGroup(res.data);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

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

  async function handleDeleteUser(user) {
    const tempUsers = group.users.filter((u) => u.username !== user.username);

    const res = await updateGroupChat(group.id, { users: tempUsers });
    if (res.status === "success") {
      setGroup(res.data.data);
      toastSuccess("Member deleted successfully.");
    } else {
      toastError("Error in deleting member. try again later.");
    }
  }

  async function handleDeleteGroup() {
    if (window.confirm()) {
      const res = await deleteGroup(group.id);
      console.log(res);
      if (res.status === "success") {
        toastSuccess("Group deleted successfully.");
        navigate("/");
      } else {
        toastError("Error in deleting group. try again later.");
      }
    }
  }
  return (
    <div className={styles["container"]}>
      {!loading && (
        <div className={styles["inner-container"]}>
          <h1>{username}</h1>
          <div className={styles["add-delete-container"]}>
            <button onClick={handleDeleteGroup}>Delete Group</button>
            <form className={styles["add-user"]} onSubmit={handleAddUser}>
              <div className={styles["inp-container"]}>
                <label htmlFor="user-username">User username</label>

                <input
                  type="text"
                  id="user-username"
                  placeholder="@example"
                  value={userUsername}
                  onChange={(e) => setUserUsername(e.target.value)}
                />
              </div>
              <button type="submit">Add user</button>
            </form>
          </div>
          <h1>Members</h1>
          <div className={styles["member-container"]}>
            {group.users?.map((u, i) => (
              <div key={i} className={styles["member"]}>
                <span>{u.username}</span>
                <button onClick={() => handleDeleteUser(u)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
