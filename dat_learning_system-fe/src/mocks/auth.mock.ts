import { Roles } from "../utils/constants";
import type { User } from "../types/user";

export const mockUsers: User[] = [
  {
    id: 1,
    companyCode: "00-00001",
    name: "CEO",
    email: "ceo@dat.com",
    role: Roles.SUPER_ADMIN,
  },
  {
    id: 2,
    companyCode: "01-00001",
    name: "Division Head 1",
    email: "div1@dat.com",
    role: Roles.DIVISION_HEAD,
    division: "Division 1",
  },
  {
    id: 3,
    companyCode: "01-01001",
    name: "Department Head 1",
    email: "dept1@dat.com",
    role: Roles.DEPARTMENT_HEAD,
    division: "Division 1",
    department: "Department 1",
  },
  {
    id: 4,
    companyCode: "01-01011",
    name: "Team Leader 1",
    email: "team1@dat.com",
    role: Roles.PROJECT_MANAGER,
    division: "Division 1",
    department: "Department 1",
    team: "Team 1",
  },
];
