import styles from "./../styles/home.module.css";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Home() {
  const { isLoggedIn, username, role } = useSelector((state) => state.user);

  return (
    <div className={styles["container"]}>
      {isLoggedIn ? (
        <>
          <p>Welcome {username}. How do you wish to use this chat service?</p>
          <div className={styles["nav-container"]}>
            <NavLink to="/single-chat" className={styles["nav-btn"]}>
              Single chat
            </NavLink>
            <NavLink to="/group-chat" className={styles["nav-btn"]}>
              Group chat
            </NavLink>
            {(role === "group" || role === "admin") && (
              <NavLink to="/create-group" className={styles["nav-btn"]}>
                Create group
              </NavLink>
            )}
            {(role === "group" || role === "admin") && (
              <NavLink to="/manage-group" className={styles["nav-btn"]}>
                Manage Group
              </NavLink>
            )}
            {role === "admin" && (
              <NavLink to="/change-role" className={styles["nav-btn"]}>
                Change user roles
              </NavLink>
            )}
          </div>
        </>
      ) : (
        <div>
          <p>You are not logged in.Please login first. </p>
          <NavLink to="/login" className={styles["nav-btn"]}>
            Login
          </NavLink>
        </div>
      )}
    </div>
  );
}
