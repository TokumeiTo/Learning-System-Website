import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import RegisteredList from './RegisteredList';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { SitemarkIcon } from '../../components/custom-icons/CustomIcons';
import { Roles, type RoleType } from '../../utils/constants';
import SmartRegisterForm from './EmployeeRegisterForm';

type Role = 'employee' | 'admin' | 'divh' | 'depth' | 'sech' | 'pm';
const roleLabels: Record<Role, string> = {
    admin: 'Admin',
    divh: 'Division Head',
    depth: 'Department Head',
    sech: 'Section Head',
    pm: 'Project Manager',
    employee: 'Employee',
};

function mapRole(role: Role): RoleType {
    switch (role) {
        case 'admin':
            return Roles.ADMIN;
        case 'divh':
            return Roles.DIVISION_HEAD;
        case 'depth':
            return Roles.DEPARTMENT_HEAD;
        case 'sech':
            return Roles.SECTION_HEAD;
        case 'pm':
            return Roles.PROJECT_MANAGER;
        case 'employee':
        default:
            return Roles.EMPLOYEE;
    }
}

function getRoleForm(role: Role) {
    switch (role) {
        case 'admin':
            return <SmartRegisterForm role={mapRole(role)} />;
        case 'divh':
            return <SmartRegisterForm role={mapRole(role)} />;
        case 'depth':
            return <SmartRegisterForm role={mapRole(role)} />;
        case 'sech':
            return <SmartRegisterForm role={mapRole(role)} />;
        case 'pm':
            return <SmartRegisterForm role={mapRole(role)} />;
        case 'employee':
            return <SmartRegisterForm role={mapRole(role)} />;
        default:
            return null;
    }
}

export default function RegisterPage() {
    const [role, setRole] = React.useState<Role>('employee');

    const handleRoleChange = (
        _: React.MouseEvent<HTMLElement>,
        newRole: Role | null
    ) => {
        if (newRole) setRole(newRole);
    };

    return (
        <Grid
            container
            sx={{
                height: {
                    xs: '100%',
                    sm: 'calc(100dvh - var(--template-frame-height, 0px))',
                },
            }}
        >
            {/* LEFT PANEL */}
            <Grid
                size={{ xs: 12, sm: 5, lg: 4 }}
                sx={{
                    display: { xs: 'none', md: 'flex' },
                    flexDirection: 'column',
                    backgroundColor: 'background.paper',
                    borderRight: '1px solid',
                    borderColor: 'divider',
                    pt: 16,
                    px: 10,
                    gap: 4,
                }}
            >
                <SitemarkIcon />

                <Box sx={{ maxWidth: 500 }}>
                    <RegisteredList totalPrice="$134.98" />
                </Box>
            </Grid>

            {/* RIGHT PANEL */}
            <Grid
                size={{ sm: 12, md: 7, lg: 8 }}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    gap: 6,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {/* ROLE TOGGLER */}
                <Box sx={{ width: '100%'}}>
                    <ToggleButtonGroup
                        value={role}
                        exclusive
                        onChange={handleRoleChange}
                        fullWidth
                    >
                        {Object.entries(roleLabels).map(([key, label]) => (
                            <ToggleButton key={key} value={key}>
                                {label}
                            </ToggleButton>
                        ))}
                    </ToggleButtonGroup>
                </Box>

                {/* FORM CARD */}
                <Card sx={{ maxWidth: 600, width: '100%' }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            {roleLabels[role]} Registration
                        </Typography>

                        {getRoleForm(role)}
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
