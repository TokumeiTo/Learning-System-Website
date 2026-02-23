import api from '../hooks/useApi';
import type { ApiResponse } from '../types/api';
import type { UserListItem, UserUpdateFields, UserDeleteFields } from '../types/user';
import { POSITIONS } from '../utils/positions';

/**
 * Fetches the list of users based on the current user's scope.
 */
export const getUsersList = async (): Promise<UserListItem[]> => {
  const response = await api.get('/api/User/list');
  return response.data;
};

/**
 * Updates an existing user's details.
 * @param data Includes FullName, Position, OrgUnitId, and the mandatory Reason.
 */
export const updateUser = async (id: string, data: UserUpdateFields): Promise<ApiResponse> => {
  // Find the label for the position ID (e.g., convert 1 to "Division Head")
  const positionLabel = POSITIONS.find(p => p.value === data.position)?.label || "";

  const payload = {
    fullName: data.fullName,
    position: positionLabel, // Send the STRING label as the DTO expects
    orgUnitId: data.orgUnitId.toString() === "" ? null : Number(data.orgUnitId),
    updatedReason: data.updatedReason // This matches your DTO key exactly!
  };

  const response = await api.put(`/api/User/${id}`, payload);
  return response.data;
};

/**
 * Deletes a user from the system.
 * @param id The GUID of the user to delete.
 * @param data Contains the mandatory 'reason' for the deletion.
 */
export const deleteUser = async (id: string, data: UserDeleteFields): Promise<ApiResponse> => {
  // We pass 'data' directly. Axios takes this 'data' object 
  // and puts it into the request body.
  const response = await api.delete(`/api/User/${id}`, { data });
  return response.data; // Returns { message: "..." } from your C# Controller
};