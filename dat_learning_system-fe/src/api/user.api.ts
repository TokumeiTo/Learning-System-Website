import api from '../hooks/useApi';
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
export const updateUser = async (id: string, data: UserUpdateFields) => {
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
export const deleteUser = async (id: string, data: UserDeleteFields) => {
  // IMPORTANT: For DELETE requests, axios requires the body to be in the 'data' property
  const response = await api.delete(`/api/User/${id}`, { data });
  return response.data;
};