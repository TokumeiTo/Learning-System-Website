import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Stack, TextField, InputAdornment,
    Tab, Tabs, Button, useTheme, CircularProgress
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import type { Course } from '../../types/course';

// Service layer
import { getCourses, createCourse } from '../../api/course.api';

import CreateCourseCard from '../../components/course/CreateCourseCard';
import CourseCard from '../../components/course/CourseCard';

const CoursesPage: React.FC = () => {
    const theme = useTheme();
    const [filter, setFilter] = useState('All');
    const [isCreating, setIsCreating] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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
                bgcolor: 'background.default', 
                minHeight: '100vh',
                transition: 'background-color 0.3s'
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

                    {!isCreating && (
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

                {/* Filter & Search Bar */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { md: 'center' },
                    gap: 3,
                    mb: 6
                }}>
                    <Tabs
                        value={filter}
                        onChange={(_, val) => setFilter(val)}
                        sx={{
                            '& .MuiTabs-indicator': { height: 4, borderRadius: '4px 4px 0 0' },
                            '& .MuiTab-root': { 
                                fontWeight: 800, 
                                textTransform: 'none', 
                                minWidth: 80,
                                fontSize: '1rem',
                                color: 'text.secondary'
                            },
                            '& .Mui-selected': { color: 'primary.main' }
                        }}
                    >
                        {categories.map(cat => <Tab key={cat} label={cat} value={cat} />)}
                    </Tabs>

                    <TextField
                        placeholder="Search courses..."
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: 'primary.main' }} />
                                </InputAdornment>
                            ),
                            sx: {
                                borderRadius: 3, 
                                bgcolor: 'background.paper',
                                width: { xs: '100%', md: 350 },
                                border: `1px solid ${theme.palette.divider}`,
                                '& fieldset': { border: 'none' },
                                transition: '0.2s',
                                '&:hover': { boxShadow: theme.shadows[2] }
                            }
                        }}
                    />
                </Box>

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