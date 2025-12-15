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