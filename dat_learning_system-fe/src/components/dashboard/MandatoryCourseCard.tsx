import React from 'react';
import { Box, Typography, Stack, Button, Chip, Card } from '@mui/material';
import { MenuBook, ArrowForward, Timer } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { Course } from '../../types/course';

interface Props {
    course: Course;
    onView: (course: Course) => void;
}

const MandatoryCourseCard: React.FC<Props> = ({ course, onView }) => {
    const imageUrl = course.thumbnail.startsWith('http')
        ? course.thumbnail
        : `${import.meta.env.VITE_API_URL}${course.thumbnail}`;

    return (
        <Card
            component={motion.div}
            whileHover={{ x: 10 }}
            sx={{
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                boxShadow: 'none',
                overflow: 'hidden'
            }}
        >
            <Box sx={{ display: 'flex', p: 1.5 }}>
                <Box sx={{ width: 140, height: 100, borderRadius: 3, overflow: 'hidden', mr: 3, flexShrink: 0 }}>
                    <img
                        src={imageUrl}
                        alt={course.title}
                        onError={(e: any) => { e.target.src = '/No_Thumbnail.svg'; }}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor:'lightgray' }}
                    />
                </Box>

                <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Typography variant="subtitle1" fontWeight={800}>
                            {course.title}
                        </Typography>
                        <Chip label="Mandatory" size="small" color="error" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.6rem' }} />
                    </Stack>

                    <Stack direction="row" spacing={3} sx={{ mt: 1, color: 'text.secondary' }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Timer sx={{ fontSize: 16 }} />
                            <Typography variant="caption" fontWeight={700}>{course.totalHours}h</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <MenuBook sx={{ fontSize: 16 }} />
                            <Typography variant="caption" fontWeight={700}>{course.topics?.length || 0} Topics</Typography>
                        </Stack>
                    </Stack>

                    <Button
                        size="small"
                        endIcon={<ArrowForward />}
                        onClick={() => onView(course)}
                        sx={{ mt: 1, fontWeight: 700, textTransform: 'none' }}
                    >
                        View Program
                    </Button>
                </Box>
            </Box>
        </Card>
    );
};

export default MandatoryCourseCard;