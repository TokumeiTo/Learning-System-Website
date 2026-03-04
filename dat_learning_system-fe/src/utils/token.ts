import { jwtDecode } from "jwt-decode";
const TOKEN_KEY = "access_token";

export const setToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const isTokenExpired = (): boolean => {
  const token = getToken();
  if (!token) return true;
  try {
    const { exp } = jwtDecode<{ exp: number }>(token);
    // exp is in seconds, Date.now() is in milliseconds
    return Date.now() >= exp * 1000;
  } catch {
    return true;
  }
};