import React, { createContext, useState, useEffect } from "react";
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
  isInitialized: boolean; // Added to track if we've finished checking storage
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Check storage on initial mount
  useEffect(() => {
    const initAuth = () => {
      const token = getToken();
      const savedUser = localStorage.getItem("lms_user");

      if (token && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          // If JSON is corrupted, clear everything
          clearToken();
          localStorage.removeItem("lms_user");
        }
      }
      setIsInitialized(true);
    };

    initAuth();
  }, []);

  const isAuthenticated = !!getToken() && !!user;

  const login = async (companyCode: string, password: string) => {
    const res = await loginApi({ companyCode, password });

    const userData: AuthUser = {
      fullName: res.fullName,
      position: res.position,
      email: res.email
    };

    setToken(res.token);
    localStorage.setItem("lms_user", JSON.stringify(userData)); // Save user to storage
    setUser(userData);
  };

  const logout = () => {
    clearToken();
    localStorage.removeItem("lms_user"); // Remove user from storage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, isInitialized }}>
      {/* Prevent the rest of the app from rendering until we've checked 
        localStorage, otherwise routes might redirect to login mid-load.
      */}
      {isInitialized ? children : null} 
    </AuthContext.Provider>
  );
};