import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
    TextField,
    InputAdornment,
    Divider,
    useTheme
} from '@mui/material';
import {
    MdAdd,
    MdRefresh,
    MdSearch,
    MdLayers
} from 'react-icons/md';
import { useQueryClient } from '@tanstack/react-query';
import { OrgUnitHierarchy } from '../../components/orgUnits/OrgUnitHierarchy';
import PageLayout from '../../components/layout/PageLayout';

const OrgPage: React.FC = () => {
    const queryClient = useQueryClient();
    const theme = useTheme();

    const handleRefresh = () => {
        queryClient.invalidateQueries({ queryKey: ['org-hierarchy'] });
    };

    return (
        <PageLayout>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                p: 4,
                bgcolor: 'background.default',
                minHeight: '100vh',
                transition: 'background-color 0.3s'
            }}>

                {/* 1. Header Area */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Stack spacing={0.5}>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: 'text.primary' }}>
                            Organizational Structure
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage and visualize hierarchy from Divisions down to Team levels.
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1.5}>
                        <Button
                            variant="outlined"
                            color="inherit"
                            startIcon={<MdRefresh />}
                            onClick={handleRefresh}
                            sx={{ bgcolor: 'background.paper', borderColor: 'divider' }}
                        >
                            Sync Data
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<MdAdd />}
                            disableElevation
                            sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
                        >
                            Add New Unit
                        </Button>
                    </Stack>
                </Box>

                {/* 2. Main Content Container */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    gap: 3,
                    alignItems: 'flex-start'
                }}>

                    {/* Left Side: Info & Stats */}
                    <Stack sx={{
                        flex: '0 0 320px',
                        width: { xs: '100%', lg: '320px' },
                        gap: 2
                    }}>
                        <Paper sx={{ 
                            p: 3, 
                            borderRadius: 4, 
                            bgcolor: 'background.paper',
                            border: `1px solid ${theme.palette.divider}`,
                            backgroundImage: 'none'
                        }}>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MdLayers color={theme.palette.primary.main} size={24} />
                                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                        Quick Stats
                                    </Typography>
                                </Box>
                                <Divider />
                                <StatItem label="Total Units" value="84" />
                                <StatItem label="Depth Levels" value="4 Levels" />
                                <StatItem label="Last Updated" value="Just now" />
                            </Stack>
                        </Paper>

                        <Paper sx={{ 
                            p: 3, 
                            borderRadius: 4, 
                            bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.main', 
                            color: 'primary.contrastText',
                            boxShadow: theme.shadows[4]
                        }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1 }}>
                                Hierarchy Tip
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, lineHeight: 1.6 }}>
                                Click on a parent unit to expand its sub-departments. The icons indicate the depth level automatically.
                            </Typography>
                        </Paper>
                    </Stack>

                    {/* Right Side: Tree View */}
                    <Paper sx={{
                        flex: 1,
                        width: '100%',
                        borderRadius: 4,
                        bgcolor: 'background.paper',
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        backgroundImage: 'none'
                    }}>
                        {/* Internal Search Bar */}
                        <Box sx={{ 
                            p: 2, 
                            borderBottom: `1px solid ${theme.palette.divider}`, 
                            bgcolor: theme.palette.background.gray // Using your custom gray token
                        }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search units (e.g. 'Finance', 'Offshore')..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MdSearch size={20} color={theme.palette.text.secondary} />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 2, bgcolor: 'background.paper' }
                                }}
                            />
                        </Box>

                        <Box sx={{ p: 2 }}>
                            <OrgUnitHierarchy />
                        </Box>
                    </Paper>

                </Box>
            </Box>
        </PageLayout>
    );
};

const StatItem = ({ label, value }: { label: string, value: string }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary" fontWeight={500}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>{value}</Typography>
    </Box>
);

export default OrgPage;