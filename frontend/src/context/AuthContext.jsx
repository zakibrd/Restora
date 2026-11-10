import { createContext, useState, useContext, useEffect } from "react";
import instance from "../assets/axios";

const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check session status with Django on mount/refresh
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await instance.get("/api/me/");
        setUser(response.data || null);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  //login function
  const login = async (username, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await instance.post("/api/login/", {
        username,
        password,
      });
      setUser(response.data);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || "login failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };
  // logout
  const logout = async () => {
    try {
      await instance.post("/api/logout/");
    } catch (err) {
      console.error("logout error", err);
    } finally {
      setUser(null);
    }
  };

  const value = { user, login, logout, loading, error };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
