import React from 'react';
import { Box, Typography, Stack, Paper, Button, Card, CardContent, useTheme, Tooltip, Chip } from '@mui/material';
import { Download, AccessTimeFilled, GetApp, AutoStories } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { EBook } from '../../types_interfaces/library';
import { getDownloadUrl } from '../../api/library.api';
import { useLibraryTracker } from '../../hooks/useLibraryTracker';

interface BookProps {
    book: EBook;
    onRead: () => void;
}

const LibraryBookCard: React.FC<BookProps> = ({ book, onRead }) => {
    const theme = useTheme();
    const { trackDownload } = useLibraryTracker();
    const progress = book.userProgress;
    const timeSpent = progress?.totalMinutesSpent ?? 0;

    const handleDownloadClick = async () => {
        await trackDownload(book.id);
    };

    const formatTime = (minutes: number) => {
        if (minutes <= 0) return "Not started";
        if (minutes < 60) return `${Math.round(minutes)}m studied`;
        const h = Math.floor(minutes / 60);
        const m = Math.round(minutes % 60);
        return m > 0 ? `${h}h ${m}m` : `${h}h`;
    };

    return (
        <Box
            component={motion.div}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            sx={{ width: 250 }}
        >
            <Card sx={{ borderRadius: 5, bgcolor: 'background.paper', overflow: 'hidden', boxShadow: theme.shadows[2] }}>
                <Box sx={{ position: 'relative', height: 280, '&:hover .book-overlay': { opacity: 1 } }}>
                    
                    {/* CATEGORY CHIP - High Visibility */}
                    <Chip 
                        label={book.category} 
                        size="small"
                        sx={{ 
                            position: 'absolute', top: 12, left: 12, zIndex: 4,
                            bgcolor: 'rgba(255, 255, 255, 0.9)', color: 'primary.dark',
                            fontWeight: 800, fontSize: '0.65rem', backdropFilter: 'blur(4px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }} 
                    />

                    {/* DOWNLOAD COUNT */}
                    <Box sx={{
                        position: 'absolute', top: 12, right: 12, zIndex: 4,
                        bgcolor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
                        px: 1, py: 0.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 0.5
                    }}>
                        <GetApp sx={{ fontSize: 12, color: 'white' }} />
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                            {book.totalDownloadCount ?? 0}
                        </Typography>
                    </Box>

                    <Box sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
                        <img
                            src={book.thumbnailUrl.startsWith('http') ? book.thumbnailUrl : `${import.meta.env.VITE_API_URL}${book.thumbnailUrl}`}
                            alt={book.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Box>

                    {/* HOVER OVERLAY - Includes Description */}
                    <Box
                        className="book-overlay"
                        sx={{
                            position: 'absolute', inset: 0, 
                            background: 'linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.95))',
                            display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 2,
                            opacity: 0, transition: 'opacity 0.3s ease', zIndex: 5, color: 'white'
                        }}
                    >
                        <Typography variant="caption" sx={{ mb: 1, opacity: 0.8, fontWeight: 600, textTransform: 'uppercase' }}>
                            About this book
                        </Typography>
                        <Typography variant="body2" sx={{ 
                            mb: 3, fontSize: '0.75rem', 
                            display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
                            overflow: 'hidden', lineHeight: 1.5,
                            textIndent: '10px'
                        }}>
                            {book.description || "No description available for this textbook."}
                        </Typography>

                        <Stack spacing={1.5}>
                            <Button
                                variant="contained"
                                startIcon={<AutoStories />}
                                onClick={onRead}
                                sx={{ 
                                    bgcolor: 'white', color: 'primary.main', fontWeight: 800,
                                    '&:hover': { bgcolor: 'grey.100' }
                                }}
                            >
                                Read
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Download />}
                                onClick={handleDownloadClick}
                                href={getDownloadUrl(book.id)}
                                sx={{ 
                                    color: 'white', borderColor: 'rgba(255,255,255,0.4)',
                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                Get PDF
                            </Button>
                        </Stack>
                    </Box>
                </Box>

                <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={800} noWrap sx={{ lineHeight: 1.2 }}>
                        {book.title}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                        by {book.author}
                    </Typography>

                    <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                            <AccessTimeFilled sx={{ fontSize: 14, color: timeSpent > 0 ? 'primary.main' : 'text.disabled' }} />
                            <Typography variant="caption" fontWeight={700} sx={{ color: timeSpent > 0 ? 'primary.main' : 'text.disabled', fontSize: '0.7rem' }}>
                                {formatTime(timeSpent)}
                            </Typography>
                        </Stack>

                        {progress?.hasDownloaded && (
                            <Tooltip title="Available Offline">
                                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'success.main' }} />
                            </Tooltip>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LibraryBookCard;