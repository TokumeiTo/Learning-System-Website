import React, { useState } from 'react';
import { Box, Stack, Paper, InputBase, Divider, Button, CircularProgress, Typography } from '@mui/material';
import { Search, Translate, MenuBook } from '@mui/icons-material';
import PageLayout from '../../components/layout/PageLayout';
import { dictionaryApi } from '../../api/dictionary.api';

// Sub-components
import ResultCard from '../../components/dictionary/ResultCard';
import DictionarySidebar from '../../components/dictionary/DictionarySidebar';

const DictionaryPage: React.FC = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    // Initialize history from LocalStorage
    const [history, setHistory] = useState<string[]>(
        JSON.parse(localStorage.getItem('dict_history') || '[]')
    );

    const handleSearch = async (searchWord: string = query) => {
        if (!searchWord.trim()) return;

        setLoading(true);
        try {
            const response = await dictionaryApi.search(searchWord);
            setResults(response.data); // Jisho structure returns an array in .data

            // Update History: Add to top, remove duplicates, keep top 5
            const updatedHistory = [searchWord, ...history.filter(h => h !== searchWord)].slice(0, 5);
            setHistory(updatedHistory);
            localStorage.setItem('dict_history', JSON.stringify(updatedHistory));
        } catch (error) {
            console.error("Dictionary search failed:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleClearHistory = () => {
        setHistory([]); // Clear the state
        localStorage.removeItem('dict_history'); // Clear the storage
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
                        <Typography variant="body2" color="text.secondary">Search via Jisho API Proxy</Typography>
                    </Box>
                </Stack>

                {/* Search Bar */}
                <Paper
                    component="form"
                    onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
                    elevation={0}
                    sx={{ p: '10px 20px', display: 'flex', alignItems: 'center', borderRadius: 4, mb: 6, border: '2px solid', borderColor: 'primary.light' }}
                >
                    <Search sx={{ color: 'gray', mr: 2 }} />
                    <InputBase
                        sx={{ flex: 1, fontSize: 18, fontWeight: 500 }}
                        placeholder="Search Japanese or English..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    
                    <Divider sx={{ height: 28, mx: 2 }} orientation="vertical" />
                    <Button variant="contained" onClick={() => handleSearch()} disabled={loading} sx={{ borderRadius: 3, px: 4, fontWeight: 700 }}>
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                    </Button>
                </Paper>

                {/* Main Content Area */}
                <Box sx={{ display: 'flex', gap: 4, flexWrap: { xs: 'wrap', lg: 'nowrap' } }}>

                    {/* Results Column */}
                    <Box sx={{ flex: 2 }}>
                        {results.length === 0 && !loading && (
                            <Box sx={{ textAlign: 'center', py: 10, opacity: 0.3 }}>
                                <MenuBook sx={{ fontSize: 80, mb: 2 }} />
                                <Typography variant="h6">Try searching for "Repository" or "会議"</Typography>
                            </Box>
                        )}

                        {results.map((item, idx) => (
                            <ResultCard key={idx} item={item} index={idx} />
                        ))}
                    </Box>

                    {/* Sidebar Column */}
                    <Box sx={{ flex: 1, minWidth: 300 }}>
                        <DictionarySidebar
                            history={history}
                            onHistoryClick={(word) => {
                                setQuery(word);
                                handleSearch(word);
                            }}
                            onClearHistory={handleClearHistory}
                        />
                    </Box>
                </Box>
            </Box>
        </PageLayout>
    );
};

export default DictionaryPage;