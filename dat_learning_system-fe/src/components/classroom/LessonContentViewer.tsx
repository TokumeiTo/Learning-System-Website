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
    lastScore?: number | null;
    onComplete?: () => void;
}

const LessonContentViewer = ({ contents, lessonId, isDone, lastScore, onComplete }: Props) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleting, setIsCompleting] = useState(false);

    // Initialize completed quizzes based on content status if the backend provides it
    const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});

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
                                sx={{ borderRadius: 3, boxShadow: 4, display: 'block', m: 'auto' }}
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
                    {!allTestsPassed && !isDone && contents.some(c=>c.contentType === 'test') && (
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
        </Box>
    );
};

export default LessonContentViewer;