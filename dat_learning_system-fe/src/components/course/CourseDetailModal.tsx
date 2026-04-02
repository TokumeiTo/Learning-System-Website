import React, { useEffect, useState, useCallback } from 'react';
import {
    Dialog, DialogContent, Box, Typography, Stack,
    IconButton, Divider, Button, Rating, CircularProgress, useTheme, alpha
} from '@mui/material';
import {
    Close, Timer, MenuBook, WorkspacePremium,
    FiberManualRecord, PlayCircleOutline, Lock, Archive, Edit, DeleteForever
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// API & Types
import { getEnrollmentStatus, requestEnrollment } from '../../api/enrollment.api';
import { closeCourse, purgeCourse } from '../../api/course.api';
import type { Course } from '../../types_interfaces/course';
import type { EnrollmentStatusResponse } from '../../types_interfaces/enrollment';

// Components
import CourseRatingAction from './CourseRatingAction';
import UpdateCourseModal from './EditCourseModal';
import { useAuth } from '../../hooks/useAuth';

interface CourseDetailModalProps {
    course: Course;
    open: boolean;
    onClose: () => void;
    onRefresh?: () => void;
}

const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, open, onClose, onRefresh }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { isAdmin } = useAuth();


    // States
    const [status, setStatus] = useState<EnrollmentStatusResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);

    const imageUrl = course.thumbnail?.startsWith('http')
        ? course.thumbnail
        : `${import.meta.env.VITE_API_URL}${course.thumbnail}`;

    const checkStatus = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getEnrollmentStatus(course.id);
            setStatus(res);
        } catch (err) {
            console.error("Failed to fetch status", err);
        } finally {
            setLoading(false);
        }
    }, [course.id]);

    useEffect(() => {
        if (open) checkStatus();
    }, [open, checkStatus]);

    // Handlers
    const handleEnrollRequest = async () => {
        setActionLoading(true);
        try {
            await requestEnrollment({ courseId: course.id });
            await checkStatus();
        } finally {
            setActionLoading(false);
        }
    };

    const handleCloseCourse = async () => {
        if (window.confirm("Close this course? New students won't be able to enroll.")) {
            try {
                await closeCourse(course.id);
                onRefresh?.();
                onClose();
            } catch (err) { console.error(err); }
        }
    };

    const handlePurgeCourse = async () => {
        if (window.prompt("Type 'PURGE' to permanently delete all data.") === 'PURGE') {
            try {
                await purgeCourse(course.id);
                onRefresh?.();
                onClose();
            } catch (err) { console.error(err); }
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="sm"
                fullWidth
                scroll="body"
                PaperProps={{
                    sx: { borderRadius: 5, overflow: 'hidden', backgroundImage: 'none' }
                }}
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    {/* Admin Actions Overlay */}
                    {isAdmin && (
                        <Stack direction="row" spacing={1} sx={{ position: 'absolute', left: 16, top: 16, zIndex: 10 }}>
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.currentTarget.blur();
                                    setIsUpdateOpen(true);
                                }}
                                sx={{
                                    bgcolor: alpha(theme.palette.info.main, 0.9),
                                    color: 'white',
                                    '&:hover': { bgcolor: 'info.main' }
                                }}
                            >
                                <Edit fontSize="small" />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={handleCloseCourse}
                                sx={{ bgcolor: alpha(theme.palette.warning.main, 0.9), color: 'white', '&:hover': { bgcolor: 'warning.main' } }}
                            >
                                <Archive fontSize="small" />
                            </IconButton>
                        </Stack>
                    )}

                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute', right: 16, top: 16, zIndex: 10,
                            bgcolor: alpha(theme.palette.common.black, 0.4), color: 'white',
                            '&:hover': { bgcolor: alpha(theme.palette.common.black, 0.6) }
                        }}
                    >
                        <Close fontSize="small" />
                    </IconButton>

                    {/* Banner Image */}
                    <Box sx={{ width: '100%', height: 240, bgcolor: 'grey.300' }}>
                        <Box
                            component="img"
                            src={imageUrl}
                            alt={course.title}
                            onError={(e: any) => { e.target.src = '/No_Thumbnail.svg'; }}
                            sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                    </Box>

                    <Stack sx={{ p: 4 }} spacing={3}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography variant="overline" fontWeight={800} color="primary">
                                {course.category}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <FiberManualRecord sx={{ fontSize: 10, color: course.status === 'Published' ? 'success.main' : 'warning.main' }} />
                                <Typography variant="caption" fontWeight={700}>{course.status}</Typography>
                            </Stack>
                        </Stack>

                        <Box>
                            <Typography variant="h4" fontWeight={900} gutterBottom>{course.title}</Typography>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Rating value={course.rating} readOnly precision={0.5} size="small" />
                                <Typography variant="caption" fontWeight={700} color="text.secondary">
                                    {course.rating} ({course.enrolledCount} Students)
                                </Typography>
                            </Stack>
                        </Box>

                        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                            {course.description}
                        </Typography>

                        {status?.status === 'Approved' && (
                            <Box sx={{ py: 1 }}>
                                <Divider sx={{ mb: 2 }} />
                                <CourseRatingAction courseId={course.id} onSuccess={onRefresh} />
                                <Divider sx={{ mt: 2 }} />
                            </Box>
                        )}

                        <Stack direction="row" flexWrap="wrap" gap={3}>
                            <DetailItem icon={<Timer />} label="Duration" value={`${course.totalHours}h`} />
                            <DetailItem icon={<MenuBook />} label="Topics" value={`${course.classworkTopics?.length || 0} Topics`} />
                            <DetailItem icon={<WorkspacePremium />} label="Modules" value={`${course.lessons?.length || 0} Curriculums`} />
                        </Stack>

                        <Box sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.04),
                            p: 3, borderRadius: 4, border: `1px solid ${theme.palette.divider}`
                        }}>
                            {loading ? (
                                <Stack alignItems="center"><CircularProgress size={24} /></Stack>
                            ) : (
                                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight={900}>Enrollment</Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {status?.status === 'None' ? 'Open for enrollment' : `Status: ${status?.status}`}
                                        </Typography>
                                    </Box>

                                    {status?.isEnrolled ? (
                                        <Button
                                            variant="contained"
                                            startIcon={<PlayCircleOutline />}
                                            onClick={() => navigate(`/classroom/${course.id}`)}
                                            sx={{ borderRadius: 2, px: 3, fontWeight: 800, textTransform: 'none' }}
                                        >
                                            Go to Course
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            onClick={handleEnrollRequest}
                                            disabled={actionLoading || status?.status === 'Pending' || status?.status === 'Rejected'}
                                            startIcon={actionLoading ? <CircularProgress size={16} /> : <Lock />}
                                            sx={{
                                                borderRadius: 2, px: 3, fontWeight: 800, textTransform: 'none',
                                                bgcolor: status?.status === 'Rejected' ? 'error.light' : 'text.primary'
                                            }}
                                        >
                                            {status?.status === 'Pending' ? 'Awaiting Approval' :
                                                status?.status === 'Rejected' ? 'Access Denied' : 'Request Access'}
                                        </Button>
                                    )}
                                </Stack>
                            )}
                        </Box>

                        {isAdmin && (
                            <Button
                                fullWidth
                                color="error"
                                size="small"
                                startIcon={<DeleteForever />}
                                onClick={handlePurgeCourse}
                                sx={{ mt: 1, opacity: 0.6, '&:hover': { opacity: 1 }, textTransform: 'none' }}
                            >
                                Delete Course Permanently
                            </Button>
                        )}
                    </Stack>
                </DialogContent>
            </Dialog>

            {/* Sub-modal for Updating */}
            <UpdateCourseModal
                course={course}
                open={isUpdateOpen}
                onClose={() => setIsUpdateOpen(false)}
                onSuccess={() => {
                    onRefresh?.();
                    setIsUpdateOpen(false);
                }}
            />
        </>
    );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
    <Stack direction="row" spacing={1.5} alignItems="center">
        <Box sx={{ color: 'primary.main', bgcolor: (t) => alpha(t.palette.primary.main, 0.1), p: 1, borderRadius: 2, display: 'flex' }}>
            {icon}
        </Box>
        <Box>
            <Typography variant="caption" color="text.disabled" fontWeight={800} sx={{ display: 'block', textTransform: 'uppercase', fontSize: '0.65rem' }}>
                {label}
            </Typography>
            <Typography variant="body2" fontWeight={900}>
                {value}
            </Typography>
        </Box>
    </Stack>
);

export default CourseDetailModal;