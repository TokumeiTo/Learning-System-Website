import React, { useState } from 'react';
import {
    Box, Typography, Stack, TextField, InputAdornment, 
    Tab, Tabs, Button, useTheme
} from '@mui/material';
import { Search, Add } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import type { Course } from '../../types/course';
import CreateCourseCard from '../../components/course/CreateCourseCard';
import CourseCard from '../../components/course/CourseCard';

const CoursesPage: React.FC = () => {
    const theme = useTheme();
    const [filter, setFilter] = useState('All');
    const [isCreating, setIsCreating] = useState(false);
    
    // Using your provided Course Interface structure
    const [courses, setCourses] = useState<Course[]>([
        { 
            id: '1', 
            title: 'JLPT N5: Beginner Foundation', 
            category: 'Japanese', 
            badge: 'Beginner', 
            totalHours: 24, 
            isMandatory: true,
            thumbnail: 'https://picsum.photos/seed/1/400/250',
            description: 'Master Hiragana and basic grammar.',
            certificationImage: '',
            rating: 4.9,
            enrolledCount: 120,
            status: 'Published'
        },
        { 
            id: '2', 
            title: 'React & TypeScript for Enterprise', 
            category: 'IT', 
            badge: 'Advanced', 
            totalHours: 40, 
            isMandatory: false,
            thumbnail: 'https://picsum.photos/seed/2/400/250',
            description: 'Build scalable apps with TS.',
            certificationImage: '',
            rating: 4.8,
            enrolledCount: 85,
            status: 'Published'
        }
    ]);

    const categories = ['All', 'Japanese', 'IT', 'English', 'Custom'];

    const filteredCourses = courses.filter(c => filter === 'All' || c.category === filter);

    const handleCreateNewCourse = (newCourseData: Partial<Course>) => {
        const fullCourse: Course = {
            ...newCourseData,
            id: Date.now().toString(),
            rating: 0,
            enrolledCount: 0,
            status: 'Published',
            thumbnail: `https://picsum.photos/seed/${Date.now()}/400/250`,
        } as Course;

        setCourses([fullCourse, ...courses]);
        setIsCreating(false);
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
                            Curate and manage your corporate learning catalog.
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

                {/* Main Flex Grid */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                    <AnimatePresence mode="popLayout">
                        
                        {/* 1. The Inline Creator Card */}
                        {isCreating && (
                            <CreateCourseCard 
                                key="creator"
                                onSave={handleCreateNewCourse}
                                onCancel={() => setIsCreating(false)}
                            />
                        )}

                        {/* 2. Existing Courses */}
                        {filteredCourses.map((course) => (
                            <Box
                                key={course.id}
                                component={motion.div}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                sx={{ width: { xs: '100%', sm: 340 }, flexGrow: { xs: 1, sm: 0 } }}
                            >
                                <CourseCard course={course} />
                            </Box>
                        ))}
                    </AnimatePresence>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default CoursesPage;