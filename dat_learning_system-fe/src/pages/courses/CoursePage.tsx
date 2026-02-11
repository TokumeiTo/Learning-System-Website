import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Stack,
    Button, useTheme, CircularProgress,
    Chip,
    Paper,
    InputBase
} from '@mui/material';
import { Search, Add, Terminal, Translate, Language, Dashboard, AutoAwesome } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import type { Course } from '../../types/course';

// Service layer
import { getCourses, createCourse } from '../../api/course.api';

import CreateCourseCard from '../../components/course/CreateCourseCard';
import CourseCard from '../../components/course/CourseCard';
import { useAuth } from '../../hooks/useAuth';

const CoursesPage: React.FC = () => {
    const theme = useTheme();
    const [filter, setFilter] = useState('All');
    const [isCreating, setIsCreating] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useAuth();
    // Check against DB IDs for maximum accuracy
    const canManageCourses = user?.position === "Admin" || user?.position === "SuperAdmin";

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await getCourses();
            setCourses(data);
        } catch (error) {
            console.error("Failed to fetch courses:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const categories = ['All', 'Japanese', 'IT', 'English', 'Custom'];

    const filteredCourses = courses.filter(c => {
        const matchesCategory = filter === 'All' || c.category === filter;
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCreateNewCourse = async (newCourseFormData: FormData) => {
        try {
            const createdCourse = await createCourse(newCourseFormData);
            setCourses(prev => [createdCourse, ...prev]);
            setIsCreating(false);
        } catch (error: any) {
            if (error.response?.status === 415) {
                alert("Server rejected the media type (415). Ensure the backend [FromForm] matches the request.");
            } else {
                alert("Failed to create course. Please check the console.");
            }
        }
    };

    return (
        <PageLayout>
            <Box sx={{
                p: { xs: 2, md: 6 },
                minHeight: '100vh',
            }}>

                {/* Header Section */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ sm: 'flex-end' }}
                    spacing={2}
                    sx={{ mb: 4 }}
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
                    spacing={3}
                    justifyContent="space-between"
                    alignItems={{ xs: 'start', lg: 'center' }}
                    sx={{ mb: 6 }}
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
                            border: `1px solid ${theme.palette.divider}`,
                            width: { xs: '100%', lg: 350 },
                            transition: '0.2s',
                            '&:focus-within': {
                                borderColor: 'primary.main',
                                boxShadow: '0 0 0 3px rgba(25, 118, 210, 0.1)'
                            }
                        }}
                    >
                        <Search sx={{ color: 'text.disabled', fontSize: 20 }} />
                        <InputBase
                            sx={{ ml: 1, flex: 1, fontSize: 14, fontWeight: 500 }}
                            placeholder="Search courses..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
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
                        gap: 4
                    }}>
                        <AnimatePresence mode="popLayout">
                            {isCreating && (
                                <Box
                                    key="creator"
                                    component={motion.div}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
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
                                    <CourseCard course={course} />
                                </Box>
                            ))}
                        </AnimatePresence>

                        {filteredCourses.length === 0 && !isCreating && (
                            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 10 }}>
                                <Typography variant="h6" color="text.disabled" fontWeight={700}>
                                    No courses found matching "{searchTerm}"
                                </Typography>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default CoursesPage;