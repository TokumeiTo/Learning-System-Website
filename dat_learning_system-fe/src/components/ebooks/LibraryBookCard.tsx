import React from 'react';
import { Box, Typography, Stack, Paper, Button, Card, CardContent, useTheme, Tooltip } from '@mui/material';
import { Download, Star, AccessTimeFilled, GetApp } from '@mui/icons-material'; // Added GetApp for download icon
import { motion } from 'framer-motion';
import type { EBook } from '../../types_interfaces/library';
import { getDownloadUrl } from '../../api/library.api';

interface BookProps {
    book: EBook;
    onRead: () => void;
}

const LibraryBookCard: React.FC<BookProps> = ({ book, onRead }) => {
    const theme = useTheme();

    const formatTime = (minutes: number | undefined) => {
        if (!minutes || minutes === 0) return "Not started";
        if (minutes < 60) return `${minutes}m studied`;
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h}h ${m}m studied`;
    };

    const timeSpent = book.userProgress?.totalMinutesSpent ?? 0;

    return (
        <Box
            component={motion.div}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={{ y: -10 }}
            sx={{ width: 200 }}
        >
            <Card sx={{ borderRadius: 6, bgcolor: 'transparent', boxShadow: 'none' }}>
                <Box sx={{ position: 'relative', mb: 2, '&:hover .book-actions': { opacity: 1 } }}>
                    {/* DOWNLOAD COUNT BADGE (Top Right) */}
                    <Box sx={{ 
                        position: 'absolute', top: 12, right: 12, zIndex: 2,
                        bgcolor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                        px: 1, py: 0.5, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 0.5
                    }}>
                        <GetApp sx={{ fontSize: 12, color: 'white' }} />
                        <Typography variant="caption" sx={{ color: 'white', fontWeight: 700 }}>
                            {book.totalDownloadCount ?? 0}
                        </Typography>
                    </Box>

                    <Paper
                        elevation={10}
                        sx={{ borderRadius: 4, overflow: 'hidden', height: 280, position: 'relative' }}
                    >
                        <img
                            src={book.thumbnailUrl.startsWith('http') ? book.thumbnailUrl : `${import.meta.env.VITE_API_URL}${book.thumbnailUrl}`}
                            alt={book.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </Paper>

                    {/* HOVER ACTIONS */}
                    <Box
                        className="book-actions"
                        sx={{
                            position: 'absolute', inset: 0, bgcolor: 'rgba(15, 23, 42, 0.85)',
                            borderRadius: 4, display: 'flex', flexDirection: 'column',
                            justifyContent: 'center', alignItems: 'center', gap: 2,
                            opacity: 0, transition: 'all 0.3s ease', backdropFilter: 'blur(6px)',
                            zIndex: 3
                        }}
                    >
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={onRead}
                            sx={{ 
                                mx: 2, width: '80%', bgcolor: 'white', color: '#0f172a', 
                                fontWeight: 800, borderRadius: 2, '&:hover': { bgcolor: '#f1f5f9' } 
                            }}
                        >
                            Read Now
                        </Button>
                        
                        <Tooltip title="Download for Offline Study" arrow>
                            <Button
                                startIcon={<Download />}
                                variant="outlined"
                                sx={{ 
                                    color: 'white', borderColor: 'rgba(255,255,255,0.3)', 
                                    fontWeight: 600, width: '80%', borderRadius: 2,
                                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                                // Use the dedicated download endpoint
                                href={getDownloadUrl(book.id)}
                            >
                                Download
                            </Button>
                        </Tooltip>
                    </Box>
                </Box>

                <CardContent sx={{ p: 1 }}>
                    {/* ... Title and Star Rating remain same ... */}
                    <Stack direction="row" justifyContent="space-between" alignItems="start">
                        <Typography variant="subtitle2" fontWeight={800} noWrap sx={{ flex: 1, mr: 1 }}>
                            {book.title}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.3}>
                            <Star sx={{ fontSize: 14, color: '#f59e0b' }} />
                            <Typography variant="caption" fontWeight={700}>
                                {book.averageRating?.toFixed(1)}
                            </Typography>
                        </Stack>
                    </Stack>

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
                        {book.author}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={0.5}>
                        <AccessTimeFilled
                            sx={{
                                fontSize: 14,
                                color: timeSpent > 0 ? theme.palette.primary.main : theme.palette.text.disabled
                            }}
                        />
                        <Typography
                            variant="caption"
                            fontWeight={800}
                            sx={{ color: timeSpent > 0 ? theme.palette.primary.main : theme.palette.text.disabled }}
                        >
                            {formatTime(timeSpent)}
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default LibraryBookCard;