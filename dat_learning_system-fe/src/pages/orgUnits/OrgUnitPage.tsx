import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
    TextField,
    InputAdornment,
    Divider
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
                bgcolor: '#f4f6f8',
                minHeight: '100vh'
            }}>

                {/* 1. Header Flex Row */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: 2
                }}>
                    <Stack spacing={0.5}>
                        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
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
                            sx={{ bgcolor: 'white' }}
                        >
                            Sync Data
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<MdAdd />}
                            disableElevation
                            sx={{ borderRadius: 2, px: 3 }}
                        >
                            Add New Unit
                        </Button>
                    </Stack>
                </Box>

                {/* 2. Main Content Flex Container */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', lg: 'row' },
                    gap: 3,
                    alignItems: 'flex-start'
                }}>

                    {/* Left Side: Info & Stats (Flex-Basis: 300px) */}
                    <Stack sx={{
                        flex: '0 0 320px',
                        width: { xs: '100%', lg: '320px' },
                        gap: 2
                    }}>
                        <Paper sx={{ p: 3, borderRadius: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <Stack spacing={2}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MdLayers color="#1976d2" size={24} />
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>Quick Stats</Typography>
                                </Box>
                                <Divider />
                                <StatItem label="Total Units" value="84" />
                                <StatItem label="Depth Levels" value="4 Levels" />
                                <StatItem label="Last Updated" value="Just now" />
                            </Stack>
                        </Paper>

                        <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'primary.dark', color: 'white' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                                Hierarchy Tip
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                Click on a parent unit to expand its sub-departments. The icons indicate the depth level automatically.
                            </Typography>
                        </Paper>
                    </Stack>

                    {/* Right Side: Tree View (Flex-Grow: 1) */}
                    <Paper sx={{
                        flex: 1,
                        width: '100%',
                        borderRadius: 3,
                        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Internal Search Bar */}
                        <Box sx={{ p: 2, borderBottom: '1px solid #eee', bgcolor: '#fafafa' }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search units (e.g. 'Finance', 'Offshore')..."
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <MdSearch size={20} />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: 2, bgcolor: 'white' }
                                }}
                            />
                        </Box>

                        <Box sx={{ p: 1 }}>
                            <OrgUnitHierarchy />
                        </Box>
                    </Paper>

                </Box>
            </Box>
        </PageLayout>
    );
};

// --- Small Helper for Stat Rows ---
const StatItem = ({ label, value }: { label: string, value: string }) => (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>{value}</Typography>
    </Box>
);

export default OrgPage;