import { Outlet } from "react-router-dom";
import Header from "./../components/Header";
import Footer from "./../components/Footer";
import MainContainer from "./../components/MainContainer";

export default function AppLayout() {
  return (
    <div>
      <Header />
      <MainContainer>
        <Outlet />
      </MainContainer>
      <Footer />
    </div>
  );
}
