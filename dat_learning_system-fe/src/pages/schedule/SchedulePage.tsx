import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Stack, Paper,
    IconButton, Avatar, CircularProgress
} from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers";
import {
    CalendarMonth, LocationOn,
    ArrowBackIosNew, ArrowForwardIos
} from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import PageLayout from '../../components/layout/PageLayout';
import { scheduleApi } from '../../api/schedule.api';
import type { SchedulePlan } from '../../types_interfaces/schedule';

export default function LMSSchedulePage() {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [activities, setActivities] = useState<SchedulePlan[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // Memoized fetch function to get targeted activities for the selected date
    const fetchMySchedule = useCallback(async (date: Dayjs) => {
        setLoading(true);
        try {
            // Formatting to ISO string for the backend
            const data = await scheduleApi.getMySchedule(date.format('YYYY-MM-DD'));
            setActivities(data);
        } catch (error) {
            console.error("Failed to fetch personal schedule", error);
        } finally {
            setLoading(false);
        }
    }, []);

    // Re-fetch whenever the user clicks a different date on the calendar
    useEffect(() => {
        if (selectedDate) {
            fetchMySchedule(selectedDate);
        }
    }, [selectedDate, fetchMySchedule]);

    const handleNextDay = () => setSelectedDate(prev => prev ? prev.add(1, 'day') : dayjs());
    const handlePrevDay = () => setSelectedDate(prev => prev ? prev.subtract(1, 'day') : dayjs());

    return (
        <PageLayout>
            <Box sx={{ p: { xs: 2, md: 6 } }}>
                <Box sx={{ maxWidth: '1200px', margin: '0 auto' }}>

                    {/* --- Header --- */}
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
                        <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary', mt: 1 }}>
                            My Schedule
                        </Typography>
                    </Stack>

                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '350px 1fr' }, gap: 6 }}>

                        {/* --- Sidebar --- */}
                        <Box>
                            <Paper elevation={0} sx={{ borderRadius: 4, p: 2, border: '1px solid #e2e8f0' }}>
                                <DateCalendar
                                    value={selectedDate}
                                    onChange={setSelectedDate}
                                    sx={{
                                        width: '100%',
                                        '& .MuiPickersDay-root': {
                                            borderRadius: 1.5,
                                            '&.Mui-selected': { bgcolor: 'primary !important' }
                                        }
                                    }}
                                />
                            </Paper>

                            <Box sx={{ mt: 4, p: 3, bgcolor: 'primary.light', borderRadius: 4, color: 'white' }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>Status</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 2 }}>
                                    {activities.length > 0
                                        ? `You have ${activities.length} activities scheduled for today.`
                                        : "Your schedule is clear for this date."}
                                </Typography>
                            </Box>
                        </Box>

                        {/* --- Main Timeline --- */}
                        <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
                                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                                    {selectedDate?.format('dddd, MMMM D')}
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <IconButton onClick={handlePrevDay} size="small" sx={{ border: '1px solid #e2e8f0' }}><ArrowBackIosNew sx={{ fontSize: 14 }} /></IconButton>
                                    <IconButton onClick={handleNextDay} size="small" sx={{ border: '1px solid #e2e8f0' }}><ArrowForwardIos sx={{ fontSize: 14 }} /></IconButton>
                                </Stack>
                            </Stack>

                            <Stack spacing={3} sx={{ position: 'relative', minHeight: '200px' }}>
                                <Box sx={{
                                    position: 'absolute', left: '20px', top: 0, bottom: 0,
                                    width: '2px', bgcolor: '#e2e8f0', zIndex: 0
                                }} />

                                {loading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
                                ) : activities.length > 0 ? (
                                    activities.map((activity) => (
                                        <Box key={activity.id} sx={{ display: 'flex', gap: 4, position: 'relative', zIndex: 1 }}>
                                            <Box sx={{
                                                width: 42, height: 42, borderRadius: '50%',
                                                bgcolor: 'white', border: `3px solid ${activity.color}`,
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                                boxShadow: '0 4px 10px rgba(0,0,0,0.05)'
                                            }}>
                                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: activity.color }} />
                                            </Box>

                                            <Paper
                                                elevation={0}
                                                sx={{
                                                    flexGrow: 1, p: 3, borderRadius: 4, border: '1px solid #e2e8f0', transition: '0.3s',
                                                    '&:hover': { border: `1px solid ${activity.color}`, transform: 'translateY(-2px)' }
                                                }}
                                            >
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                    <Box>
                                                        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                                                            <Typography variant="caption" sx={{ fontWeight: 800, color: activity.color, letterSpacing: 1 }}>
                                                                {activity.activityType}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ color: 'text.disabled' }}>•</Typography>
                                                            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                                                                {activity.courseName || 'General'}
                                                            </Typography>
                                                        </Stack>
                                                        <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>{activity.title}</Typography>

                                                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <CalendarMonth sx={{ fontSize: 18, color: 'text.disabled' }} />
                                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                    {dayjs(activity.startTime).format('hh:mm A')}
                                                                    {activity.endTime && ` - ${dayjs(activity.endTime).format('hh:mm A')}`}
                                                                </Typography>
                                                            </Stack>
                                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                                <LocationOn sx={{ fontSize: 18, color: 'text.disabled' }} />
                                                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary' }}>{activity.location}</Typography>
                                                            </Stack>
                                                        </Stack>
                                                    </Box>
                                                    <Avatar sx={{ bgcolor: activity.color, fontSize: 10, fontWeight: 700 }}>
                                                        {activity.instructorName?.split(' ').map(n => n[0]).join('') || '?'}
                                                    </Avatar>
                                                </Stack>
                                            </Paper>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography sx={{ textAlign: 'center', py: 10, color: 'text.disabled' }}>No activities scheduled for this day.</Typography>
                                )}
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </PageLayout>
    );
}