import React, { useState } from 'react';
import {
    Box, Typography, Stack, Paper, InputBase,
    Chip, Button, Card, CardContent, LinearProgress,
    Select, MenuItem, FormControl
} from '@mui/material';
import {
    Search, Download,
    Translate, Terminal, Language, Star,
    LightbulbCircle, Sort,
    Dashboard
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import PageLayout from '../../components/layout/PageLayout';

// --- Types & Data ---
interface EBook {
    id: number;
    title: string;
    author: string;
    category: 'IT' | 'Japanese' | 'English';
    progress: number;
    rating: number;
    image: string;
}

const EBOOKS_DATA: EBook[] = [
    { id: 1, title: 'Clean Code: A Handbook of Agile Software', author: 'Robert C. Martin', category: 'IT', progress: 45, rating: 4.9, image: '#' },
    { id: 2, title: 'Minna no Nihongo - Elementary I', author: '3A Network', category: 'Japanese', progress: 80, rating: 4.8, image: '#' },
    { id: 3, title: 'Advanced English Grammar in Use', author: 'Raymond Murphy', category: 'English', progress: 10, rating: 4.7, image: '#' },
    { id: 4, title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', category: 'IT', progress: 0, rating: 5.0, image: '#' },
    { id: 5, title: 'Business Etiquette in Japan', author: 'S.R. Walker', category: 'Japanese', progress: 0, rating: 4.5, image: '#' },
];

const EBooksPage: React.FC = () => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');

    const filteredBooks = EBOOKS_DATA.filter(book =>
        activeCategory === 'All' ? true : book.category === activeCategory
    );

    return (
        <PageLayout>
            <Box sx={{ minHeight: 'calc(100vh - 65px)', bgcolor: 'background.default', p: { xs: 2, md: 6 } }}>

                {/* 1. Header Section */}
                <Stack spacing={1} sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight={900} color="text.primary">Knowledge Base</Typography>
                    <Typography variant="body1" color="text.secondary">
                        Access specialized resources for IT, Japanese, and English communication.
                    </Typography>
                </Stack>

                {/* 2. Top Banner (Tip) - Dismissible or Fixed */}
                <Paper
                    elevation={0}
                    sx={{
                        p: 3, mb: 5, borderRadius: 5,
                        background: 'background.paper',
                        border: '1px solid #dbeafe',
                        display: 'flex', alignItems: 'center', gap: 2
                    }}
                >
                    <LightbulbCircle sx={{ color: '#3b82f6', fontSize: 40 }} />
                    <Box>
                        <Typography variant="subtitle2" fontWeight={800} color="#1e40af">Learning Tip for Today</Typography>
                        <Typography variant="body2" color="#1e40af">
                            Focus on one Kanji or IT concept for 10 minutes before your first meeting. Consistency beats intensity!
                        </Typography>
                    </Box>
                </Paper>

                {/* 3. Filter & Search Bar Area */}
                <Stack
                    direction={{ xs: 'column', lg: 'row' }}
                    spacing={3}
                    justifyContent="space-between"
                    alignItems={{ xs: 'start', lg: 'center' }}
                    sx={{ mb: 6 }}
                >
                    {/* Category Pills */}
                    <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', width: '100%', pb: { xs: 1, lg: 0 } }}>
                        {['All', 'IT', 'Japanese', 'English'].map((cat) => (
                            <Chip
                                key={cat}
                                label={cat}
                                onClick={() => setActiveCategory(cat)}
                                color={activeCategory === cat ? "primary" : "default"}
                                variant={activeCategory === cat ? "filled" : "outlined"}
                                icon={
                                    cat === 'All' ? <Dashboard fontSize="small" /> :
                                    cat === 'IT' ? <Terminal fontSize="small" /> :
                                    cat === 'Japanese' ? <Translate fontSize="small" /> :
                                    cat === 'English' ? <Language fontSize="small" /> : undefined
                                }
                        sx={{ px: 2, py: 2.5, borderRadius: 3, fontWeight: 700, border: '1px solid #e2e8f0' }}
                            />
                        ))}
                    </Stack>

                    {/* Search and Sort */}
                    <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', lg: 'auto' } }}>
                        <Paper elevation={0} sx={{
                            display: 'flex', alignItems: 'center', px: 2, py: 0.5,
                            borderRadius: 3, bgcolor: 'background.paper', border: '1px solid #e2e8f0',
                            width: { xs: '100%', lg: 300 }
                        }}>
                            <Search sx={{ color: 'gray', fontSize: 20 }} />
                            <InputBase sx={{ ml: 1, flex: 1, fontSize: 14 }} placeholder="Search titles..." />
                        </Paper>

                        <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                displayEmpty
                                startAdornment={<Sort sx={{ mr: 1, fontSize: 18, color: 'gray' }} />}
                                sx={{ borderRadius: 3, bgcolor: 'background.paper' }}
                            >
                                <MenuItem value="Newest">Newest</MenuItem>
                                <MenuItem value="Popular">Popular</MenuItem>
                                <MenuItem value="Rating">Rating</MenuItem>
                            </Select>
                        </FormControl>
                    </Stack>
                </Stack>

                {/* 4. Books Grid */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 5,
                    justifyContent: { xs: 'center', lg: 'flex-start' }
                }}>
                    <AnimatePresence mode="popLayout">
                        {filteredBooks.map((book) => (
                            <Box
                                key={book.id}
                                component={motion.div}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                whileHover={{ y: -10 }}
                                sx={{ width: 200 }}
                            >
                                <Card sx={{
                                    borderRadius: 6,
                                    bgcolor: 'transparent',
                                    boxShadow: 'none',
                                    '&:hover .book-actions': { opacity: 1 }
                                }}>
                                    {/* Book Cover Container */}
                                    <Box sx={{ position: 'relative', mb: 2 }}>
                                        <Paper
                                            elevation={10}
                                            sx={{
                                                borderRadius: 4,
                                                overflow: 'hidden',
                                                height: 300,
                                                transition: 'transform 0.3s ease',
                                            }}
                                        >
                                            <img src={book.image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        </Paper>

                                        {/* Hover Actions Layer */}
                                        <Box
                                            className="book-actions"
                                            sx={{
                                                position: 'absolute', inset: 0, bgcolor: 'rgba(15, 23, 42, 0.7)',
                                                borderRadius: 4, display: 'flex', flexDirection: 'column',
                                                justifyContent: 'center', alignItems: 'center', gap: 2,
                                                opacity: 0, transition: 'opacity 0.3s ease', backdropFilter: 'blur(4px)'
                                            }}
                                        >
                                            <Button variant="contained" sx={{ bgcolor: 'white', color: '#0f172a', fontWeight: 800, borderRadius: 2 }}>
                                                Read Now
                                            </Button>
                                            <Button startIcon={<Download />} sx={{ color: 'white', fontWeight: 600 }}>
                                                PDF
                                            </Button>
                                        </Box>
                                    </Box>

                                    {/* Info Section */}
                                    <CardContent sx={{ p: 1 }}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="start">
                                            <Typography variant="subtitle1" fontWeight={800} noWrap sx={{ flex: 1, mr: 1 }}>
                                                {book.title}
                                            </Typography>
                                            <Stack direction="row" alignItems="center" spacing={0.3}>
                                                <Star sx={{ fontSize: 14, color: '#f59e0b' }} />
                                                <Typography variant="caption" fontWeight={700}>{book.rating}</Typography>
                                            </Stack>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{book.author}</Typography>

                                        {book.progress > 0 ? (
                                            <Box>
                                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                                    <Typography variant="caption" color="primary" fontWeight={800}>{book.progress}% Completed</Typography>
                                                </Stack>
                                                <LinearProgress variant="determinate" value={book.progress} sx={{ height: 6, borderRadius: 3, bgcolor: '#e2e8f0' }} />
                                            </Box>
                                        ) : (
                                            <Chip label="Not Started" size="small" variant="outlined" sx={{ borderRadius: 1.5, fontSize: 10, fontWeight: 700 }} />
                                        )}
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

export default EBooksPage;