import React, { useState } from 'react';
import {
    Box, Typography, Stack, Paper, InputBase, IconButton,
    Chip, Button, Card, Divider, CircularProgress,
} from '@mui/material';
import {
    Search, Translate, History, Bookmark, MenuBook, Keyboard
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import PageLayout from '../../components/layout/PageLayout';

// --- Types for Jisho API ---
interface JishoResult {
    slug: string;
    is_common: boolean;
    tags: string[];
    jlpt: string[];
    japanese: { word?: string; reading: string }[];
    senses: { english_definitions: string[]; parts_of_speech: string[] }[];
}

const DictionaryPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<JishoResult[]>([]);
    const [loading, setLoading] = useState(false);

    const searchJisho = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query) return;

        setLoading(true);
        try {
            // Jisho API (using a proxy if CORS issues occur in browser, 
            // but usually works directly via their public endpoint)
            const response = await axios.get(`https://jisho.org/api/v1/search/words?keyword=${query}`);
            setResults(response.data.data);
        } catch (error) {
            console.error("Error fetching from Jisho:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <Box sx={{ minHeight: 'calc(100vh - 65px)', bgcolor: 'background.default', p: { xs: 2, md: 6 } }}>

                {/* Header Section */}
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1, borderRadius: 2 }}>
                        <Translate />
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight={900}>Language Hub</Typography>
                        <Typography variant="body2" color="text.secondary">Search Japanese, IT terms, or English definitions.</Typography>
                    </Box>
                </Stack>

                {/* Search Container */}
                <Paper
                    component="form"
                    onSubmit={searchJisho}
                    elevation={0}
                    sx={{
                        p: '10px 20px', display: 'flex', alignItems: 'center',
                        borderRadius: 4, mb: 6, border: '2px solid', borderColor: 'primary.light',
                        boxShadow: '0 10px 25px rgba(99, 102, 241, 0.1)'
                    }}
                >
                    <Search sx={{ color: 'gray', mr: 2 }} />
                    <InputBase
                        sx={{ flex: 1, fontSize: 18, fontWeight: 500 }}
                        placeholder="Type a word in Japanese (Hiragana/Kanji) or English..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <IconButton sx={{ color: 'primary.main' }} onClick={() => setQuery('')}>
                        <Keyboard fontSize="small" />
                    </IconButton>
                    <Divider sx={{ height: 28, m: 0.5, mx: 2 }} orientation="vertical" />
                    <Button
                        variant="contained"
                        onClick={searchJisho}
                        disabled={loading}
                        sx={{ borderRadius: 3, px: 4, py: 1, fontWeight: 700 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                    </Button>
                </Paper>

                {/* Results Section (Flexbox Layout) */}
                <Box sx={{ display: 'flex', gap: 4, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>

                    {/* Main Results Column */}
                    <Box sx={{ flex: 2 }}>
                        {results.length === 0 && !loading && (
                            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.5 }}>
                                <MenuBook sx={{ fontSize: 80, mb: 2 }} />
                                <Typography variant="h6">Start your search to see results from Jisho</Typography>
                            </Box>
                        )}

                        <Stack spacing={3}>
                            <AnimatePresence>
                                {results.map((item, idx) => (
                                    <motion.div
                                        key={item.slug + idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                    >
                                        <Card sx={{ p: 4, borderRadius: 5, border: '1px solid #eef2f6', boxShadow: 'none' }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="start">
                                                <Box>
                                                    <Stack direction="row" spacing={2} alignItems="baseline">
                                                        <Typography variant="h3" fontWeight={800} color="primary">
                                                            {item.japanese[0].word || item.japanese[0].reading}
                                                        </Typography>
                                                        <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400 }}>
                                                            {item.japanese[0].word ? item.japanese[0].reading : ''}
                                                        </Typography>
                                                    </Stack>

                                                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                                        {item.is_common && <Chip label="Common" size="small" color="success" sx={{ fontWeight: 700 }} />}
                                                        {item.jlpt.map(level => (
                                                            <Chip key={level} label={level.toUpperCase()} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                                                        ))}
                                                    </Stack>
                                                </Box>
                                                <IconButton><Bookmark /></IconButton>
                                            </Stack>

                                            <Divider sx={{ my: 3 }} />

                                            <Box>
                                                {item.senses.map((sense, sIdx) => (
                                                    <Box key={sIdx} sx={{ mb: 2 }}>
                                                        <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 800, textTransform: 'uppercase' }}>
                                                            {sense.parts_of_speech.join(', ')}
                                                        </Typography>
                                                        <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
                                                            {sIdx + 1}. {sense.english_definitions.join('; ')}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </Stack>
                    </Box>

                    {/* Sidebar: History & Quick Tools */}
                    <Box sx={{ flex: 1 }}>
                        <Stack spacing={3}>
                            <Paper sx={{ p: 3, borderRadius: 5 }}>
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <History color="primary" />
                                    <Typography variant="subtitle1" fontWeight={800}>Search History</Typography>
                                </Stack>
                                <Stack spacing={1}>
                                    {['会議 (Kaigi)', 'Repository', 'Stakeholder', '敬語 (Keigo)'].map((word) => (
                                        <Button
                                            key={word}
                                            fullWidth
                                            sx={{ justifyContent: 'start', borderRadius: 2, color: 'text.secondary', py: 1 }}
                                        >
                                            {word}
                                        </Button>
                                    ))}
                                </Stack>
                            </Paper>

                            <Paper sx={{ p: 3, borderRadius: 5, bgcolor: '#1e293b', color: 'white' }}>
                                <Typography variant="subtitle1" fontWeight={800} gutterBottom>IT Dictionary</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.7, mb: 2 }}>
                                    Quickly find Japanese translations for technical IT terminology.
                                </Typography>
                                <Button fullWidth variant="contained" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                                    Open IT Glossary
                                </Button>
                            </Paper>
                        </Stack>
                    </Box>

                </Box>
            </Box>
        </PageLayout>
    );
};

export default DictionaryPage;