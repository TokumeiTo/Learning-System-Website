// utils/roleFormConfig.ts
import { type RoleType } from './constants';

type FieldVisibility = 'hidden' | 'single' | 'multi' | 'readonly';

export type FieldConfig = {
    division: FieldVisibility;
    department: FieldVisibility;
    section: FieldVisibility;
    team: FieldVisibility;
};

export const roleFormConfig: Record<RoleType, FieldConfig> = {
    SUPER_ADMIN: { division: 'multi', department: 'multi', section: 'multi', team: 'multi' },
    ADMIN: { division: 'multi', department: 'multi', section: 'multi', team: 'multi' },
    DIVISION_HEAD: { division: 'multi', department: 'readonly', section: 'readonly', team: 'readonly' },
    DEPARTMENT_HEAD: { division: 'single', department: 'multi', section: 'readonly', team: 'readonly' },
    SECTION_HEAD: { division: 'single', department: 'single', section: 'single', team: 'multi' },
    PROJECT_MANAGER: { division: 'single', department: 'single', section: 'hidden', team: 'single' },
    EMPLOYEE: { division: 'single', department: 'single', section: 'hidden', team: 'single' },
};
