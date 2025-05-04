import { roleMenus } from "../constants/index";
import { UserContext } from "../UserContext";
import { useContext, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
const RoleMenu = () => {
  const { user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(0);
  if (!user || !user.role) return null;

  const menuItems = roleMenus[user.role];
  if (!menuItems) return null;
  return (
    <div className="lg:block hidden">
      <nav className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg">
        <div className="tabs tabs-lift" role="tablist">
          {menuItems.map((item, index) => {
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`tab ${activeTab === index ? "tab-active" : ""}`}
                role="tab"
                onClick={() => setActiveTab(index)}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default RoleMenu;
