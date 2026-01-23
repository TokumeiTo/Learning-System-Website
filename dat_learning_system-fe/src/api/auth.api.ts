// api/auth.api.ts
import axios from "axios";
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from "../types/auth";
import { getToken } from "../utils/token";

const API_URL = import.meta.env.VITE_API_URL;

// Existing login
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const res = await axios.post(`${API_URL}/api/Auth/login`, payload);
  return res.data;
};

// New register
export const register = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  const token = getToken(); // optional: if you want only admin to register
  const res = await axios.post(`${API_URL}/api/Auth/register`, payload, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  });
  return res.data;
};
