import type { Section } from "./section";
import type { User } from "./user";

export interface Department {
    id: number;
    department_name: string;
    department_head: User;
    sections: Section[];
}