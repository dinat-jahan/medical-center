import { roleMenus } from "../constants/index";
import { UserContext } from "../UserContext";
import { useContext, Link } from "react";
const RoleMenu = () => {
  const { user } = useContext(UserContext);

  if (!user || !user.role) return null;

  const menuItems = roleMenus[user.role];
  if (!menuItems) return null;
  return (
    <div>
      <nav className="flex flex-col gap-2 p-4 bg-gray-100 rounded-lg">
        {menuItems.map((item) => {
          <Link
            key={item.path}
            to={item.path}
            className="text-blue-600 hover:underline"
          >
            {item.name}
          </Link>;
        })}
      </nav>
    </div>
  );
};

export default RoleMenu;
