import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  login as apiLogin,
  register as apiRegister,
  getProfile,
} from "../services/authService";

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchUser = async () => {
      if (!token) {
        if (active) {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (active) setLoading(true);

      try {
        const { user } = await getProfile();
        if (active) setUser(user);
      } catch (error) {
        console.error("❌ Lỗi xác thực:", error.message);
        localStorage.removeItem("token");
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchUser();

    return () => {
      active = false;
    };
  }, [token]);

  const handleAuthSuccess = useCallback((data) => {
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  }, []);

  const login = useCallback(
    async (payload) => {
      const data = await apiLogin(payload);
      return handleAuthSuccess(data);
    },
    [handleAuthSuccess]
  );

  const register = useCallback(
    async (payload) => {
      const data = await apiRegister(payload);
      return handleAuthSuccess(data);
    },
    [handleAuthSuccess]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
