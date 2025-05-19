import { createContext, useEffect } from "react";
import { useState } from "react";
export const UserContext = createContext({});
import axios from "axios";

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!user) {
      axios
        .get("/api/whoami")
        .then(({ data }) => {
          setUser(data);
          setReady(true);
        })
        .catch(() => setReady(true)); // Even on error, mark ready
    }
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {console.log("user in context", user)}
      {children}
    </UserContext.Provider>
  );
}
