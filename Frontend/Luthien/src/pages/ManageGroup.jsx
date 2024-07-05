import styles from "./../styles/manage-group.module.css";
import { useSelector } from "react-redux";
import { getAllGroups } from "./../services/handleRequest";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function ManageGroup() {
  const { role, username, id } = useSelector((state) => state.user);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const res = await getAllGroups();

      let tempGroups = [];
      if (res.status === "success") {
        if (role === "admin") {
          tempGroups = [...res.data.data];
        } else {
          for (let i = 0; i < res.data.data.length; i++) {
            if (res.data.data[i].owner === id)
              tempGroups.push(res.data.data[i]);
          }
        }
        setGroups(tempGroups);
      }
    }
    fetchData();
  }, [role, id]);

  return (
    <div className={styles["container"]}>
      {groups.length === 0 ? (
        <h2>You have no groups.</h2>
      ) : (
        <div className={styles["inner-container"]}>
          <h1>{role === "admin" ? "All groups" : "Groups you own"}</h1>
          {groups.map((group, i) => (
            <NavLink
              className={styles["nav-btn"]}
              to={`/manage-group/${group.username}`}
              key={i}
            >
              <span>{group.username}</span>
            </NavLink>
          ))}
          {}
        </div>
      )}
    </div>
  );
}
