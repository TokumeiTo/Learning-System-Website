import axios from "axios";
import type { LoginRequest, LoginResponse } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const res = await axios.post(`${API_URL}/api/Auth/login`, payload);
  return res.data;
};
