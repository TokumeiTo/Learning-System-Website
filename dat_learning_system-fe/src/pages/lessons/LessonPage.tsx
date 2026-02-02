import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Stack, CircularProgress, Paper } from '@mui/material';
import { fetchClassroomData } from '../../api/classroom.api';
import type { ClassroomView, Lesson } from '../../types/classroom';

const LessonPage = () => {
    const { id } = useParams<{ id: string }>();
    const [data, setData] = useState<ClassroomView | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchClassroomData(id).then(res => {
                setData(res);
                // Default to the first lesson
                if (res.lessons.length > 0) setActiveLesson(res.lessons[0]);
                setLoading(false);
            });
        }
    }, [id]);

    if (loading) return <CircularProgress />;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#0f172a', color: 'white' }}>
            {/* Sidebar: Lessons List */}
            <Paper sx={{ width: 320, bgcolor: 'rgba(255,255,255,0.02)', p: 2, borderRadius: 0 }}>
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 900 }}>{data?.courseTitle}</Typography>
                <Stack spacing={1}>
                    {data?.lessons.map((lesson) => (
                        <Box 
                            key={lesson.id}
                            onClick={() => !lesson.isLocked && setActiveLesson(lesson)}
                            sx={{ 
                                p: 2, borderRadius: 2, cursor: lesson.isLocked ? 'not-allowed' : 'pointer',
                                bgcolor: activeLesson?.id === lesson.id ? 'primary.main' : 'transparent',
                                opacity: lesson.isLocked ? 0.4 : 1
                            }}
                        >
                            <Typography variant="body2" fontWeight={700}>{lesson.title}</Typography>
                            <Typography variant="caption">{lesson.time}</Typography>
                        </Box>
                    ))}
                </Stack>
            </Paper>

            {/* Main: Lesson Content Renderer */}
            <Box sx={{ flex: 1, p: 6, overflowY: 'auto' }}>
                <Typography variant="h4" sx={{ mb: 4, fontWeight: 800 }}>{activeLesson?.title}</Typography>
                <Stack spacing={4}>
                    {activeLesson?.contents.map((content) => (
                        <Box key={content.id}>
                            {content.contentType === 'text' && (
                                <Typography sx={{ whiteSpace: 'pre-wrap', fontSize: '1.1rem', lineHeight: 1.8 }}>
                                    {content.body}
                                </Typography>
                            )}
                            {content.contentType === 'video' && (
                                <Box sx={{ aspectRatio: '16/9', bgcolor: 'black', borderRadius: 4, overflow: 'hidden' }}>
                                    <iframe width="100%" height="100%" src={content.body} frameBorder="0" allowFullScreen />
                                </Box>
                            )}
                            {content.contentType === 'image' && (
                                <Box component="img" src={content.body} sx={{ width: '100%', borderRadius: 4 }} />
                            )}
                        </Box>
                    ))}
                </Stack>
            </Box>
        </Box>
    );
};

export default LessonPage;