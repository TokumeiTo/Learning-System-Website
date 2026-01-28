import React from 'react';
import { 
    Box, Typography, Stack, Card, CardContent, CardMedia, 
    Chip, Button, Rating as MuiRating 
} from '@mui/material';
import { Timer, Group, WorkspacePremium } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import type { Course } from '../../types/course';

interface CourseCardProps {
    course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
    const navigate = useNavigate();

    return (
        <Card sx={{
            borderRadius: 6,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            border: '1px solid #f0f0f0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': { 
                transform: 'translateY(-8px)', 
                boxShadow: '0 12px 30px rgba(0,0,0,0.08)',
                '& .course-media': { transform: 'scale(1.05)' }
            }
        }}>
            {/* Image Section */}
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                    className="course-media"
                    component="img"
                    height="200"
                    image={course.thumbnail || `https://picsum.photos/seed/${course.id}/400/250`}
                    alt={course.title}
                    sx={{ transition: 'transform 0.5s ease' }}
                />
                
                {/* Level Badge (Overlay) */}
                <Chip
                    label={course.badge}
                    size="small"
                    sx={{
                        position: 'absolute', top: 16, left: 16,
                        bgcolor: 'rgba(255,255,255,0.9)', 
                        fontWeight: 800, 
                        backdropFilter: 'blur(4px)',
                        fontSize: '0.7rem'
                    }}
                />

                {/* Mandatory Tag */}
                {course.isMandatory && (
                    <Chip
                        label="MANDATORY"
                        color="error"
                        size="small"
                        sx={{
                            position: 'absolute', top: 16, right: 16,
                            fontWeight: 900, fontSize: '0.65rem',
                            boxShadow: 2
                        }}
                    />
                )}
            </Box>

            <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Category & Rating Row */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                    <Typography 
                        variant="caption" 
                        fontWeight={900} 
                        color="primary" 
                        sx={{ textTransform: 'uppercase', letterSpacing: 1.2 }}
                    >
                        {course.category}
                    </Typography>
                    
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <MuiRating value={course.rating} readOnly precision={0.5} size="small" sx={{ fontSize: '1rem' }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                            ({course.rating})
                        </Typography>
                    </Stack>
                </Stack>

                {/* Title */}
                <Typography 
                    variant="h6" 
                    fontWeight={800} 
                    sx={{ 
                        mb: 2, 
                        lineHeight: 1.3, 
                        minHeight: 52, // Keeps cards aligned even with 1-line vs 2-line titles
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOverflow: 'ellipsis',
                        overflow: 'hidden'
                    }}
                >
                    {course.title}
                </Typography>

                {/* Meta Info Row */}
                <Stack direction="row" spacing={2.5} sx={{ mb: 3, mt: 'auto' }}>
                    <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                        <Timer sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={600}>{course.totalHours}h</Typography>
                    </Stack>
                    
                    <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                        <Group sx={{ fontSize: 16 }} />
                        <Typography variant="caption" fontWeight={600}>{course.enrolledCount}</Typography>
                    </Stack>

                    {course.certificationImage && (
                        <Stack direction="row" spacing={0.5} alignItems="center" color="success.main">
                            <WorkspacePremium sx={{ fontSize: 16 }} />
                            <Typography variant="caption" fontWeight={700}>Cert</Typography>
                        </Stack>
                    )}
                </Stack>

                {/* Primary Action */}
                <Button
                    variant="contained"
                    onClick={() => navigate(`/classroom/${course.id}`)}
                    fullWidth
                    disableElevation
                    sx={{
                        borderRadius: 3,
                        py: 1.2,
                        fontWeight: 800,
                        textTransform: 'none',
                        bgcolor: '#1e293b', // Deep Slate
                        '&:hover': { bgcolor: '#334155' }
                    }}
                >
                    View Classroom
                </Button>
            </CardContent>
        </Card>
    );
};

export default CourseCard;