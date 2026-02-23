import { useEffect, useRef, useState } from 'react';
import { Box, Typography, Stack, Paper, Button, CircularProgress } from '@mui/material';
import { AutoStories, CheckCircleOutline } from '@mui/icons-material'
import ReactPlayer from 'react-player';
import type { LessonContent } from '../../types/classroom';
import { sendHeartbeat, markLessonComplete } from '../../api/lessonProgress.api';

// Added lessonId to props so we know what to track
interface Props {
    contents: LessonContent[];
    lessonId?: string;
    isDone?: boolean; // Pass the current status from the parent
    onComplete?: () => void;
}

const LessonContentViewer = ({ contents, lessonId, isDone, onComplete }: Props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    const lastActivityRef = useRef<number>(Date.now());
    const Player = ReactPlayer as any;

    // --- TRACKING LOGIC ---
    useEffect(() => {
        if (!lessonId || !contents.length) return;

        const updateActivity = () => {
            lastActivityRef.current = Date.now();
        };

        window.addEventListener('mousemove', updateActivity);
        window.addEventListener('scroll', updateActivity);

        const interval = setInterval(() => {
            const isInactive = (Date.now() - lastActivityRef.current) > 60000;
            const isTabHidden = document.visibilityState === 'hidden';
            const hasVideo = contents.some(c => c.contentType === 'video');

            // Track if: (Video is playing) OR (Text content AND user is moving/scrolling)
            const shouldTrack = hasVideo ? isPlaying : !isInactive;

            if (shouldTrack && !isTabHidden) {
                console.log(`%c 📈 KPI Pulse: Tracking Lesson ${lessonId}`, "color: #3b82f6");
                sendHeartbeat({ lessonId, seconds: 15 }).catch(console.error);
            } else {
                console.log("%c ⏸️ Tracking Paused", "color: #ef4444");
            }
        }, 15000);

        return () => {
            window.removeEventListener('mousemove', updateActivity);
            window.removeEventListener('scroll', updateActivity);
            clearInterval(interval);
        };
    }, [lessonId, isPlaying, contents]);

    const handleMarkAsComplete = async () => {
        if (!lessonId) return;
        setIsCompleting(true);
        try {
            await markLessonComplete(lessonId);
            if (onComplete) onComplete(); // Refresh parent state
        } catch (error) {
            console.error("Failed to complete lesson", error);
        } finally {
            setIsCompleting(false);
        }
    };

    if (!contents || contents.length === 0) {
        return (
            <Paper sx={{ py: 10, px: 3, bgcolor: 'transparent', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <AutoStories sx={{ fontSize: 60, color: 'rgba(99, 101, 241, 0.47)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>No Lesson Content Yet</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5) ' }}>The instructor hasn't added any materials yet.</Typography>
            </Paper>
        );
    }

    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Stack spacing={4}>
                {contents.map((block) => (
                    <Box key={block.id}>
                        {block.contentType === 'text' && (
                            <Typography sx={{ color: 'white', lineHeight: 1.8, fontSize: '1.1rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                {block.body}
                            </Typography>
                        )}

                        {block.contentType === 'image' && block.body && (
                            <Box component="img" src={block.body} sx={{ mx: 'auto', my: '20px', width: '70%', borderRadius: 3, boxShadow: '0 4px 20px rgba(255,255,255,0.1)', display: 'block' }} />
                        )}

                        {block.contentType === 'video' && block.body && (
                            <Box sx={{ width: '100%', aspectRatio: '16/9', borderRadius: 3, overflow: 'hidden', bgcolor: 'black' }}>
                                <Player
                                    url={block.body.includes('http') ? block.body : `${import.meta.env.VITE_API_URL}/videos/${block.body}`}
                                    width="100%"
                                    height="100%"
                                    controls
                                    playing={isPlaying}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => setIsPlaying(false)}
                                    config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                                />
                            </Box>
                        )}
                    </Box>
                ))}

                {/* --- COMPLETION SECTION --- */}
                <Box sx={{
                    mt: 6,
                    pt: 4,
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    justifyContent: 'end'
                }}>
                    <Button
                        variant={isDone ? "outlined" : "contained"}
                        color={isDone ? "success" : "primary"}
                        size="large"
                        startIcon={isDone ? <CheckCircleOutline /> : null}
                        disabled={isCompleting || isDone}
                        onClick={handleMarkAsComplete}
                        sx={{
                            borderRadius: 3,
                            px: 6,
                            py: 1.5,
                            textTransform: 'none',
                            fontSize: '1rem',
                            fontWeight: 700,
                            boxShadow: isDone ? 'none' : '0 4px 14px 0 rgba(99, 102, 241, 0.39)',
                            bgcolor: isDone ? 'green' : 'rgba(99, 102, 241, 0.39)',
                        }}
                    >
                        {isCompleting ? <CircularProgress size={24} color="inherit" /> :
                            isDone ? "Lesson Completed" : "Mark as Completed"}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default LessonContentViewer;