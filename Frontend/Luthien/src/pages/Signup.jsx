import { useState } from "react";
import LoginForm from "../components/LoginForm";
import validator from "validator";
import { toastError, toastSuccess } from "./../services/notify.js";
import { signup } from "./../services/handleRequest.js";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validator.isEmail(email)) return toastError("email is not valid");
    if (password !== passwordConfirm)
      return toastError("password and password confirm are not the same.");
    if (password.length < 8)
      return toastError("password should be at least 8 characters");
    const res = await signup({ username, email, password, passwordConfirm });
  }
  return (
    <LoginForm
      type={"signup"}
      setUsername={setUsername}
      setEmailInp={setEmail}
      setPassword={setPassword}
      setPasswordConfirm={setPasswordConfirm}
      handleSubmit={handleSubmit}
    />
  );
}
