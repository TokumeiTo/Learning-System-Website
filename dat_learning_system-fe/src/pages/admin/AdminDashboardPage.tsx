import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, Stack, IconButton, useTheme, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';

// Icons & Layout
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PageLayout from '../../components/layout/PageLayout';

// API & Types
import { fetchDepartmentKPI } from '../../api/test.api';
import type { StudentPerformanceKPI } from '../../types/test';

/* --- Stat Card --- */
const StatCard = ({ title, value, icon, color, delay, isMock }: any) => (
    <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        sx={{
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 24px)' },
            minWidth: '220px'
        }}
    >
        <Card sx={{ height: '100%', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', borderRadius: 3, position: 'relative' }}>
            {isMock && (
                <Typography 
                    variant="caption" 
                    sx={{ position: 'absolute', top: 8, right: 40, color: 'text.disabled', fontStyle: 'italic' }}
                >
                    Mock
                </Typography>
            )}
            <CardContent>
                <Stack direction="row" justifyContent="space-between">
                    <Box sx={{ bgcolor: `${color}15`, p: 1.5, borderRadius: 2, display: 'flex' }}>
                        {React.cloneElement(icon, { sx: { color: color } })}
                    </Box>
                    <IconButton size="small"><MoreVertIcon /></IconButton>
                </Stack>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="h4" fontWeight="bold">{value}</Typography>
                    <Typography variant="body2" color="text.secondary">{title}</Typography>
                </Box>
            </CardContent>
        </Card>
    </Box>
);

const AdminDashboard: React.FC = () => {
    const theme = useTheme();
    const [kpiData, setKpiData] = useState<StudentPerformanceKPI[]>([]);
    const [loading, setLoading] = useState(true);

    // Assuming we have an OrgUnitId for the current admin's department
    const ORG_UNIT_ID = "00000000-0000-0000-0000-000000000000"; // Placeholder

    useEffect(() => {
        const loadKPIs = async () => {
            try {
                // REAL DATA: Fetching from the LessonAttemptService we built
                const data = await fetchDepartmentKPI(ORG_UNIT_ID);
                setKpiData(data);
            } catch (error) {
                console.error("Failed to load KPIs", error);
            } finally {
                setLoading(false);
            }
        };
        loadKPIs();
    }, []);

    // REAL DATA CALCULATIONS
    const avgScore = kpiData.length > 0 
        ? Math.round(kpiData.reduce((acc, curr) => acc + curr.overallAverageScore, 0) / kpiData.length)
        : 0;
    
    const totalCompletions = kpiData.reduce((acc, curr) => acc + curr.lessonsCompleted, 0);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <PageLayout>
            <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>

                <Box>
                    <Typography variant="h4" fontWeight="bold">Management Dashboard</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Performance overview for Department: <strong>Sales & Marketing</strong>
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {/* REAL DATA */}
                    <StatCard title="Total Students" value={kpiData.length} icon={<PeopleAltIcon />} color={theme.palette.primary.main} delay={0.1} />
                    <StatCard title="Total Lesson Passes" value={totalCompletions} icon={<AssignmentTurnedInIcon />} color="#ed6c02" delay={0.2} />
                    <StatCard title="Avg. Dept Score" value={`${avgScore}%`} icon={<TrendingUpIcon />} color="#9c27b0" delay={0.3} />
                    
                    {/* MOCK DATA - Backend aggregate for course count not yet built */}
                    <StatCard isMock title="Active Courses" value="42" icon={<SchoolIcon />} color="#2e7d32" delay={0.4} />
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    {/* REAL DATA TABLE: Student Performance List */}
                    <Box sx={{ flex: { xs: '1 1 100%', lg: '2 1 0' }, minWidth: '300px' }}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Student KPI Leaderboard</Typography>
                                <Stack spacing={1}>
                                    {kpiData.map((student) => (
                                        <Box key={student.userId} sx={{ display: 'flex', justifyContent: 'space-between', p: 1.5, bgcolor: 'background.default', borderRadius: 2 }}>
                                            <Typography variant="body2">{student.fullName}</Typography>
                                            <Typography variant="body2" fontWeight="bold">{student.overallAverageScore}%</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* MOCK DATA: Action items */}
                    <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 0' }, minWidth: '300px' }}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>System Alerts (Mock)</Typography>
                                <Stack spacing={2}>
                                    {[
                                        { text: '12 Users pending approval', type: 'error' },
                                        { text: '5 Course updates required', type: 'warning' }
                                    ].map((item, idx) => (
                                        <Box key={idx} sx={{ p: 2, borderRadius: 2, bgcolor: 'background.default', borderLeft: `5px solid ${item.type === 'error' ? 'red' : 'orange'}` }}>
                                            <Typography variant="body2">{item.text}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default AdminDashboard;