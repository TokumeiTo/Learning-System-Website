import api from "../hooks/useApi";
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from "../types/auth";

/**
 * Public endpoint: Log in to get a JWT token.
 * Note: Interceptor will try to add a token, but since this is usually the 
 * first call, it won't find one, which is fine for public endpoints!
 */
export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
  const res = await api.post('/api/Auth/login', payload);
  return res.data;
};

/**
 * Protected endpoint: Register a new user.
 * The interceptor automatically attaches the Bearer token from getToken()
 * so we don't have to pass headers manually here.
 */
export const register = async (payload: RegisterRequest): Promise<RegisterResponse> => {
  const res = await api.post('/api/Auth/register', payload);
  return res.data;
};