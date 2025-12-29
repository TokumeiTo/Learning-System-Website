export const Roles = {
    SUPER_ADMIN: "SUPER_ADMIN",
    ADMIN: "ADMIN",
    DIVISION_HEAD: "DIVISION_HEAD",
    DEPARTMENT_HEAD: "DEPARTMENT_HEAD",
    SECTION_HEAD: "SECTION_HEAD",
    PROJECT_MANAGER: "PROJECT_MANAGER",
    EMPLOYEE: "EMPLOYEE"
} as const;

export type RoleType = typeof Roles[keyof typeof Roles];