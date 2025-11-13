import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  adminLogin,
  adminGetProfile,
  ADMIN_TOKEN_KEY,
  clearAdminToken,
} from "../services/adminAuthService";

export const AdminAuthContext = createContext({
  admin: null,
  token: null,
  loading: true,
  login: async () => {},
  logout: () => {},
});

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchAdmin = async () => {
      if (!token) {
        if (active) {
          setAdmin(null);
          setLoading(false);
        }
        return;
      }

      if (active) setLoading(true);

      try {
        const { user } = await adminGetProfile();
        if (user?.role !== "admin") throw new Error("Not admin");
        if (active) setAdmin(user);
      } catch {
        clearAdminToken();
        if (active) {
          setToken(null);
          setAdmin(null);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchAdmin();

    return () => {
      active = false;
    };
  }, [token]);

  const handleAdminAuthSuccess = useCallback((data) => {
    if (data?.user?.role !== "admin") {
      throw new Error("Not admin");
    }
    localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
    setToken(data.token);
    setAdmin(data.user);
    return data;
  }, []);

  const login = useCallback(
    async (payload) => {
      const data = await adminLogin(payload);
      return handleAdminAuthSuccess(data);
    },
    [handleAdminAuthSuccess]
  );

  const logout = useCallback(() => {
    clearAdminToken();
    setToken(null);
    setAdmin(null);
  }, []);

  const value = useMemo(
    () => ({
      admin,
      token,
      loading,
      login,
      logout,
    }),
    [admin, token, loading, login, logout]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}