import { createContext, useState } from "react";
import type { User } from "../types/user";
import { mockLogin } from "../api/auth.api";

interface AuthContextType {
  user: User | null;
  login: (companyCode: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (companyCode: string, password: string) => {
    const result = await mockLogin(companyCode, password);
    setUser(result.user);
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
