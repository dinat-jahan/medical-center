import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import LoginPage from "./pages/authPages/LoginPage";

const Layout = () => {
  return (
    <div className="p-4">
      <Header />
      <LoginPage />
      <Outlet /> {/* Child routes will be rendered here */}
      <Footer />
    </div>
  );
};

export default Layout;
