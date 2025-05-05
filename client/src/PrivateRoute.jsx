import { useContext } from "react";
import { UserContext } from "./UserContext";
import { Route, Navigate } from "react-router-dom";

const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const { user, ready } = useContext(UserContext);

  if (!ready) {
    return <div>Loading...</div>;
  }

  //   if (!user || !roles.includes(user.role)) {
  //     return <Navigate to="/access-denied" />;
  //   }
  if (user || roles.includes(user.role)) {
    return <Component {...rest} />;
  }
};

export default PrivateRoute;
