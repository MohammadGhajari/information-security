import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  username: "",
  email: "",
  role: "user",
  publicKey: "",
  privateKey: "",
  isLoggedIn: false,
  currentGroupUsername: "",
  receiverUsername: "",
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setId(state, action) {
      state.id = action.payload;
    },
    setUsername(state, action) {
      state.username = action.payload;
    },
    setCurrentGroupUsername(state, action) {
      state.currentGroupUsername = action.payload;
    },
    setEmail(state, action) {
      state.email = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    resetUser(state, action) {
      state.name = "";
      state.email = "";
      state.role = "user";
    },
    setIsLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },
    setPublicKey(state, action) {
      state.publicKey = action.payload;
    },
    setPrivateKey(state, action) {
      state.privateKey = action.payload;
    },
    setReceiverUsername(state, action) {
      state.receiverUsername = action.payload;
    },
  },
});
export const {
  resetUser,
  setEmail,
  setUsername,
  setRole,
  setIsLoggedIn,
  setReceiverUsername,
  setPublicKey,
  setPrivateKey,
  setId,
  setCurrentGroupUsername,
} = userSlice.actions;

export default userSlice.reducer;
