import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Button, CircularProgress } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';

// Components
import PageLayout from '../../components/layout/PageLayout';
import HeroCarousel from '../../components/dashboard/HeroCausual';
import CourseDetailModal from '../../components/course/CourseDetailModal';
import MandatoryCourseCard from '../../components/dashboard/MandatoryCourseCard';
import RankingSidebar from '../../components/dashboard/RankingSidebar';

// API & Types
import { getCourses } from '../../api/course.api';
import type { Course } from '../../types/course';

const Home: React.FC = () => {
    const [mandatoryCourses, setMandatoryCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMandatoryCourses = async () => {
            try {
                const allCourses = await getCourses();
                setMandatoryCourses(allCourses.filter(course => course.isMandatory));
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
            <Box sx={{ p: 4, maxWidth: 1300, mx: 'auto', width: '100%' }}>
                <HeroCarousel />

                <Box sx={{ display: 'flex', gap: 4, mt: 4, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>
                    {/* Main Column */}
                    <Box sx={{ flex: 2.5 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                            <Typography variant="h5" fontWeight={800}>Mandatory Training</Typography>
                            <Button
                                variant="contained"
                                endIcon={<OpenInNewIcon />}
                                onClick={() => navigate("/courses")}
                                sx={{ borderRadius: 2, px: 3, fontWeight: 800, textTransform: 'none' }}
                            >
                                View all
                            </Button>
                        </Stack>

                        {loading ? (
                            <Stack alignItems="center" sx={{ py: 10 }}><CircularProgress /></Stack>
                        ) : (
                            <Stack spacing={2.5}>
                                {mandatoryCourses.map(course => (
                                    <MandatoryCourseCard
                                        key={course.id}
                                        course={course}
                                        onView={setSelectedCourse}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>

                    {/* Sidebar Column */}
                    <RankingSidebar />
                </Box>
            </Box>

            {/* Replace the old Modal call with this short-circuit */}
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

export default Home;