import React from 'react';
import {
    Box, Typography, Paper,
    Stack, Button, Chip, Card
} from '@mui/material';
import {
    Translate, Assignment,
    Leaderboard, Star, MenuBook,
    ArrowForward
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';
import HeroCarousel from './HeroCausual';

// --- Mock Data for Company Courses ---
const COMPANY_COURSES = [
    {
        id: 1,
        title: 'Business Japanese: Keigo Basics',
        level: 'Intermediate',
        duration: '4 weeks',
        enrolled: 45,
        mandatory: true,
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400'
    },
    {
        id: 2,
        title: 'Japanese Corporate Etiquette',
        level: 'Beginner',
        duration: '2 weeks',
        enrolled: 120,
        mandatory: true,
        image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400'
    },
    {
        id: 3,
        title: 'JLPT N3 Vocabulary Booster',
        level: 'Advanced',
        duration: '8 weeks',
        enrolled: 32,
        mandatory: false,
        image: 'https://images.unsplash.com/photo-1526633063025-05d99c4bab9c?w=400'
    },
];

const Home: React.FC = () => {
    return (
        <PageLayout>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 65px)', bgcolor: 'background.default' }}>
                <Box sx={{ p: 4, maxWidth: 1300, mx: 'auto', width: '100%' }}>

                    {/* 2. Announcement / Mandatory Training Banner */}
                    <HeroCarousel />

                    {/* 3. Three-Column Layout using Flex */}
                    <Box sx={{ display: 'flex', gap: 4, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>

                        {/* Main Column: Available Courses */}
                        <Box sx={{ flex: 2.5 }}>
                            <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Available Programs</Typography>
                            <Stack spacing={2.5}>
                                {COMPANY_COURSES.map((course) => (
                                    <Card
                                        key={course.id}
                                        component={motion.div}
                                        whileHover={{ x: 10 }}
                                        sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}
                                    >
                                        <Box sx={{ display: 'flex', p: 1.5 }}>
                                            <Box sx={{ width: 140, height: 100, borderRadius: 3, overflow: 'hidden', mr: 3 }}>
                                                <img src={course.image} alt={course.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </Box>
                                            <Box sx={{ flex: 1 }}>
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Typography variant="subtitle1" fontWeight={800}>{course.title}</Typography>
                                                    {course.mandatory && <Chip label="Required" size="small" color="error" variant="outlined" />}
                                                </Stack>
                                                <Stack direction="row" spacing={3} sx={{ mt: 1, color: 'text.secondary' }}>
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        <Assignment sx={{ fontSize: 16 }} />
                                                        <Typography variant="caption">{course.level}</Typography>
                                                    </Stack>
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        <MenuBook sx={{ fontSize: 16 }} />
                                                        <Typography variant="caption">{course.duration}</Typography>
                                                    </Stack>
                                                </Stack>
                                                <Button size="small" endIcon={<ArrowForward />} sx={{ mt: 1, fontWeight: 700 }}>Enroll Now</Button>
                                            </Box>
                                        </Box>
                                    </Card>
                                ))}
                            </Stack>
                        </Box>

                        {/* Side Column: Tools & Stats */}
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h5" fontWeight={800} sx={{ mb: 3 }}>Quick Access</Typography>
                            <Stack spacing={3}>
                                {/* Leaderboard */}
                                <Paper sx={{ p: 3, borderRadius: 5, bgcolor: 'background.paper', color: 'white',border: '1px solid #e2e8f0' }}>
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

                                {/* Learning Resource Links */}
                                <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Learning Tools</Typography>
                                    <Stack spacing={1}>
                                        <Button fullWidth sx={{ justifyContent: 'start', py: 1 }} startIcon={<Star />}>Daily Kanji Practice</Button>
                                        <Button fullWidth sx={{ justifyContent: 'start', py: 1 }} startIcon={<Translate />}>Internal Glossary</Button>
                                        <Button fullWidth sx={{ justifyContent: 'start', py: 1 }} startIcon={<Assignment />}>JLPT Mock Exams</Button>
                                    </Stack>
                                </Paper>
                            </Stack>
                        </Box>

                    </Box>
                </Box>
            </Box>
        </PageLayout>
    );
};

// Helper Component for Sidebar Leaderboard
const RankingItem = ({ name, score, pos }: { name: string, score: string, pos: number }) => (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" spacing={1.5} alignItems="center">
            <Typography variant="body2" fontWeight={800} color={pos === 1 ? '#fbbf24' : 'white'}>{pos}.</Typography>
            <Typography variant="body2">{name}</Typography>
        </Stack>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>{score}</Typography>
    </Stack>
);

export default Home;