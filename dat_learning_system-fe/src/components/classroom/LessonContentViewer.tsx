import { useEffect, useRef, useState, useMemo } from 'react';
import { Box, Typography, Stack, Paper, Button, CircularProgress } from '@mui/material';
import { AutoStories, CheckCircleOutline, Lock } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import type { LessonContent } from '../../types/classroom';
import { sendHeartbeat, markLessonComplete } from '../../api/lessonProgress.api';
import QuizViewer from '../quiz/QuizViewer';

interface Props {
    contents: LessonContent[];
    lessonId?: string;
    isDone?: boolean;
    onComplete?: () => void;
}

const LessonContentViewer = ({ contents, lessonId, isDone, onComplete }: Props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);
    
    // Initialize completed quizzes based on content status if the backend provides it
    const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});

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
            const shouldTrack = hasVideo ? isPlaying : !isInactive;

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
    }, [lessonId, isPlaying, contents, isDone]);

    const handleQuizFinish = (blockId: string, _score: number, passed: boolean) => {
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

    // Helper for YouTube links (Matches Editor Logic)
    const formatVideoUrl = (url: string) => {
        if (url.includes('youtube.com/watch')) {
            return url.replace("watch?v=", "embed/").split('&')[0];
        }
        return url.includes('http') ? url : `${import.meta.env.VITE_API_URL}/videos/${url}`;
    };

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
            <Stack spacing={6}>
                {contents.map((block) => (
                    <Box key={block.id}>
                        {/* TYPE: TEXT */}
                        {block.contentType === 'text' && (
                            <Typography sx={{ color: 'white', lineHeight: 1.8, fontSize: '1.05rem', whiteSpace: 'pre-wrap' }}>
                                {block.body}
                            </Typography>
                        )}

                        {/* TYPE: IMAGE */}
                        {block.contentType === 'image' && block.body && (
                            <Box 
                                component="img" 
                                src={block.body} 
                                sx={{ width: '100%', borderRadius: 3, boxShadow: 4, display: 'block' }} 
                            />
                        )}

                        {/* TYPE: VIDEO */}
                        {block.contentType === 'video' && block.body && (
                            <Box sx={{ width: '100%', aspectRatio: '16/9', borderRadius: 3, overflow: 'hidden', bgcolor: 'black' }}>
                                <Player
                                    url={formatVideoUrl(block.body)}
                                    width="100%"
                                    height="100%"
                                    controls
                                    playing={isPlaying}
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                                />
                            </Box>
                        )}

                        {/* TYPE: TEST / QUIZ */}
                        {block.contentType === 'test' && block.test && (
                            <QuizViewer
                                data={block.test}
                                lessonId={lessonId}
                                onFinish={(score, passed) => handleQuizFinish(block.id, score, passed)}
                                // Disable the quiz if the lesson is already done
                                isLocked={isDone} 
                            />
                        )}
                    </Box>
                ))}

                {/* --- COMPLETION SECTION --- */}
                <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                    {!allTestsPassed && !isDone && (
                        <Typography variant="body2" sx={{ color: '#fb7185', mb: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
                            <Lock sx={{ fontSize: 16 }} /> Please pass all quizzes to finish this lesson.
                        </Typography>
                    )}

                    <Button
                        variant={isDone ? "outlined" : "contained"}
                        color={isDone ? "success" : "primary"}
                        size="large"
                        disabled={isCompleting || (isDone ? false : !allTestsPassed)}
                        onClick={handleMarkAsComplete}
                        sx={{ borderRadius: 3, px: 8, py: 1.5, fontWeight: 700 }}
                    >
                        {isCompleting ? <CircularProgress size={24} color="inherit" /> :
                         isDone ? "Completed ✓" : "Mark as Completed"}
                    </Button>
                </Box>
            </Stack>
        </Box>
    );
};

export default LessonContentViewer;