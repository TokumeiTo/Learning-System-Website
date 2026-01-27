import api from '../hooks/useApi';
import type { UserListItem } from '../types/user';

export const getUsersList = async (): Promise<UserListItem[]> => {
  const response = await api.get('/api/User/list');
  return response.data;
};