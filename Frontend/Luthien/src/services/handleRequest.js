import axios from "axios";
import { toastError, toastSuccess } from "./notify";
import { setCookie } from "../helper/cookie";
import JSEncrypt from "jsencrypt";

const domain = "http://127.0.0.10:8000";

export async function signup(data) {
  try {
    const res = await axios.post(`${domain}/api/users/signup`, data);
    if (res.data.status === "success") {
      toastSuccess("Signup Success");
      return { status: "success", data: res.data.data.user };
    } else {
      if (res.data.message.includes("duplicate key error")) {
        toastError("User exists with this username or email.");
        return { status: "error" };
      }
    }
  } catch (err) {
    if (err.message === "Network Error") {
      toastError("Too many requests.");
      return { status: "error" };
    } else {
      toastError(err.message);
      return { status: "error" };
    }
  }
}

export async function login(data) {
  try {
    const res = await axios.post(`${domain}/api/users/login`, data);
    if (res.data.status === "success") {
      setCookie("jwt", res.data.token, 7);
      toastSuccess("login successful");

      return { status: "success", data: res.data.data };
    } else {
      toastError("Incorrect email or password.");
      return { status: "error" };
    }
  } catch (err) {
    if (err.message === "Network Error") {
      toastError("Too many requests.");
      return { status: "error" };
    } else {
      toastError(err.message);
      return { status: "error" };
    }
  }
}

export async function getUserByUsername(username) {
  try {
    const res = await axios.get(`${domain}/api/users?username=${username}`);
    if (res.data.status === "success") {
      if (res.data.results === 0)
        return { status: "no result", data: "no results" };

      return { status: "success", data: res.data.data[0] };
    } else {
      return { status: "error" };
    }
  } catch (err) {
    if (err.message === "Network Error") {
      toastError("Too many requests.");
      return { status: "error" };
    } else {
      toastError(err.message);
      return { status: "error" };
    }
  }
}

export async function updateUser(id, data) {
  try {
    const res = await axios.patch(`${domain}/api/users/${id}`, data, {
      withCredentials: true,
    });
    if (res.data.status === "success") {
      return { status: "success", data: "no results" };
    } else {
      return { status: "error" };
    }
  } catch (err) {
    if (err.message === "Network Error") {
      toastError("Too many requests.");
      return { status: "error" };
    } else {
      toastError(err.message);
      return { status: "error" };
    }
  }
}

export async function getAllUsers() {
  try {
    const res = await axios.get(`${domain}/api/users`);
    if (res.data.status === "success") {
      if (res.data.results === 0)
        return { status: "no result", data: "no results" };

      return { status: "success", data: res.data };
    } else {
      return { status: "error" };
    }
  } catch (err) {
    if (err.message === "Network Error") {
      toastError("Too many requests.");
      return { status: "error" };
    } else {
      toastError(err.message);
      return { status: "error" };
    }
  }
}

export async function getCurrentUser() {
  const res = await axios.get(`${domain}/api/users/me`, {
    withCredentials: true,
  });
  return res.data;
}

export async function getGroupChatByUsername(username) {
  try {
    const res = await axios.get(
      `${domain}/api/group-chats?username=${username}`
    );
    if (res.data.status === "success") {
      if (res.data.results === 0)
        return { status: "no result", data: "no results" };

      return { status: "success", data: res.data.data[0] };
    } else {
      return { status: "error" };
    }
  } catch (err) {
    if (err.message === "Network Error") {
      toastError("Too many requests.");
      return { status: "error" };
    } else {
      toastError(err.message);
      return { status: "error" };
    }
  }
}

export async function createGroupChat(data) {
  try {
    const res = await axios.post(`${domain}/api/group-chats`, data);
    if (res.data.status === "success") {
      toastSuccess("Group created successfully.");
      return { status: "success", data: res.data.data };
    } else {
      if (res.data.message.includes("duplicate key error")) {
        toastError("Group username should be unique.");
        return { status: "error" };
      }
    }
  } catch (err) {
    if (err.message === "Network Error") {
      toastError("Too many requests.");
      return { status: "error" };
    } else {
      toastError(err.message);
      return { status: "error" };
    }
  }
}

export async function updateGroupChat(id, data) {
  try {
    const res = await axios.patch(`${domain}/api/group-chats/${id}`, data, {
      withCredentials: true,
    });
    if (res.data.status === "success") {
      return { status: "success", data: res.data.data };
    } else {
      if (res.data.message.includes("duplicate key error")) {
        return { status: "error" };
      }
    }
  } catch (err) {
    if (err.message === "Network Error") {
      toastError("Too many requests.");
      return { status: "error" };
    } else {
      toastError(err.message);
      return { status: "error" };
    }
  }
}

export async function getAllGroups() {
  try {
    const res = await axios.get(`${domain}/api/group-chats`);
    if (res.data.status === "success") {
      if (res.data.results === 0)
        return { status: "no result", data: "no results" };

      return { status: "success", data: res.data };
    } else {
      return { status: "error" };
    }
  } catch (err) {
    if (err.message === "Network Error") {
      toastError("Too many requests.");
      return { status: "error" };
    } else {
      toastError(err.message);
      return { status: "error" };
    }
  }
}

export async function deleteGroup(id) {
  try {
    console.log(id);
    const res = await axios.delete(`${domain}/api/group-chats/${id}`, {
      withCredentials: true,
    });
    console.log(res);
    if (res.status === 204) {
      return { status: "success" };
    } else {
      toastError("Error in delete group.");
      return { status: "error" };
    }
  } catch (err) {
    if (err.message === "Network Error") {
      toastError("Too many requests.");
      return { status: "error" };
    } else {
      toastError(err.message);
      return { status: "error" };
    }
  }
}
