import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  useEffect(() => {
    // Initialize from localStorage
    const token = localStorage.getItem("token");
    const user = {
      id: localStorage.getItem("id"),
      email: localStorage.getItem("email"),
      name: localStorage.getItem("name"),
      fonction: localStorage.getItem("fonction"),
      user_id: localStorage.getItem("user_id"),
      role: localStorage.getItem("role"),
    };
    if (token) {
      setAuth({ token, user });
    }
  }, []);

  const loginUser = (data) => {
    const user = {
      id: data.user.id_user,
      email: data.user.email,
      name: data.user.agents.nom,
      fonction: data.user.agents.fonction,
      user_id: data.user.agent_id,
      role: data.user.roles.designation_role,
    };

    localStorage.setItem("token", data.token);
    Object.entries(user).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    setAuth({ token: data.token, user });
  };

  const logoutUser = () => {
    localStorage.clear();
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider value={{ auth, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
