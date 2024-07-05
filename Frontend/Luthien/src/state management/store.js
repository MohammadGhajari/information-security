import userReducer from "./userSlice.js";
import charReducer from "./chatSlice.js";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    user: userReducer,
    chat: charReducer,
  },
});

export default store;
