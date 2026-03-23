import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, CircularProgress, Pagination } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

// Layout & UI Components
import PageLayout from '../../components/layout/PageLayout';
import LibraryBookCard from '../../components/ebooks/LibraryBookCard';
import LibraryFilters from '../../components/ebooks/LibraryFilters';
import LibraryStats from '../../components/ebooks/LibraryStats';
import LearningTip from '../../components/ebooks/LearningTip';
import PDFViewerDialog from '../../components/mediaRelated/PDFViewerDialog';

// Logic & API
import { useLibraryTracker } from '../../hooks/useLibraryTracker';
import type { EBook, LibraryStatsData } from '../../types_interfaces/library';
import { fetchLibraryStats } from '../../api/library.api';

const LibraryPage: React.FC = () => {
    // 1. Destructure all pagination controls from our updated hook
    const {
        books,
        totalCount,
        loading,
        page,
        setPage,
        pageSize,
        loadCatalog,
        startTracking
    } = useLibraryTracker();

    // UI States
    const [activeCategory, setActiveCategory] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBook, setSelectedBook] = useState<EBook | null>(null);
    const [stats, setStats] = useState<LibraryStatsData | null>(null);

    // 2. Load data whenever Category or Search changes
    // CRITICAL: We reset to page 1 when filters change to avoid "empty page" bugs
    useEffect(() => {
        const categoryParam = activeCategory === 'All' ? undefined : activeCategory;
        setPage(1);
        loadCatalog(categoryParam, searchTerm, 1);
    }, [activeCategory, searchTerm, loadCatalog, setPage]);

    useEffect(() => {
        const loadStats = async () => {
            const data = await fetchLibraryStats();
            setStats(data);
        };
        loadStats();
    }, []);

    // 3. Load data when only the Page changes
    useEffect(() => {
        const categoryParam = activeCategory === 'All' ? undefined : activeCategory;
        loadCatalog(categoryParam, searchTerm, page);
    }, [page, loadCatalog]); // Note: excluding search/category here so they don't double-trigger

    // Handle Heartbeat (unchanged)
    useEffect(() => {
        let stopHeartbeat: (() => void) | undefined;
        if (selectedBook) {
            stopHeartbeat = startTracking(selectedBook.id);
        }
        return () => {
            if (stopHeartbeat) stopHeartbeat();
        };
    }, [selectedBook, startTracking]);

    return (
        <PageLayout>
            <Box sx={{ minHeight: 'calc(100vh - 65px)', bgcolor: 'background.default', p: { xs: 2, md: 6 } }}>

                <Stack spacing={1} sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight={900}>Knowledge Base</Typography>
                    <Typography variant="body1" color="text.secondary">Access specialized resources.</Typography>
                </Stack>

                <LearningTip tip="Consistency beats intensity! Your N3 journey starts with the first page." />

                {stats && (
                    <LibraryStats
                        readCount={stats.totalBooks}
                        inProgress={Math.round(stats.totalMinutesSpent)}
                        targetLevel={`${stats.booksOpened} READ`}
                    />
                )}

                <LibraryFilters
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                    sortBy={sortBy}
                    setSortBy={setSortBy}
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />

                {/* Book Grid */}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 5,
                    justifyContent: { xs: 'center', lg: 'flex-start' },
                    minHeight: '400px',
                    position: 'relative'
                }}>
                    {loading ? (
                        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                            <CircularProgress size={60} thickness={5} />
                        </Box>
                    ) : (
                        <AnimatePresence mode="popLayout">
                            {books.map((book) => (
                                <LibraryBookCard
                                    key={book.id}
                                    book={book}
                                    onRead={() => setSelectedBook(book)}
                                />
                            ))}
                        </AnimatePresence>
                    )}
                </Box>

                {/* 4. Pagination Component */}
                {!loading && totalCount > pageSize && (
                    <Stack alignItems="center" sx={{ mt: 8, mb: 4 }}>
                        <Pagination
                            count={Math.ceil(totalCount / pageSize)}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            size="large"
                            sx={{
                                '& .MuiPaginationItem-root': { fontWeight: 800, borderRadius: 2 }
                            }}
                        />
                    </Stack>
                )}
            </Box>

            <AnimatePresence>
                {selectedBook && (
                    <PDFViewerDialog
                        key="pdf-viewer"
                        open={Boolean(selectedBook)}
                        title={selectedBook.title}
                        fileUrl={`${import.meta.env.VITE_API_URL}${selectedBook.fileUrl}`}
                        onClose={() => setSelectedBook(null)}
                    />
                )}
            </AnimatePresence>
        </PageLayout>
    );
};

export default LibraryPage;