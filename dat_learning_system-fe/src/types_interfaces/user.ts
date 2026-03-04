import type { RoleType } from "../utils/constants";

export interface User {
  id: number;
  companyCode: string;
  name: string;
  email: string;
  role: RoleType;

  division?: string;
  department?: string;
  section?: string;
  team?: string;
}

export interface UserListItem {
  id: string;
  fullName: string;
  email: string;
  companyCode: string;
  positionName: string; // For the Table display (e.g., "DivHead")
  position: number;     // For the Edit Form (e.g., 1)
  orgUnitName: string;  // For the Table display (e.g., "Finance")
  orgUnitId: number;    // For the Edit Form (e.g., 102)
}

export interface UserUpdateFields {
  fullName: string;
  position: number;     // Changed to number for ID selection
  orgUnitId: number;    // Changed to number for ID selection
  updatedReason: string; // Matches Backend DTO
}

export interface UserDeleteFields {
  deletedReason: string; // Matches Backend DTO
}