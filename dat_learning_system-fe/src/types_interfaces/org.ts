import type { User } from "./user";

export interface Team {
    id: number;
    team_name: string;
    pm: User;
}

export interface Section {
    id: number;
    section_name: string;
    section_head: User;
    teams: Team[];
}

export interface Department {
    id: number;
    department_name: string;
    department_head: User;
    sections: Section[];
}

export interface Division {
    id: number;
    division_name: string;
    division_head: User;
    departments: Department[];
}

export interface OrgUnit {
  id: number;
  name: string;
  level: number;
  parentId: number | null;
  children: OrgUnit[];
}