import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box, Typography, Stack,
    Button, useTheme, CircularProgress,
    Chip,
    Paper,
    InputBase,
    IconButton
} from '@mui/material';
import { Search, Add, Terminal, Translate, Language, Dashboard, AutoAwesome, Close } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import type { Course } from '../../types_interfaces/course';

// Service layer
import { getCourses, createCourse } from '../../api/course.api';

import CreateCourseCard from '../../components/course/CreateCourseCard';
import CourseCard from '../../components/course/CourseCard';
import MessagePopup from '../../components/feedback/MessagePopup';
import { useAuth } from '../../hooks/useAuth';

const CoursesPage: React.FC = () => {
    const theme = useTheme();
    const [filter, setFilter] = useState('All');
    const [isCreating, setIsCreating] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [errorPopup, setErrorPopup] = useState({ open: false, message: '' });
    const location = useLocation();
    const { isAdmin } = useAuth();
    const { user } = useAuth();
    // Check against DB IDs for maximum accuracy
    const canManageCourses = user?.position === "Admin" || user?.position === "SuperAdmin";

    const fetchCourses = async () => {
        try {
            setLoading(true);
            // data comes in as CourseDetail[] or similar
            const data = await getCourses();

            // Sanitize the data to ensure it matches the 'Course' interface exactly
            const sanitizedData: Course[] = data.map((item: any) => ({
                ...item,
                // Ensure mandatory fields for the Course interface are present
                badge: item.badge || 'General',
                isMandatory: item.isMandatory ?? false,
                totalHours: item.totalHours ?? 0,
                rating: item.rating ?? 0,
                enrolledCount: item.enrolledCount ?? 0,
            }));

            setCourses(sanitizedData);
        } catch (error) {
            setErrorPopup({ open: true, message: "Failed to fetch courses!!" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchFromUrl = params.get('search');

        if (searchFromUrl) {
            setSearchTerm(searchFromUrl);
            setFilter('All');
        }
    }, [location.search]);

    const categories = ['All', 'Japanese', 'IT', 'English', 'Custom'];

    const filteredCourses = courses.filter(c => {
        // 1. Basic Filters
        const matchesCategory = filter === 'All' || c.category === filter;
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());

        // 2. Draft Logic
        // If it's a draft AND user is NOT admin, hide it.
        if (c.status === 'Draft' && !isAdmin) return false;
        if (c.status === 'Closed' && !isAdmin) return false;

        return matchesCategory && matchesSearch;
    });
    const handleCreateNewCourse = async (newCourseFormData: FormData) => {
        try {
            const createdCourse = await createCourse(newCourseFormData);

            // Merge the new course with default "Heavy" properties to satisfy the Course interface
            const fullNewCourse: Course = {
                ...createdCourse,
                isMandatory: createdCourse.isMandatory ?? false,
                totalHours: createdCourse.totalHours ?? 0,
                rating: createdCourse.rating ?? 0,
                enrolledCount: createdCourse.enrolledCount ?? 0,
                // Ensure topics and lessons are arrays to avoid .length errors in the card
                classworkTopics: createdCourse.classworkTopics || [],
                lessons: createdCourse.lessons || []
            };

            setCourses(prev => [fullNewCourse, ...prev]);
            setIsCreating(false);
        } catch (error: any) {
            if (error.response?.status === 415) {
                alert("Server rejected the media type (415). Ensure the backend [FromForm] matches the request.");
            } else {
                alert("Failed to create course. Please check the console.");
                console.error("Course Creation Error:", error);
            }
        }
    };

    return (
        <PageLayout>
            {/* Header Section */}
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ sm: 'flex-end' }}
                spacing={2}
                sx={{ mb: 4, p: 3 }}
            >
                <Stack spacing={1}>
                    <Typography variant="h3" fontWeight={900} sx={{ letterSpacing: '-1.5px', color: 'text.primary' }}>
                        Programs & Courses
                    </Typography>
                    <Typography color="text.secondary" fontWeight={500}>
                        Manage your corporate learning catalog live from the database.
                    </Typography>
                </Stack>

                {canManageCourses && !isCreating && (
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setIsCreating(true)}
                        sx={{
                            borderRadius: 3,
                            px: 4,
                            py: 1.5,
                            fontWeight: 800,
                            textTransform: 'none',
                            boxShadow: theme.palette.mode === 'dark' ? theme.shadows[8] : theme.shadows[4]
                        }}
                    >
                        Create New Course
                    </Button>
                )}
            </Stack>

            {/* Filter & Search Bar Area */}
            <Stack
                direction={{ xs: 'column', lg: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'start', lg: 'center' }}
                sx={{ mb: 6, position: 'sticky', top: '75px', zIndex: '300', p: 3 }}
            >
                {/* Category Pills (Replaces Tabs) */}
                <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                        overflowX: 'auto',
                        width: '100%',
                        pb: { xs: 1, lg: 0 },
                        '&::-webkit-scrollbar': { display: 'none' } // Hides scrollbar for a cleaner look
                    }}
                >
                    {categories.map((cat) => (
                        <Chip
                            key={cat}
                            label={cat}
                            onClick={() => setFilter(cat)}
                            color={filter === cat ? "primary" : "default"}
                            variant={filter === cat ? "filled" : "outlined"}
                            icon={
                                cat === 'IT' ? <Terminal fontSize="small" /> :
                                    cat === 'Japanese' ? <Translate fontSize="small" /> :
                                        cat === 'English' ? <Language fontSize="small" /> :
                                            cat === 'Custom' ? <AutoAwesome fontSize="small" /> :
                                                cat === 'All' ? <Dashboard fontSize="small" /> : undefined
                            }
                            sx={{
                                px: 2,
                                py: 2.5,
                                borderRadius: 3,
                                fontWeight: 700,
                                transition: '0.3s',
                                border: filter === cat ? 'none' : '1px solid #e2e8f0',
                                '&:hover': {
                                    bgcolor: filter === cat ? 'primary.main' : 'rgba(0,0,0,0.04)'
                                }
                            }}
                        />
                    ))}
                </Stack>

                {/* Search Bar (Replaces TextField) */}
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        px: 2,
                        py: 0.8,
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        border: searchTerm ? '1px solid #1976d2' : `1px solid ${theme.palette.divider}`, // Highlight if searching
                        width: { md: '100%', lg: 350 },
                        transition: '0.2s',
                        '&:focus-within': {
                            borderColor: 'primary.main',
                            boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                        }
                    }}
                >
                    <Search sx={{ color: searchTerm ? 'primary.main' : 'text.disabled', fontSize: 20 }} />
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontSize: 14, fontWeight: 500 }}
                        placeholder="Search courses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <IconButton
                            size="small"
                            onClick={() => {
                                setSearchTerm('');
                                window.history.replaceState({}, '', '/courses'); // Clean the URL
                            }}
                        >
                            <Close sx={{ fontSize: 18 }} />
                        </IconButton>
                    )}
                </Paper>
            </Stack>

            {/* Main Content Area */}
            {loading ? (
                <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '40vh' }}>
                    <CircularProgress thickness={5} size={60} sx={{ mb: 2 }} />
                    <Typography sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        Syncing with Database...
                    </Typography>
                </Stack>
            ) : (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        sm: 'repeat(auto-fill, minmax(340px, 1fr))'
                    },
                    gap: 7,
                    p: 3
                }}>
                    <AnimatePresence mode="popLayout">
                        {isCreating && (
                            <Box
                                key="creator"
                                component={motion.div}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                sx={{ display: 'flex', alignItems: 'center' }}
                            >
                                <CreateCourseCard
                                    onSave={handleCreateNewCourse}
                                    onCancel={() => setIsCreating(false)}
                                />
                            </Box>
                        )}

                        {filteredCourses.map((course) => (
                            <Box
                                key={course.id}
                                component={motion.div}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <CourseCard
                                    course={course}
                                    onRefresh={fetchCourses}
                                />
                            </Box>
                        ))}
                    </AnimatePresence>

                    {filteredCourses.length === 0 && !isCreating && (
                        <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 10 }}>
                            <Typography variant="h6" color="text.disabled" fontWeight={700}>
                                {searchTerm ? `No courses found matching ' ${searchTerm} '` : "No courses provided"}
                            </Typography>
                        </Box>
                    )}
                </Box>
            )}

            <MessagePopup
                open={errorPopup.open}
                message={errorPopup.message}
                severity="error"
                onClose={() => setErrorPopup({ ...errorPopup, open: false })}
            />
        </PageLayout>
    );
};

export default CoursesPage;