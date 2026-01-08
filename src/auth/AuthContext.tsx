import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser, LoginResponse } from "../types";

type AuthContextType = {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (payload: LoginResponse) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "token";
const USER_KEY = "user";
const EXPIRES_KEY = "expiresAt";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);
    const savedExpires = localStorage.getItem(EXPIRES_KEY);

    if (savedToken) setToken(savedToken);
    if (savedUser) setUser(JSON.parse(savedUser));

    // Auto-logout si expiró
    if (savedExpires) {
      const exp = new Date(savedExpires).getTime();
      if (Date.now() >= exp) {
        localStorage.clear();
        setToken(null);
        setUser(null);
      }
    }
  }, []);

  const login = (payload: LoginResponse) => {
    const authUser: AuthUser = {
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
    };

    localStorage.setItem(TOKEN_KEY, payload.token);
    localStorage.setItem(USER_KEY, JSON.stringify(authUser));
    localStorage.setItem(EXPIRES_KEY, payload.expiresAt);

    setToken(payload.token);
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: !!token,
      login,
      logout,
    }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
