import { useState } from 'react';
import {
    Box, Typography, Stack, Paper,
    IconButton, Avatar, Button
} from "@mui/material";
import {
    DateCalendar
} from "@mui/x-date-pickers";
import {
    MoreVert, CalendarMonth,
    OnlinePrediction, LocationOn,
    ArrowBackIosNew, ArrowForwardIos
} from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import PageLayout from '../../components/layout/PageLayout';

// --- Clean, Structured Academic Types ---
export interface AcademicActivity {
    id: number;
    title: string;
    course: string;
    instructor: string;
    type: 'LECTURE' | 'LAB' | 'EXAM' | 'DEADLINE';
    start: string;
    end?: string;
    location: string;
    color: string;
}

const ACTIVITIES: AcademicActivity[] = [
    { id: 1, title: 'Neural Networks & Deep Learning', course: 'CS502', instructor: 'Dr. Aris Thorne', type: 'LECTURE', start: '10:00 AM', end: '11:30 AM', location: 'Hall 4 or Zoom', color: '#6366f1' },
    { id: 2, title: 'Final Research Proposal', course: 'BIO201', instructor: 'Prof. Sarah Jenks', type: 'DEADLINE', start: '11:59 PM', location: 'Digital Submission', color: '#f43f5e' },
    { id: 3, title: 'Chemistry Practical', course: 'CHM105', instructor: 'Lab Tech Sam', type: 'LAB', start: '02:00 PM', end: '04:00 PM', location: 'Lab 302', color: '#10b981' },
];

export default function ProfessionalLMSSchedule() {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());

    return (
        <PageLayout>
            <Box sx={{ bgcolor: '#F8FAFC', minHeight: '100vh', p: { xs: 2, md: 6 } }}>
                <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* --- Header: Simple & Bold --- */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
                        <Box>
                            <Typography variant="overline" sx={{ letterSpacing: 2, fontWeight: 700, color: 'text.disabled' }}>
                                STUDENT PORTAL
                            </Typography>
                            <Typography variant="h3" sx={{ fontWeight: 800, color: '#1e293b', mt: 1 }}>
                                My Schedule
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            disableElevation
                            startIcon={<CalendarMonth />}
                            sx={{ borderRadius: 2, px: 3, py: 1, bgcolor: '#1e293b', '&:hover': { bgcolor: '#334155' } }}
                        >
                            Sync to Calendar
                        </Button>
                    </Stack>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '350px 1fr' }, gap: 6 }}>

                        {/* --- Sidebar: Calendar --- */}
                        <Box>
                            <Paper elevation={0} sx={{ borderRadius: 4, p: 2, border: '1px solid #e2e8f0' }}>
                                <DateCalendar
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    sx={{
                                        width: '100%',
                                        '& .MuiPickersDay-root': {
                                            borderRadius: 1.5,
                                            '&.Mui-selected': { bgcolor: '#1e293b !important' }
                                        },
                                        '& .MuiTypography-caption': { fontWeight: 700 }
                                    }}
                                />
                            </Paper>

                            {/* Course Shortcut Tool */}
                            <Box sx={{ mt: 4, p: 3, bgcolor: '#1e293b', borderRadius: 4, color: 'white' }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>Up Next</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>You have a deadline for CS502 in 4 hours.</Typography>
                                <Button fullWidth sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', borderRadius: 2 }} variant="outlined">
                                    View Assignment
                                </Button>
                            </Box>
                        </Box>

                        {/* --- Main: Timeline --- */}
                        <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {selectedDate?.format('dddd, MMMM D')}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <IconButton size="small" sx={{ border: '1px solid #e2e8f0' }}><ArrowBackIosNew sx={{ fontSize: 14 }} /></IconButton>
                                    <IconButton size="small" sx={{ border: '1px solid #e2e8f0' }}><ArrowForwardIos sx={{ fontSize: 14 }} /></IconButton>
                                </Stack>
                            </Stack>

                            <Stack spacing={3} sx={{ position: 'relative' }}>
                                {/* The Vertical Timeline Line */}
                                <Box sx={{
                                    position: 'absolute', left: '20px', top: 0, bottom: 0,
                                    width: '2px', bgcolor: '#e2e8f0', zIndex: 0
                                }} />

                                {ACTIVITIES.map((activity) => (
                                    <Box key={activity.id} sx={{ display: 'flex', gap: 4, position: 'relative', zIndex: 1 }}>

                                        {/* Timeline Dot */}
                                        <Box sx={{
                                            width: 42, height: 42, borderRadius: '50%',
                                            bgcolor: 'white', border: `3px solid ${activity.color}`,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0, boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                        }}>
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: activity.color }} />
                                        </Box>

                                        {/* Activity Card */}
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                flexGrow: 1, p: 3, borderRadius: 4,
                                                border: '1px solid #e2e8f0',
                                                transition: '0.3s',
                                                '&:hover': { border: `1px solid ${activity.color}`, transform: 'translateY(-2px)', boxShadow: '0 12px 24px rgba(0,0,0,0.03)' }
                                            }}
                                        >
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                <Box>
                                                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                                        <Typography variant="caption" sx={{ fontWeight: 800, color: activity.color, letterSpacing: 1 }}>
                                                            {activity.type}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.disabled', fontWeight: 700 }}>•</Typography>
                                                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                                                            {activity.course}
                                                        </Typography>
                                                    </Stack>
                                                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>{activity.title}</Typography>

                                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <OnlinePrediction sx={{ fontSize: 18, color: 'text.disabled' }} />
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>{activity.start} {activity.end && ` - ${activity.end}`}</Typography>
                                                        </Stack>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <LocationOn sx={{ fontSize: 18, color: 'text.disabled' }} />
                                                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{activity.location}</Typography>
                                                        </Stack>
                                                    </Stack>
                                                </Box>

                                                <Stack alignItems="flex-end" justifyContent="space-between" sx={{ height: '100%' }}>
                                                    <IconButton size="small"><MoreVert /></IconButton>
                                                    <Stack direction="row" spacing={-1}>
                                                        <Avatar sx={{ width: 28, height: 28, fontSize: 12, border: '2px solid white' }}>+</Avatar>
                                                        <Avatar sx={{ width: 28, height: 28, bgcolor: activity.color, fontSize: 10, border: '2px solid white', fontWeight: 700 }}>
                                                            {activity.instructor.split(' ').map(n => n[0]).join('')}
                                                        </Avatar>
                                                    </Stack>
                                                </Stack>
                                            </Stack>
                                        </Paper>
                                    </Box>
                                ))}
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </PageLayout>
    );
}