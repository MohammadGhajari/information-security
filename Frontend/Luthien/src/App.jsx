import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import GroupChat from "./pages/GroupChat";
import SingleChat from "./pages/SingleChat";
import CreateGroup from "./pages/CreateGroup";
import ChangeRole from "./pages/ChangeRole";
import ManageGroup from "./pages/ManageGroup";
import ManageGroupDetail from "./pages/ManageGroupDetail";
import ChangeRoleDetail from "./pages/ChangeRoleDetail";
import Signup from "./pages/Signup";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "react-tippy/dist/tippy.css";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  setEmail,
  setUsername,
  setRole,
  setIsLoggedIn,
} from "./state management/userSlice";
import { useEffect } from "react";
import { getCurrentUser } from "./services/handleRequest";

function App() {
  const { isLoggedIn, role } = useSelector((state) => state.user);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          {isLoggedIn && <Route path="single-chat" element={<SingleChat />} />}
          {isLoggedIn && <Route path="group-chat" element={<GroupChat />} />}
          {isLoggedIn && role === "admin" && (
            <>
              <Route path="change-role" element={<ChangeRole />} />
              <Route
                path="/change-role/:username"
                element={<ChangeRoleDetail />}
              />
            </>
          )}
          {isLoggedIn && (role === "admin" || role === "group") && (
            <Route path="create-group" element={<CreateGroup />} />
          )}
          {isLoggedIn && (role === "admin" || role === "group") && (
            <>
              <Route path="manage-group" element={<ManageGroup />} />
              <Route
                path="manage-group/:username"
                element={<ManageGroupDetail />}
              />
            </>
          )}
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        limit={10}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme={"light"}
        transition:Slide
      />
    </>
  );
}

export default App;
