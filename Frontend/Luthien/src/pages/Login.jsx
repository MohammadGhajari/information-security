import LoginForm from "../components/LoginForm";
import { login } from "./../services/handleRequest.js";
import { useState } from "react";
import {
  setEmail,
  setUsername,
  setRole,
  setIsLoggedIn,
  setPublicKey,
  setPrivateKey,
  setId,
} from "../state management/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

export default function Login() {
  const [username, setUsernameInp] = useState("");
  const [password, setPasswordInp] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await login({ username, password });
    if (res.status === "success") {
      dispatch(setEmail(res.data.user.email));
      dispatch(setUsername(res.data.user.username));
      dispatch(setRole(res.data.user.role));
      dispatch(setIsLoggedIn(true));
      dispatch(setPublicKey(res.data.user.publicKey));
      dispatch(setPrivateKey(res.data.user.privateKey));
      dispatch(setId(res.data.user.id));

      setUsernameInp("");
      setPasswordInp("");

      navigate("/");
    }
  }
  return (
    <LoginForm
      type={"login"}
      setUsername={setUsernameInp}
      setPassword={setPasswordInp}
      handleSubmit={handleSubmit}
    />
  );
}
