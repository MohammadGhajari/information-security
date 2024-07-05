import { NavLink } from "react-router-dom";
import { MdOutlineMail } from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegUser } from "react-icons/fa";
import { RiLoginCircleLine } from "react-icons/ri";
import styles from "./../styles/login-form.module.css";

export default function LoginForm({
  setUsername,
  setEmailInp,
  setPassword,
  setPasswordConfirm,
  type,
  handleSubmit,
}) {
  return (
    <div className={styles.outer}>
      <form className={styles.container} onSubmit={handleSubmit}>
        <h1>{type === "login" ? "Login" : "Sign up"}</h1>

        <div>
          <label htmlFor="name">
            <FaRegUser />
            username
          </label>
          <input
            className={styles["login-input"]}
            type="text"
            id="name"
            placeholder="username"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        {type === "signup" && (
          <div>
            <label htmlFor="email">
              <span>
                <MdOutlineMail />
              </span>
              <span> Email</span>
            </label>
            <input
              className={styles["login-input"]}
              type="email"
              id="email"
              placeholder="email"
              onChange={(e) => setEmailInp(e.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="password">
            <span>
              {" "}
              <RiLockPasswordLine />
            </span>
            <span> Password</span>
          </label>
          <input
            className={styles["login-input"]}
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {type === "signup" && (
          <div>
            <label htmlFor="password-confirm">
              <span>
                {" "}
                <RiLockPasswordLine />
              </span>
              <span>Password confirm</span>
            </label>
            <input
              className={styles["login-input"]}
              type="password"
              id="password-confirm"
              placeholder="Password confirm"
              onChange={(e) => setPasswordConfirm(e.target.value)}
              required
            />
          </div>
        )}

        <button className={styles["submit-btn"]}>
          <RiLoginCircleLine />{" "}
          <span>{type === "login" ? "Login" : "Sign up"}</span>
        </button>

        {type === "login" ? (
          <p>
            do'nt have an account?{" "}
            <NavLink className={styles.link} to={"/signup"}>
              Create account
            </NavLink>
          </p>
        ) : (
          <p>
            do you have an account?{" "}
            <NavLink className={styles.link} to={"/login"}>
              login
            </NavLink>
          </p>
        )}
      </form>
    </div>
  );
}
