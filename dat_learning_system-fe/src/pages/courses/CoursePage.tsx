import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Stack, TextField, InputAdornment, 
    Tab, Tabs, Button, useTheme, CircularProgress 
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import type { Course } from '../../types/course';

// Using your service pattern
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

    // Load courses from Postgres on mount
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

    // Combined filter for Category and Search Bar
    const filteredCourses = courses.filter(c => {
        const matchesCategory = filter === 'All' || c.category === filter;
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const handleCreateNewCourse = async (newCourseData: any) => {
        try {
            // This calls the service which handles the FormData/Multipart conversion
            const createdCourse = await createCourse(newCourseData);
            
            // Update local state with the new course from the DB
            setCourses(prev => [createdCourse, ...prev]);
            setIsCreating(false);
        } catch (error) {
            console.error("Error creating course:", error);
            alert("Failed to create course. Check server logs.");
        }
    };

    return (
        <PageLayout>
            <Box sx={{ p: { xs: 2, md: 6 }, bgcolor: 'background.default', minHeight: '100vh' }}>
                
                {/* Header Section */}
                <Stack 
                    direction={{ xs: 'column', sm: 'row' }} 
                    justifyContent="space-between" 
                    alignItems={{ sm: 'flex-end' }} 
                    spacing={2} 
                    sx={{ mb: 4 }}
                >
                    <Stack spacing={1}>
                        <Typography variant="h3" fontWeight={900} letterSpacing="-1px">
                            Programs & Courses
                        </Typography>
                        <Typography color="text.secondary">
                            Manage your corporate learning catalog live from the database.
                        </Typography>
                    </Stack>

                    {!isCreating && (
                        <Button 
                            variant="contained" 
                            startIcon={<Add />} 
                            onClick={() => setIsCreating(true)}
                            sx={{ 
                                borderRadius: 4, px: 3, py: 1.5, fontWeight: 800, 
                                textTransform: 'none', boxShadow: theme.shadows[4] 
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
                            '& .MuiTabs-indicator': { height: 3, borderRadius: 3 },
                            '& .MuiTab-root': { fontWeight: 800, textTransform: 'none', minWidth: 100 }
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
                                borderRadius: 4, bgcolor: 'background.paper', 
                                width: { xs: '100%', md: 320 }, 
                                boxShadow: '0 2px 10px rgba(0,0,0,0.03)' 
                            }
                        }}
                    />
                </Box>

                {/* Course Grid Area */}
                {loading ? (
                    <Stack alignItems="center" justifyContent="center" sx={{ minHeight: '30vh' }}>
                        <CircularProgress thickness={5} size={50} />
                        <Typography sx={{ mt: 2, fontWeight: 600, color: 'text.secondary' }}>
                            Loading Classroom...
                        </Typography>
                    </Stack>
                ) : (
                    <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 4, 
                        justifyContent: { xs: 'center', md: 'flex-start' } 
                    }}>
                        <AnimatePresence mode="popLayout">
                            
                            {/* Inline Creator Card */}
                            {isCreating && (
                                <CreateCourseCard 
                                    key="creator" 
                                    onSave={handleCreateNewCourse} 
                                    onCancel={() => setIsCreating(false)} 
                                />
                            )}

                            {/* List of Real Courses */}
                            {filteredCourses.map((course) => (
                                <Box 
                                    key={course.id} 
                                    component={motion.div} 
                                    layout 
                                    initial={{ opacity: 0, scale: 0.9 }} 
                                    animate={{ opacity: 1, scale: 1 }} 
                                    exit={{ opacity: 0, scale: 0.9 }} 
                                    sx={{ 
                                        width: { xs: '100%', sm: 340 }, 
                                        flexGrow: { xs: 1, sm: 0 } 
                                    }}
                                >
                                    <CourseCard course={course} />
                                </Box>
                            ))}
                        </AnimatePresence>

                        {!loading && filteredCourses.length === 0 && !isCreating && (
                            <Typography variant="h6" color="text.secondary" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
                                No courses found in this category.
                            </Typography>
                        )}
                    </Box>
                )}
            </Box>
        </PageLayout>
    );
};

export default CoursesPage;