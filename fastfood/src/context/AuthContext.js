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
  USER_TOKEN_KEY,
} from "../services/authService";

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  setUserFromProfile: () => {},
});

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(USER_TOKEN_KEY));
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
        // CHẶN: nếu token_user nhưng role là admin -> không hợp lệ cho site user
        if (user?.role === "admin") {
          localStorage.removeItem(USER_TOKEN_KEY);
          if (active) {
            setToken(null);
            setUser(null);
          }
        } else if (user?.isRestricted) {
          // User bị hạn chế: logout ngay
          localStorage.removeItem(USER_TOKEN_KEY);
          if (active) {
            setToken(null);
            setUser(null);
          }
        } else if (active) {
          setUser(user);
        }
      } catch {
        localStorage.removeItem(USER_TOKEN_KEY);
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
    // CHẶN: không cho tài khoản admin đăng nhập vào site user
    if (data?.user?.role === "admin") {
      throw new Error("Tài khoản admin không sử dụng cho trang người dùng.");
    }
    localStorage.setItem(USER_TOKEN_KEY, data.token);
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
    localStorage.removeItem(USER_TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const setUserFromProfile = useCallback((profile) => {
    if (!profile) return;
    setUser(profile);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      login,
      register,
      logout,
      setUserFromProfile,
    }),
    [user, token, loading, login, register, logout, setUserFromProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}