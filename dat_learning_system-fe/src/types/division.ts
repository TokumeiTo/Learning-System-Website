import type { Department } from "./department";
import type { User } from "./user";

export interface Division {
    id: number;
    division_name: string;
    division_head: User;
    departments: Department[];
}