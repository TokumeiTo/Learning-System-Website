import React from 'react';
import {
    Box, Typography, Stack, Card, CardContent, CardMedia,
    Chip, Button, Rating as MuiRating, Divider
} from '@mui/material';
import { Timer, Group, MenuBook, FiberManualRecord } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types/course';

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const navigate = useNavigate();

    // Color logic for status
    const statusColor = course.status === 'Published' ? '#10b981' : '#f59e0b';

    return (
        <Card sx={{
            borderRadius: 5,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflow: 'hidden',
            '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            }
        }}>
            {/* Image Section */}
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="180"
                    image={course.thumbnail.startsWith('http') ? course.thumbnail : `${import.meta.env.VITE_API_URL}${course.thumbnail}`}
                    alt={course.title}
                    onError={(e: any) => {
                        // Fallback to a generic image if the specific thumbnail is missing
                        e.target.src = 'https://placehold.co/400x250?text=No+Thumbnail';
                    }}
                    sx={{
                        filter: course.status === 'Draft' ? 'grayscale(0.5)' : 'none',
                        objectFit: 'cover' // Ensures the image fills the 180px height nicely
                    }}
                />

                {/* Status Overlay */}
                <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 12, left: 12 }}>
                    <Chip
                        label={course.badge}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(255,255,255,0.95)',
                            fontWeight: 800,
                            backdropFilter: 'blur(4px)',
                            fontSize: '0.65rem',
                            color: 'primary.main',
                            border: '1px solid'
                        }}
                    />
                    {course.isMandatory && (
                        <Chip
                            label="MANDATORY"
                            color="error"
                            size="small"
                            sx={{ fontWeight: 900, fontSize: '0.6rem' }}
                        />
                    )}
                </Stack>
            </Box>

            <CardContent sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Status & Category */}
                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography
                        variant="caption"
                        fontWeight={800}
                        color="primary"
                        sx={{ textTransform: 'uppercase', letterSpacing: 1 }}
                    >
                        {course.category}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <FiberManualRecord sx={{ fontSize: 10, color: statusColor }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                            {course.status}
                        </Typography>
                    </Stack>
                </Stack>

                {/* Title */}
                <Typography
                    variant="h6"
                    fontWeight={800}
                    sx={{
                        lineHeight: 1.2,
                        fontSize: '1.1rem',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '2.4em' // Fixed height for alignment
                    }}
                >
                    {course.title}
                </Typography>

                {/* Description - Professional truncated look */}
                <Typography
                    variant="body2"
                    sx={{
                        textIndent: 10,
                        cursor: 'default',
                        color: "text.secondary",
                        mb: '7px',
                        height: '4.5em',
                        overflowY: 'hidden',
                        '&:hover': {
                            overflowY: 'auto', // Shows scrollbar only on hover
                            '&::-webkit-scrollbar': { width: '4px' },
                            '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '10px' }
                        },
                        // Ensures the "aaaaaaaaa" strings don't break the card
                        wordBreak: 'break-word'
                    }}
                >
                    {course.description}
                </Typography>

                {/* Stats Row */}
                <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Timer sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="caption" fontWeight={700}>{course.totalHours}h</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <MenuBook sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="caption" fontWeight={700}>{course.topics?.length || 0} Topics</Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <Group sx={{ fontSize: 16, color: 'text.disabled' }} />
                        <Typography variant="caption" fontWeight={700}>{course.enrolledCount}</Typography>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />

                {/* Bottom Action Area */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
                    <Stack>
                        <MuiRating value={course.rating} readOnly precision={0.5} size="small" />
                        <Typography variant="caption" fontWeight={600} color="text.disabled">
                            Average Rating ({course.rating})
                        </Typography>
                    </Stack>

                    <Button
                        variant="contained"
                        onClick={() => navigate(`/classroom/${course.id}`)}
                        disableElevation
                        sx={{
                            borderRadius: 2,
                            px: 2,
                            py: 1,
                            fontWeight: 800,
                            textTransform: 'none',
                            bgcolor: '#1e293b',
                            '&:hover': { bgcolor: '#0f172a' }
                        }}
                    >
                        Enter
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default CourseCard;