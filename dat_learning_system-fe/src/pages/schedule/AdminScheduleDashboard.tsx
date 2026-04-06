import dayjs, { Dayjs } from 'dayjs';
import { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Paper, Stack } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { scheduleApi } from '../../api/schedule.api';
import type { SchedulePlan } from '../../types_interfaces/schedule';
import ScheduleDialog from '../../components/schedule/ScheduleDialog';
import PageLayout from '../../components/layout/PageLayout';

const AdminScheduleDashboard = () => {
    const [currentDate, setCurrentDate] = useState(dayjs());
    const [plans, setPlans] = useState<SchedulePlan[]>([]);
    const [selectedPlan, setSelectedPlan] = useState<SchedulePlan | null>(null);
    const [clickedDate, setClickedDate] = useState<Dayjs | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchPlans = async () => {
        const data = await scheduleApi.getAllAdminPlans();
        setPlans(data);
    };

    useEffect(() => { fetchPlans(); }, []);

    // --- Calendar Generation Logic ---
    const startOfMonth = currentDate.startOf('month');
    const endOfMonth = currentDate.endOf('month');
    const daysInMonth: (Dayjs | null)[] = [];

    // Prefix empty slots for the first week
    for (let i = 0; i < startOfMonth.day(); i++) {
        daysInMonth.push(null);
    }
    // Fill the actual days
    for (let i = 1; i <= endOfMonth.date(); i++) {
        daysInMonth.push(startOfMonth.date(i));
    }

    const handleDateClick = (date: Dayjs) => {
        setSelectedPlan(null);
        setClickedDate(date);
        setIsModalOpen(true);
    };

    const handlePlanClick = (plan: SchedulePlan, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedPlan(plan);
        setClickedDate(dayjs(plan.startTime));
        setIsModalOpen(true);
    };

    return (
        <PageLayout>
            <Box sx={{ p: 4 }}>
                {/* Calendar Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight={800}>
                        {currentDate.format('MMMM YYYY')}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <IconButton onClick={() => setCurrentDate(currentDate.subtract(1, 'month'))}><ArrowBackIos /></IconButton>
                        <IconButton onClick={() => setCurrentDate(currentDate.add(1, 'month'))}><ArrowForwardIos /></IconButton>
                    </Stack>
                </Stack>

                {/* The 7-Column Grid */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(7, 1fr)',
                    gap: '1px',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    overflow: 'hidden'
                }}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <Box key={day} sx={{ bgcolor: 'background.default', p: 1.5, textAlign: 'center' }}>
                            <Typography variant="subtitle2" fontWeight={700} color="text.default">{day}</Typography>
                        </Box>
                    ))}

                    {daysInMonth.map((date, idx) => {
                        const isToday = date && date.isSame(dayjs(), 'day'); // 1. Check if it's today

                        return (
                            <Box
                                key={idx}
                                onClick={() => date && handleDateClick(date)}
                                sx={{
                                    minHeight: '140px',
                                    bgcolor: isToday ? '#eff6ff' : 'background.paper', // 2. Light blue tint for today
                                    border: isToday ? '2px solid #3b82f6' : '1px solid lightgray', // 3. Thicker blue border
                                    p: 1,
                                    position: 'relative', // Necessary for the badge
                                    transition: '0.2s',
                                    cursor: date ? 'pointer' : 'default',
                                    zIndex: isToday ? 1 : 0, // Ensure today's border sits on top
                                    '&:hover': { bgcolor: date ? '#9acdfd' : 'background.paper' }
                                }}
                            >
                                {date && (
                                    <>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                            <Typography
                                                variant="body2"
                                                fontWeight={isToday ? 800 : 600}
                                                color={isToday ? "primary.main" : "text.secondary"}
                                            >
                                                {date.date()}
                                            </Typography>

                                            {/* 4. Add a "TODAY" Chip/Badge for extra clarity */}
                                            {isToday && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        bgcolor: 'primary.main',
                                                        color: 'white',
                                                        px: 0.5,
                                                        borderRadius: 0.5,
                                                        fontSize: '0.6rem',
                                                        fontWeight: 900
                                                    }}
                                                >
                                                    TODAY
                                                </Typography>
                                            )}
                                        </Stack>

                                        <Stack spacing={0.5}>
                                            {plans
                                                .filter(p => dayjs(p.startTime).isSame(date, 'day'))
                                                .map(plan => (
                                                    <Box
                                                        key={plan.id}
                                                        onClick={(e) => handlePlanClick(plan, e)}
                                                        sx={{
                                                            bgcolor: plan.color || '#6366f1',
                                                            color: 'white',
                                                            p: '4px 8px',
                                                            borderRadius: '4px',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                            '&:hover': { filter: 'brightness(0.9)' }
                                                        }}
                                                    >
                                                        {plan.title}
                                                    </Box>
                                                ))
                                            }
                                        </Stack>
                                    </>
                                )}
                            </Box>
                        );

                    })}
                </Box>

                {isModalOpen && (
                    <ScheduleDialog
                        plan={selectedPlan}
                        initialDate={clickedDate}
                        onClose={() => setIsModalOpen(false)}
                        onSuccess={fetchPlans}
                    />
                )}
            </Box>
        </PageLayout>
    );
};

export default AdminScheduleDashboard;