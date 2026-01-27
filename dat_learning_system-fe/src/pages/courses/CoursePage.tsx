import React, { useState } from 'react';
import {
    Box, Typography, Stack, Card, CardContent, CardMedia,
    Chip, Button, TextField, InputAdornment, Tab, Tabs
} from '@mui/material';
import { Search, Star, Timer, Group, School } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/layout/PageLayout';

const CoursesPage: React.FC = () => {
    const [filter, setFilter] = useState('All');
    const navigate = useNavigate();

    const categories = ['All', 'Japanese', 'IT', 'English'];

    // Mock data to demonstrate filtering
    const courses = [
        { id: 1, title: 'JLPT N5: Beginner Foundation', cat: 'Japanese', level: 'Beginner', time: '24h' },
        { id: 2, title: 'React & TypeScript for Enterprise', cat: 'IT', level: 'Advanced', time: '40h' },
        { id: 3, title: 'Business English: Pitching Ideas', cat: 'English', level: 'Intermediate', time: '12h' },
        { id: 4, title: 'Mastering Hiragana & Katakana', cat: 'Japanese', level: 'Beginner', time: '10h' },
        { id: 5, title: 'Cloud Architecture: AWS/Azure', cat: 'IT', level: 'Expert', time: '55h' },
        { id: 6, title: 'Technical Writing for Engineers', cat: 'English', level: 'Intermediate', time: '15h' },
    ];

    const filteredCourses = courses.filter(c => filter === 'All' || c.cat === filter);

    return (
        <PageLayout>
            <Box sx={{ p: { xs: 2, md: 6 }, bgcolor: 'background.default', minHeight: '100vh' }}>

                {/* Title & Stats Stack */}
                <Stack spacing={1} sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight={900} letterSpacing="-1px">
                        Programs & Courses
                    </Typography>
                    <Typography color="text.secondary">
                        Find your next milestone in our curated corporate catalog.
                    </Typography>
                </Stack>

                {/* Filter & Search Bar - Flex Container */}
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
                            startAdornment: <InputAdornment position="start"><Search sx={{ color: 'primary.main' }} /></InputAdornment>,
                            sx: { borderRadius: 4, bgcolor: 'background.paper', width: { xs: '100%', md: 320 }, boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }
                        }}
                    />
                </Box>

                {/* Course Cards Container - The Main Flex Layout */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 4,
                    justifyContent: { xs: 'center', md: 'flex-start' }
                }}>
                    <AnimatePresence mode="popLayout">
                        {filteredCourses.map((course) => (
                            <Box
                                key={course.id}
                                component={motion.div}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                sx={{
                                    width: { xs: '100%', sm: 340 }, // Fixed width on larger screens for consistency
                                    flexGrow: { xs: 1, sm: 0 }
                                }}
                            >
                                <Card sx={{
                                    borderRadius: 6,
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'all 0.3s ease',
                                    border: '1px solid #f0f0f0',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                                    '&:hover': { transform: 'y(-8px)', boxShadow: '0 12px 30px rgba(0,0,0,0.08)' }
                                }}>
                                    <Box sx={{ position: 'relative' }}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={`https://picsum.photos/seed/${course.id}/400/250`}
                                            alt="Course"
                                        />
                                        <Chip
                                            label={course.level}
                                            size="small"
                                            sx={{
                                                position: 'absolute', top: 16, left: 16,
                                                bgcolor: 'rgba(255,255,255,0.9)', fontWeight: 800, backdropFilter: 'blur(4px)'
                                            }}
                                        />
                                    </Box>

                                    <CardContent sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                            <Typography variant="caption" fontWeight={900} color="primary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>
                                                {course.cat}
                                            </Typography>
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Star sx={{ color: '#f59e0b', fontSize: 16 }} />
                                                <Typography variant="caption" fontWeight={700}>4.9</Typography>
                                            </Stack>
                                        </Stack>

                                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2, lineHeight: 1.3, minHeight: 52 }}>
                                            {course.title}
                                        </Typography>

                                        <Stack direction="row" spacing={3} sx={{ mb: 3, mt: 'auto' }}>
                                            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                                                <Timer sx={{ fontSize: 18 }} />
                                                <Typography variant="caption" fontWeight={600}>{course.time}</Typography>
                                            </Stack>
                                            <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                                                <School sx={{ fontSize: 18 }} />
                                                <Typography variant="caption" fontWeight={600}>Certificate</Typography>
                                            </Stack>
                                        </Stack>

                                        <Button
                                            variant="contained"
                                            onClick={() => navigate('/classroom')}
                                            fullWidth
                                            disableElevation
                                            sx={{
                                                borderRadius: 3,
                                                py: 1.5,
                                                fontWeight: 800,
                                                textTransform: 'none',
                                                bgcolor: '#background.button',
                                                '&:hover': { bgcolor: '#334155' }
                                            }}
                                        >
                                            View Classroom
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Box>
                        ))}
                    </AnimatePresence>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default CoursesPage;