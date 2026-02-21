import React, { useState } from 'react';
import {
    Box, Typography, Stack, Card, CardContent, CardMedia,
    Chip, Button, Rating as MuiRating, Divider, useTheme, alpha
} from '@mui/material';
import { Timer, Group, MenuBook, FiberManualRecord } from '@mui/icons-material';
import type { Course } from '../../types/course';
import CourseDetailModal from './CourseDetailModal';

interface CourseCardProps {
    course: Course;
    onRefresh?: () => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onRefresh}) => {
    const theme = useTheme();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Dynamic color logic using theme palette
    const getStatusColor = () => {
        if (course.status === 'Published') return theme.palette.success.main;
        if (course.status === 'Draft') return theme.palette.warning.main;
        return theme.palette.info.main;
    };

    return (
        <>
            <Card sx={{
                borderRadius: 5,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
                backgroundImage: 'none', // Critical for dark mode consistency
                overflow: 'hidden',
                '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: theme.palette.mode === 'dark' 
                        ? `0 20px 40px ${alpha(theme.palette.common.black, 0.4)}` 
                        : theme.shadows[10],
                    borderColor: 'primary.main',
                }
            }}>
                {/* Image Section */}
                <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                        component="img"
                        height="180"
                        image={course.thumbnail.startsWith('http') ? course.thumbnail : `${import.meta.env.VITE_API_URL}${course.thumbnail}`}
                        alt={course.title}
                        onError={(e: any) => {
                            e.target.src = '/No_Thumbnail.svg';
                        }}
                        sx={{
                            filter: course.status === 'Draft' ? 'grayscale(0.6)' : 'none',
                            objectFit: 'contain',
                            bgcolor: 'white',
                            transition: 'transform 0.5s ease',
                            '&:hover': { transform: 'scale(1.05)' },
                        }}
                    />

                    {/* Badge Overlay */}
                    <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 12, left: 12 }}>
                        <Chip
                            label={course.badge}
                            size="small"
                            sx={{
                                bgcolor: alpha(theme.palette.background.paper, 0.9),
                                fontWeight: 800,
                                backdropFilter: 'blur(4px)',
                                fontSize: '0.65rem',
                                color: 'primary.main',
                                border: `1px solid ${theme.palette.primary.main}`,
                                height: 24
                            }}
                        />
                        {course.isMandatory && (
                            <Chip
                                label="MANDATORY"
                                color="error"
                                size="small"
                                sx={{ fontWeight: 900, fontSize: '0.6rem', height: 24 }}
                            />
                        )}
                    </Stack>
                </Box>

                <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    {/* Status & Category */}
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1.5 }}>
                        <Typography
                            variant="caption"
                            fontWeight={800}
                            color="primary.main"
                            sx={{ textTransform: 'uppercase', letterSpacing: 1.2 }}
                        >
                            {course.category}
                        </Typography>

                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <FiberManualRecord sx={{ fontSize: 10, color: getStatusColor() }} />
                            <Typography variant="caption" fontWeight={800} color="text.secondary">
                                {course.status}
                            </Typography>
                        </Stack>
                    </Stack>

                    {/* Title */}
                    <Typography
                        variant="h6"
                        fontWeight={900}
                        sx={{
                            lineHeight: 1.3,
                            fontSize: '1.15rem',
                            color: 'text.primary',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '2.6em',
                            mb: 1
                        }}
                    >
                        {course.title}
                    </Typography>

                    {/* Description */}
                    <Typography
                        variant="body2"
                        sx={{
                            color: "text.secondary",
                            mb: 2,
                            height: '4.5em',
                            overflowY: 'hidden',
                            lineHeight: 1.6,
                            fontWeight: 500,
                            '&:hover': {
                                overflowY: 'auto',
                                '&::-webkit-scrollbar': { width: '4px' },
                                '&::-webkit-scrollbar-thumb': { 
                                    bgcolor: 'divider', 
                                    borderRadius: '10px' 
                                }
                            },
                            wordBreak: 'break-word'
                        }}
                    >
                        {course.description}
                    </Typography>

                    {/* Stats Row */}
                    <Stack direction="row" spacing={2.5} sx={{ mb: 2 }}>
                        <StatItem icon={<Timer sx={{ fontSize: 16 }} />} label={`${course.totalHours}h`} />
                        <StatItem icon={<MenuBook sx={{ fontSize: 16 }} />} label={`${course.topics?.length || 0} Topics`} />
                        <StatItem icon={<Group sx={{ fontSize: 16 }} />} label={course.enrolledCount} />
                    </Stack>

                    <Divider sx={{ my: 1.5, borderStyle: 'dashed', borderColor: 'divider' }} />

                    {/* Bottom Action Area */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
                        <Stack>
                            <MuiRating value={course.rating} readOnly precision={0.5} size="small" />
                            <Typography variant="caption" fontWeight={700} color="text.disabled" sx={{ mt: 0.5 }}>
                                {course.rating} Avg Rating
                            </Typography>
                        </Stack>

                        <Button
                            variant="contained"
                            color="secondary" // Switched to secondary for variety
                            onClick={() => setIsModalOpen(true)}
                            disableElevation
                            sx={{
                                borderRadius: 2.5,
                                px: 2.5,
                                py: 1,
                                fontWeight: 800,
                                textTransform: 'none',
                                '&:hover': {
                                    bgcolor: 'secondary.dark',
                                }
                            }}
                        >
                            Details
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {isModalOpen && (
                <CourseDetailModal
                    course={course}
                    open={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onRefresh={onRefresh}
                />
            )}
        </>
    );
};

// Internal Helper for consistent stats
const StatItem = ({ icon, label }: { icon: React.ReactNode, label: string | number }) => (
    <Stack direction="row" spacing={0.5} alignItems="center">
        <Box sx={{ color: 'text.disabled', display: 'flex' }}>{icon}</Box>
        <Typography variant="caption" fontWeight={800} color="text.primary">{label}</Typography>
    </Stack>
);

export default CourseCard;