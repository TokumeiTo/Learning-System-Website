import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogContent, Box, Typography, Stack,
    IconButton, Chip, Divider, Button, Rating, CircularProgress, useTheme, alpha
} from '@mui/material';
import {
    Close, Timer, MenuBook,
    WorkspacePremium, FiberManualRecord, PlayCircleOutline, Lock
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getEnrollmentStatus, requestEnrollment } from '../../api/enrollment.api';
import type { Course } from '../../types/course';
import type { EnrollmentStatusResponse } from '../../types/enrollment';

interface CourseDetailModalProps {
    course: Course;
    open: boolean;
    onClose: () => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, open, onClose }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    
    // Logic States
    const [status, setStatus] = useState<EnrollmentStatusResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const statusColor = course.status === 'Published' ? theme.palette.success.main : theme.palette.warning.main;
    const imageUrl = course.thumbnail.startsWith('http')
        ? course.thumbnail
        : `${import.meta.env.VITE_API_URL}${course.thumbnail}`;

    // Enrollment Logic
    useEffect(() => {
        if (open) {
            checkStatus();
        }
    }, [open, course.id]);

    const checkStatus = async () => {
        setLoading(true);
        try {
            const res = await getEnrollmentStatus(course.id);
            setStatus(res);
        } catch (err) {
            console.error("Failed to fetch status", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEnrollRequest = async () => {
        setSubmitting(true);
        try {
            await requestEnrollment({ courseId: course.id });
            await checkStatus(); 
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            scroll="body"
            PaperProps={{
                sx: { borderRadius: 6, overflow: 'hidden', bgcolor: 'background.paper', backgroundImage: 'none' }
            }}
        >
            <DialogContent sx={{ p: 0, position: 'relative' }}>
                {/* Close Button Overlay */}
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute', right: 16, top: 16,
                        bgcolor: alpha(theme.palette.common.black, 0.4), 
                        color: 'white',
                        backdropFilter: 'blur(8px)',
                        zIndex: 10,
                        '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.6) }
                    }}
                >
                    <Close fontSize="small" />
                </IconButton>

                {/* 1. Header Image Section */}
                <Box sx={{ position: 'relative', width: '100%', height: 260 }}>
                    <Box
                        component="img"
                        src={imageUrl}
                        alt={course.title}
                        onError={(e: any) => {
                            e.target.src = 'https://placehold.co/600x400?text=No+Thumbnail';
                        }}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <Stack direction="row" spacing={1} sx={{ position: 'absolute', bottom: 20, left: 20 }}>
                        <Chip
                            label={course.badge}
                            sx={{
                                bgcolor: alpha(theme.palette.background.paper, 0.9),
                                fontWeight: 800,
                                color: 'primary.main',
                                backdropFilter: 'blur(4px)',
                                border: `1px solid ${theme.palette.divider}`
                            }}
                        />
                    </Stack>
                </Box>

                {/* 2. Content Section */}
                <Stack sx={{ p: 4 }} spacing={3}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="overline" fontWeight={800} color="primary" sx={{ letterSpacing: 1.5 }}>
                            {course.category}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.6}>
                            <FiberManualRecord sx={{ fontSize: 10, color: statusColor }} />
                            <Typography variant="caption" fontWeight={700} color="text.secondary">
                                {course.status}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Box>
                        <Typography variant="h4" fontWeight={900} sx={{ color: 'text.primary', mb: 1, letterSpacing: '-0.5px' }}>
                            {course.title}
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Rating value={course.rating} readOnly precision={0.5} size="small" />
                            <Typography variant="caption" fontWeight={700} sx={{ color: 'text.secondary' }}>
                                {course.rating} ({course.enrolledCount} Students)
                            </Typography>
                        </Stack>
                    </Box>

                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                        {course.description}
                    </Typography>

                    <Divider />

                    {/* Meta Stats Row */}
                    <Stack direction="row" flexWrap="wrap" gap={3}>
                        <DetailItem icon={<Timer />} label="Duration" value={`${course.totalHours}h`} />
                        <DetailItem icon={<MenuBook />} label="Curriculum" value={`${course.topics?.length || 0} Topics`} />
                        <DetailItem icon={<WorkspacePremium />} label="Certificate" value="Included" />
                    </Stack>

                    {/* 3. Enrollment Action Area */}
                    <Box sx={{ 
                        bgcolor: alpha(theme.palette.primary.main, 0.04), 
                        p: 3, 
                        borderRadius: 4, 
                        border: `1px solid ${theme.palette.divider}` 
                    }}>
                        {loading ? (
                            <Stack alignItems="center" py={1}><CircularProgress size={28} /></Stack>
                        ) : (
                            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight={900} color="text.primary">Enrollment Status</Typography>
                                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                        {status?.status === 'None' ? 'Open for new requests' : `Current Status: ${status?.status}`}
                                    </Typography>
                                </Box>

                                {status?.isEnrolled ? (
                                    <Button 
                                        variant="contained" 
                                        color="success" 
                                        fullWidth={false}
                                        startIcon={<PlayCircleOutline />}
                                        onClick={() => navigate(`/classroom/${course.id}`)}
                                        sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 800, textTransform: 'none' }}
                                    >
                                        Enter Classroom
                                    </Button>
                                ) : status?.status === 'Pending' ? (
                                    <Button disabled variant="outlined" sx={{ borderRadius: 3, px: 4, py: 1.5, fontWeight: 800 }}>
                                        Waiting for Approval
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="contained" 
                                        onClick={handleEnrollRequest}
                                        disabled={submitting}
                                        startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <Lock />}
                                        sx={{ 
                                            borderRadius: 3, 
                                            px: 4, 
                                            py: 1.5, 
                                            fontWeight: 800, 
                                            textTransform: 'none',
                                            bgcolor: 'text.primary',
                                            color: 'background.paper',
                                            '&:hover': { bgcolor: 'primary.main' }
                                        }}
                                    >
                                        {submitting ? 'Requesting...' : 'Request Access'}
                                    </Button>
                                )}
                            </Stack>
                        )}
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => {
    const theme = useTheme();
    return (
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Box sx={{ 
                color: 'primary.main', 
                display: 'flex', 
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                p: 1,
                borderRadius: 2
            }}>
                {React.cloneElement(icon as React.ReactElement)}
            </Box>
            <Box>
                <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ display: 'block', lineHeight: 1, textTransform: 'uppercase' }}>
                    {label}
                </Typography>
                <Typography variant="body2" fontWeight={900} color="text.primary">
                    {value}
                </Typography>
            </Box>
        </Stack>
    );
};

export default CourseDetailModal;