import React from 'react';
import { Box, Card, CardContent, Typography, Stack, IconButton, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

// Icons
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SchoolIcon from '@mui/icons-material/School';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PageLayout from '../../components/layout/PageLayout';

/* --- Stat Card --- */
const StatCard = ({ title, value, icon, color, delay }: any) => (
    <Box
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay }}
        sx={{
            // This allows the card to take full width on mobile (100%) 
            // and roughly 1/4th width on desktop (calc(25% - spacing))
            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 16px)', md: '1 1 calc(25% - 24px)' },
            minWidth: '220px'
        }}
    >
        <Card sx={{ height: '100%', boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)', borderRadius: 3 }}>
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

    return (
        <PageLayout>
            <Box sx={{ p: { xs: 2, md: 4 }, width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>

                {/* Header Section */}
                <Box>
                    <Typography variant="h4" fontWeight="bold">Management Dashboard</Typography>
                    <Typography variant="body1" color="text.secondary">
                        High-level overview of LMS performance and user activity.
                    </Typography>
                </Box>

                {/* Stats Container (Flex Row) */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                    <StatCard title="Total Users" value="1,284" icon={<PeopleAltIcon />} color={theme.palette.primary.main} delay={0.1} />
                    <StatCard title="Active Courses" value="42" icon={<SchoolIcon />} color="#2e7d32" delay={0.2} />
                    <StatCard title="Certifications" value="856" icon={<AssignmentTurnedInIcon />} color="#ed6c02" delay={0.3} />
                    <StatCard title="Avg. Progress" value="72%" icon={<TrendingUpIcon />} color="#9c27b0" delay={0.4} />
                </Box>

                {/* Main Content Area (Flex Row) */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>

                    {/* Engagement Chart (Grows more: flex 2) */}
                    <Box sx={{ flex: { xs: '1 1 100%', lg: '2 1 0' }, minWidth: '300px' }}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Learning Engagement Trend</Typography>
                                <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', borderRadius: 2, border: '1px dashed grey' }}>
                                    <Typography color="text.disabled">Chart Visualization Placeholder</Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Critical Actions (Grows less: flex 1) */}
                    <Box sx={{ flex: { xs: '1 1 100%', lg: '1 1 0' }, minWidth: '300px' }}>
                        <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>Critical Actions</Typography>
                                <Stack spacing={2}>
                                    {[
                                        { text: '12 Users pending approval', type: 'error' },
                                        { text: '5 Course updates required', type: 'warning' },
                                        { text: 'New Org Unit request from HR', type: 'info' }
                                    ].map((item, idx) => (
                                        <Box
                                            key={idx}
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: 'background.default',
                                                borderLeft: `5px solid ${item.type === 'error' ? 'red' : item.type === 'warning' ? 'orange' : 'blue'}`
                                            }}
                                        >
                                            <Typography variant="body2" fontWeight="medium">{item.text}</Typography>
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