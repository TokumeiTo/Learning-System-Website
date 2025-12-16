import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import RegisterForm from './RegisterForm';
import RegisteredList from './RegisteredList';
import PaymentForm from './PaymentForm';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { SitemarkIcon } from '../../components/custom-icons/CustomIcons';

type Role = 'ceo' | 'admin' | 'employee';
const roleLabels: Record<Role, string> = {
    ceo: 'CEO',
    admin: 'Admin',
    employee: 'Employee',
};

function getRoleForm(role: Role) {
    switch (role) {
        case 'ceo':
            return <RegisterForm />;
        case 'admin':
            return <PaymentForm />;
        case 'employee':
            return <RegisterForm />;
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
                    pt: { xs: 4, sm: 16 },
                    px: { xs: 2, sm: 10 },
                    width: '100%',
                    gap: 6,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {/* ROLE TOGGLER */}
                <Box sx={{ maxWidth: 600, width: '100%' }}>
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
