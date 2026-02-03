import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper,
    Stack, Button, Chip, Card, CircularProgress
} from '@mui/material';
import {
    Leaderboard, MenuBook,
    ArrowForward, Timer
} from '@mui/icons-material';
import { motion } from 'framer-motion';

import PageLayout from '../../components/layout/PageLayout';
import HeroCarousel from './HeroCausual';
import CourseDetailModal from '../../components/course/CourseDetailModal';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

// API & Types
import { getCourses } from '../../api/course.api';
import type { Course } from '../../types/course';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
    const [mandatoryCourses, setMandatoryCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMandatoryCourses = async () => {
            try {
                const allCourses = await getCourses();

                // Show ALL mandatory courses in their original order
                const filtered = allCourses.filter(course => course.isMandatory === true);

                setMandatoryCourses(filtered);
            } catch (error) {
                console.error("Error loading courses:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMandatoryCourses();
    }, []);

    return (
        <PageLayout>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 65px)', bgcolor: 'background.default' }}>
                <Box sx={{ p: 4, maxWidth: 1300, mx: 'auto', width: '100%' }}>

                    <HeroCarousel />

                    <Box sx={{ display: 'flex', gap: 4, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>

                        {/* Main Column: Mandatory Programs */}
                        <Box sx={{ flex: 2.5 }}>
                            <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>
                                Mandatory Training
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                endIcon={<OpenInNewIcon />}
                                onClick={() => navigate("/courses")}
                                sx={{
                                    borderRadius: 2,
                                    px: 4,
                                    py: 1,
                                    fontWeight: 800,
                                    textTransform: 'none',
                                }}
                            >
                                View all Courses
                            </Button>

                            {loading ? (
                                <Stack alignItems="center" sx={{ py: 10 }}><CircularProgress /></Stack>
                            ) : (
                                <Stack spacing={2.5}>
                                    {mandatoryCourses.length > 0 ? (
                                        mandatoryCourses.map((course) => {
                                            const imageUrl = course.thumbnail.startsWith('http')
                                                ? course.thumbnail
                                                : `${import.meta.env.VITE_API_URL}${course.thumbnail}`;

                                            return (
                                                <Card
                                                    key={course.id}
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
                                                                onError={(e: any) => { e.target.src = 'https://placehold.co/400x250?text=No+Thumbnail'; }}
                                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                            />
                                                        </Box>

                                                        <Box sx={{ flex: 1 }}>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                                <Typography variant="subtitle1" fontWeight={800}>
                                                                    {course.title}
                                                                </Typography>
                                                                <Chip label="Required" size="small" color="error" variant="outlined" sx={{ fontWeight: 800, fontSize: '0.6rem' }} />
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
                                                                onClick={() => setSelectedCourse(course)}
                                                                sx={{ mt: 1, fontWeight: 700, textTransform: 'none' }}
                                                            >
                                                                View Program
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Card>
                                            );
                                        })
                                    ) : (
                                        <Typography color="text.secondary">No mandatory courses available.</Typography>
                                    )}
                                </Stack>
                            )}
                        </Box>

                        {/* Sidebar Column */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Quick Access</Typography>
                            <Stack spacing={3}>
                                <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                        <Leaderboard sx={{ color: '#fbbf24' }} />
                                        <Typography variant="subtitle1" fontWeight={700}>Department Ranking</Typography>
                                    </Stack>
                                    <Stack spacing={1.5}>
                                        <RankingItem name="Engineering" score="4,200 pts" pos={1} />
                                        <RankingItem name="Sales Dept" score="3,850 pts" pos={2} />
                                        <RankingItem name="HR Team" score="2,100 pts" pos={3} />
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {selectedCourse && (
                <CourseDetailModal
                    course={selectedCourse}
                    open={Boolean(selectedCourse)}
                    onClose={() => setSelectedCourse(null)}
                />
            )}
        </PageLayout>
    );
};

const RankingItem = ({ name, score, pos }: { name: string, score: string, pos: number }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="body2" fontWeight={800} color={pos === 1 ? '#fbbf24' : pos === 2 ? 'text.primary' : 'text.secondary'}>{pos}.</Typography>
            <Typography variant="body2">{name}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>{score}</Typography>
    </Stack>
);

export default Home;