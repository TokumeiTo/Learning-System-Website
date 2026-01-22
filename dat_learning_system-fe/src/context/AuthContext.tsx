import React, { createContext, useState } from "react";
import { login as loginApi } from "../api/auth.api";
import { setToken, getToken, clearToken } from "../utils/token";

type AuthUser = {
  fullName: string;
  position: string;
  email: string;
};

type AuthContextType = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (companyCode: string, password: string) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const isAuthenticated = !!getToken();

  const login = async (companyCode: string, password: string) => {
    const res = await loginApi({ companyCode, password });

    setToken(res.token);
    setUser({
      fullName: res.fullName,
      position: res.position,
      email: res.email
    });
  };

  const logout = () => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
