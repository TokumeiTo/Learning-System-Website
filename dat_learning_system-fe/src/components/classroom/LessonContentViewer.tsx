import { useEffect, useRef, useState, useMemo } from 'react';
import { Box, Typography, Stack, Paper, Button, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import { AutoStories, Lock, ZoomIn as ZoomInIcon } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import type { LessonContent } from '../../types_interfaces/classroom';
import { sendHeartbeat, markLessonComplete } from '../../api/lessonProgress.api';
import QuizViewer from '../quiz/QuizViewer';
import ImageLightbox from '../mediaRelated/ImageLightBox';
import AppLoader from '../feedback/AppLoader';

interface Props {
    contents: LessonContent[];
    lessonId?: string;
    isDone?: boolean;
    lastScore?: number | null;
    onComplete?: () => void;
    isLoading?: boolean;
}

const LessonContentViewer = ({ contents, lessonId, isDone, lastScore, onComplete, isLoading }: Props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Initialize completed quizzes based on content status if the backend provides it
    const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});

    const isPlayingRef = useRef(isPlaying);

    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    useEffect(() => {
        if (isDone) {
            // We assume if isDone is true or there's a score, the user has fulfilled the requirement
            // We'll mark all quiz blocks as passed initially so the "Mark as Complete" button is active
            const initialCompleted: Record<string, boolean> = {};
            contents.forEach(block => {
                if (block.contentType === 'test') {
                    initialCompleted[block.id] = true;
                }
            });
            setCompletedQuizzes(initialCompleted);
        }
    }, [isDone, contents]);

    const lastActivityRef = useRef<number>(Date.now());
    const Player = ReactPlayer as any;


    // --- LOGIC: QUIZ GATE ---
    const allTestsPassed = useMemo(() => {
        const testBlocks = contents.filter(c => c.contentType === 'test');
        if (testBlocks.length === 0) return true;

        // If it's already marked as done globally, ignore the gate
        if (isDone) return true;

        return testBlocks.every(block => completedQuizzes[block.id]);
    }, [contents, completedQuizzes, isDone]);

    // --- TRACKING LOGIC ---
    useEffect(() => {
        if (!lessonId || !contents.length || isDone) return;

        const updateActivity = () => { lastActivityRef.current = Date.now(); };

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('scroll', updateActivity);

        const interval = setInterval(() => {
            const isInactive = (Date.now() - lastActivityRef.current) > 60000;
            const isTabHidden = document.visibilityState === 'hidden';
            const hasVideo = contents.some(c => c.contentType === 'video');

            // If there's a video, only track if it's actually playing
            const shouldTrack = hasVideo ? isPlayingRef.current : !isInactive;

            if (shouldTrack && !isTabHidden) {
                sendHeartbeat({ lessonId, seconds: 15 }).catch(() => {
                    /* Silent fail to not disrupt student */
                });
            }
        }, 15000);

        return () => {
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('scroll', updateActivity);
            clearInterval(interval);
        };
    }, [lessonId, isDone]);

    const handleQuizFinish = (blockId: string, _percentage: number, passed: boolean) => {
        setCompletedQuizzes(prev => ({ ...prev, [blockId]: passed }));
    };

    const handleMarkAsComplete = async () => {
        if (!lessonId || !allTestsPassed) return;
        setIsCompleting(true);
        try {
            await markLessonComplete(lessonId);
            if (onComplete) onComplete();
        } catch (error) {
            console.error("Failed to complete lesson", error);
        } finally {
            setIsCompleting(false);
        }
    };

    const handleDownload = (url: string) => {
        const link = document.createElement('a');
        link.href = url.startsWith('http') ? url : `${import.meta.env.VITE_API_URL}${url}`;
        link.setAttribute('download', '');
        link.click();
    };

    // Helper for YouTube links (Matches Editor Logic)
    const formatVideoUrl = (url: string) => {
        if (url.includes('youtube.com/watch')) {
            return url.replace("watch?v=", "embed/").split('&')[0];
        }
        return url.includes('http') ? url : `${import.meta.env.VITE_API_URL}/videos/${url}`;
    };

    const renderChart = (body: string) => {
        try {
            const data: string[][] = JSON.parse(body);
            if (!Array.isArray(data) || data.length === 0) return null;

            const headers = data[0];
            const rows = data.slice(1);

            return (
                <TableContainer component={Paper} sx={{ bgcolor: 'rgba(30, 41, 59, 0.5)', borderRadius: 2, border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'rgba(99, 102, 241, 0.2)' }}>
                                {headers.map((cell, i) => (
                                    <TableCell key={i} sx={{ color: '#818cf8', fontWeight: 'bold', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        {cell}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row, rowIndex) => (
                                <TableRow key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <TableCell key={cellIndex} sx={{ color: 'white', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                            {cell}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            );
        } catch (e) {
            return <Typography color="error">Invalid chart data</Typography>;
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ py: 15, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <AppLoader fullscreen={false} kanji="読み込み中" />
            </Box>
        );
    }

    if (!contents || contents.length === 0) {
        return (
            <Paper sx={{ py: 10, px: 3, bgcolor: 'transparent', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: 4, textAlign: 'center' }}>
                <AutoStories sx={{ fontSize: 60, color: 'rgba(99, 102, 241, 0.3)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white' }}>No Content Available</Typography>
            </Paper>
        );
    }

    return (
        <Box>
            <Stack spacing={2}>
                {contents.map((block) => (
                    <Box key={block.id}>
                        {block.contentType === 'text' && (
                            <Box
                                className="quill-content"
                                sx={{
                                    color: 'white',
                                    lineHeight: 1.8,
                                    fontSize: '1.05rem',
                                    // --- WRAPPING FIXES ---
                                    whiteSpace: 'pre-wrap',      // Maintains line breaks from Quill but wraps lines
                                    overflowWrap: 'break-word',  // Modern standard for breaking long words
                                    wordBreak: 'break-word',     // Support for older browsers
                                    width: '100%',
                                    // ----------------------
                                    '& h1, & h2, & h3': { mt: 2, mb: 1, color: '#818cf8' }, // Added neon touch to headers
                                    '& p': { mb: 1 },
                                    '& ul, & ol': { ml: 3, mb: 2 },
                                    '& strong': { fontWeight: 700 },
                                    '& em': { fontStyle: 'italic' },
                                    // Ensure images/tables inside the text block don't overflow
                                    '& img': { maxWidth: '100%', height: 'auto' },
                                    '& table': { width: '100%', overflowX: 'auto', display: 'block' }
                                }}
                                dangerouslySetInnerHTML={{ __html: block.body }}
                            />
                        )}

                        {/* TYPE: CHART - New Renderer */}
                        {block.contentType === 'chart' && block.body && (
                            <Box sx={{ mt: 2 }}>
                                {renderChart(block.body)}
                            </Box>
                        )}

                        {/* TYPE: IMAGE */}
                        {block.contentType === 'image' && block.body && (
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    mt: 2,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    boxShadow: 4,
                                    bgcolor: '#516070',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    '&:hover .zoom-overlay': { opacity: 1 },
                                    '&:hover img': { filter: 'brightness(0.9)' }
                                }}
                                onClick={() => setSelectedImage(block.body)}
                            >
                                <Box
                                    component="img"
                                    src={
                                        block.body.startsWith('http') || block.body.startsWith('blob:')
                                            ? block.body
                                            : `${import.meta.env.VITE_API_URL}${block.body}`
                                    }
                                    sx={{
                                        display: 'block',
                                        p: '30px',
                                        width: '100%',
                                        maxHeight: '350px',
                                        objectFit: 'contain',
                                        transition: 'transform 0.3s ease',
                                    }}
                                />

                                {/* Simple Hover Overlay */}
                                <Box
                                    className="zoom-overlay"
                                    sx={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        bgcolor: 'rgba(15, 23, 42, 0.3)',
                                        opacity: 0,
                                        transition: 'opacity 0.3s ease',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    <Stack direction="row" spacing={1} sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.6)', px: 2, py: 1, borderRadius: 10 }}>
                                        <ZoomInIcon />
                                        <Typography fontWeight={600}>Click to View & Download</Typography>
                                    </Stack>
                                </Box>
                            </Box>
                        )}

                        {/* TYPE: VIDEO */}
                        {block.contentType === 'video' && block.body && (
                            <Box
                                sx={{
                                    width: '100%',
                                    mt: 2,
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    bgcolor: 'black',
                                    boxShadow: 6,
                                    position: 'relative',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { transform: 'scale(1.01)' } // Subtle lift on hover
                                }}
                            >
                                <Player
                                    url={formatVideoUrl(block.body)}
                                    width="100%"
                                    height="100%"
                                    style={{ aspectRatio: '16/9', display: 'block' }}
                                    controls
                                    playing={isPlaying}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    config={{
                                        file: {
                                            attributes: {
                                                controlsList: 'nodownload', // Prevents the default browser download button
                                                disablePictureInPicture: false
                                            }
                                        }
                                    }}
                                />
                            </Box>
                        )}

                        {/* TYPE: DOCUMENT */}
                        {block.contentType === 'file' && block.body && (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2,
                                    mt: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    bgcolor: 'rgba(30, 41, 59, 0.5)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 3,
                                    transition: 'all 0.2s',
                                    '&:hover': { bgcolor: 'rgba(30, 41, 59, 0.8)', borderColor: '#6366f1' }
                                }}
                            >
                                {/* Dynamic Icon based on Extension */}
                                <Box sx={{
                                    p: 1.5,
                                    borderRadius: 2,
                                    bgcolor: block.body.endsWith('.xlsx') ? '#16a34a' :
                                        block.body.endsWith('.pdf') ? '#dc2626' : '#2563eb',
                                    display: 'flex'
                                }}>
                                    <InsertDriveFileIcon sx={{ color: 'white' }} />
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="subtitle2" noWrap sx={{ color: 'white', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {block.body.split('/').pop()}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                        {block.body.split('.').pop()?.toUpperCase()} Document
                                    </Typography>
                                </Box>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<FileDownloadIcon />}
                                    onClick={() => handleDownload(block.body)}
                                    sx={{
                                        color: 'white',
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        textTransform: 'none',
                                        '&:hover': { borderColor: '#6366f1', bgcolor: 'rgba(99, 102, 241, 0.1)' }
                                    }}
                                >
                                    Download
                                </Button>
                            </Paper>
                        )}

                        {/* TYPE: TEST / QUIZ */}
                        {block.contentType === 'test' && block.test && (
                            <QuizViewer
                                key={block.test.id}
                                data={block.test}
                                testId={block.test.id!}
                                lessonId={lessonId}
                                onFinish={(percentage, passed) => handleQuizFinish(block.id, percentage, passed)}
                                existingScore={lastScore}
                                isCompleted={isDone}
                                isLocked={false}
                            />
                        )}
                    </Box>
                ))}

                {/* --- COMPLETION SECTION --- */}
                <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    {!allTestsPassed && !isDone && contents.some(c => c.contentType === 'test') && (
                        <Typography variant="body2" sx={{ color: '#fb7185', mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                            <Lock sx={{ fontSize: 16 }} /> Please pass the quiz with a valid score to finish this lesson.
                        </Typography>
                    )}

                    <Button
                        variant={isDone ? "outlined" : "contained"}
                        color={isDone ? "success" : "primary"}
                        size="large"
                        // Disable if it's currently saving OR if it's already finished
                        disabled={isCompleting || isDone || !allTestsPassed}
                        onClick={handleMarkAsComplete}
                        sx={{
                            borderRadius: 3,
                            px: 8,
                            py: 1.5,
                            fontWeight: 700,
                            "&.Mui-disabled": isDone ? {
                                borderColor: '#10b981',
                                bgcolor: '#49a586',
                                color: 'lightgray',
                                opacity: 0.8
                            } : {}
                        }}
                    >
                        {isCompleting ? <CircularProgress size={24} color="inherit" /> :
                            isDone ? "Lesson Completed ✓" : "Mark as Completed"}
                    </Button>
                </Box>
            </Stack>

            {/* Modals */}
            <ImageLightbox
                imageUrl={selectedImage}
                onClose={() => setSelectedImage(null)}
            />
        </Box>
    );
};

export default LessonContentViewer;