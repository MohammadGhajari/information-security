import { useParams } from "react-router-dom";
import styles from "./../styles/change-role-detail.module.css";
import { useEffect, useState } from "react";
import { getUserByUsername, updateUser } from "../services/handleRequest";
import { useNavigate } from "react-router-dom";
import { toastSuccess } from "../services/notify";

export default function ChangeRoleDetail() {
  const { username } = useParams();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await getUserByUsername(username);
      if (res.status === "success") {
        setUser(res.data);
        setRole(res.data.role);
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  async function handleChange(e) {
    const res = await updateUser(user.id, { role });
    if (res.status === "success") {
      toastSuccess("Role changed successfully");
      navigate("/");
    }
  }

  return (
    <div className={styles["container"]}>
      <div className={styles["inner-container"]}>
        {!loading && (
          <>
            <h1>{user.username}</h1>
            <div className={styles["selector"]}>
              <label htmlFor="select">Current Role: </label>
              <select
                onChange={(e) => setRole(e.target.value)}
                id="select"
                defaultValue={user.role}
              >
                <option value="user">Basic user</option>
                <option value="group">Group creator</option>
              </select>
            </div>
            <button onClick={handleChange}>Change role</button>
          </>
        )}
      </div>
    </div>
  );
}
