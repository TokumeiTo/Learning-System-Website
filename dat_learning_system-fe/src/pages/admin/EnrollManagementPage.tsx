import { useState } from 'react';
import {
    Box, Typography, Stack, Tabs, Tab, Container, Fade, useTheme
} from "@mui/material";
import {
    Shield,
    HourglassEmpty,
    History as HistoryIcon
} from "@mui/icons-material";

// Components
import EnrollmentQueue from "../../components/admin/EnrollmentQueue";
import EnrollmentHistory from "../../components/admin/EnrollmentHistory";
import PageLayout from '../../components/layout/PageLayout';

const EnrollmentApprovalPage = () => {
    const [tab, setTab] = useState(0);
    const theme = useTheme();

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTab(newValue);
    };

    return (
        <PageLayout>
            <Box sx={{
                minHeight: 'calc(100vh - 65px)',
                bgcolor: 'background.default', // Using theme.palette.background.default
                pb: 8,
                transition: 'background-color 0.3s ease'
            }}>
                {/* --- TOP BRANDED HEADER --- */}
                <Box sx={{
                    bgcolor: 'background.paper', // Using theme.palette.background.paper
                    pt: 6, pb: 0,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.palette.mode === 'dark' 
                        ? '0 4px 20px rgba(0,0,0,0.4)' 
                        : '0 2px 10px rgba(0,0,0,0.05)',
                }}>
                    <Container maxWidth="xl">
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                            <Box>
                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                                    <Box sx={{
                                        p: 0.8,
                                        bgcolor: theme.palette.mode === 'dark' ? 'rgba(61, 167, 253, 0.1)' : 'rgba(25, 118, 210, 0.1)',
                                        borderRadius: 1.5,
                                        display: 'flex'
                                    }}>
                                        <Shield sx={{ color: 'primary.main', fontSize: 20 }} />
                                    </Box>
                                    <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 800, letterSpacing: 1.5 }}>
                                        Admin Dashboard
                                    </Typography>
                                </Stack>
                                <Typography variant="h3" sx={{ color: 'text.primary', fontWeight: 900, letterSpacing: '-0.02em' }}>
                                    Enrollment Requests
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                                    Review student applications and payment proof to grant access.
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 600 }}>SYSTEM STATUS</Typography>
                                    <Typography variant="h6" sx={{ color: 'success.main', fontWeight: 800 }}>Live</Typography>
                                </Box>
                            </Stack>
                        </Stack>

                        {/* STYLED TABS - Fully Themed */}
                        <Tabs
                            value={tab}
                            onChange={handleTabChange}
                            sx={{
                                '& .MuiTabs-indicator': { height: 3, borderRadius: '4px 4px 0 0', bgcolor: 'primary.main' },
                                '& .MuiTab-root': {
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.95rem',
                                    minHeight: 60,
                                    color: 'text.disabled',
                                    transition: '0.2s',
                                    '&.Mui-selected': { color: 'primary.main' },
                                    '&:hover': { color: 'text.primary' }
                                }
                            }}
                        >
                            <Tab
                                icon={<HourglassEmpty sx={{ fontSize: 18 }} />}
                                iconPosition="start"
                                label="Pending Queue"
                            />
                            <Tab
                                icon={<HistoryIcon sx={{ fontSize: 18 }} />}
                                iconPosition="start"
                                label="Approval History"
                            />
                        </Tabs>
                    </Container>
                </Box>

                {/* --- CONTENT AREA --- */}
                <Container maxWidth="xl" sx={{ mt: 5 }}>
                    <Fade in={true} timeout={600}>
                        <Box sx={{ color: 'text.primary' }}>
                            {tab === 0 ? (
                                <EnrollmentQueue />
                            ) : (
                                <EnrollmentHistory />
                            )}
                        </Box>
                    </Fade>
                </Container>
            </Box>
        </PageLayout>
    );
};

export default EnrollmentApprovalPage;