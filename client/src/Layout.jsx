import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import LoginPage from "./pages/authPages/LoginPage";
import { useContext } from "react";
import { UserContext } from "./UserContext";
import RoleMenu from "./components/RoleMenu";

const Layout = () => {
  const { user, ready } = useContext(UserContext);
  if (!ready) return <p>Loading...</p>;
  return (
    <div className="p-4">
      <Header />
      <LoginPage />

      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;