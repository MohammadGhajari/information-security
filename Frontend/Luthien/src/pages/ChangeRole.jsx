import styles from "./../styles/change-role.module.css";
import { getAllUsers } from "./../services/handleRequest";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export default function ChangeRole() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await getAllUsers();
      if (res.status === "success") setUsers(res.data.data);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className={styles["container"]}>
      <div className={styles["outer-container"]}>
        <h2>Users</h2>
        {!loading &&
          users.map(
            (user, i) =>
              user.role !== "admin" && (
                <NavLink
                  className={styles["nav-btn"]}
                  to={`/change-role/${user.username}`}
                  key={i}
                >
                  <span>{user.username}</span>
                  <span>
                    {user.role === "user"
                      ? "Basic user"
                      : user.role === "group"
                      ? "Group creator"
                      : "Admin"}
                  </span>
                </NavLink>
              )
          )}
      </div>
    </div>
  );
}
