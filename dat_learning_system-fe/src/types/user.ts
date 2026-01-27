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
  positionName: string; // The label, e.g., "Project Manager"
  orgUnitName: string;  // The label, e.g., "Team Alpha"
  position: number;     // The ID value
}