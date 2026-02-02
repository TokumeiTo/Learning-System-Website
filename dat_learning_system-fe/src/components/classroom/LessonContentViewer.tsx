import { Box, Typography, Stack, Paper } from '@mui/material';
import { AutoStories } from '@mui/icons-material'; 
import type { LessonContent } from '../../types/classroom';

const LessonContentViewer = ({ contents }: { contents: LessonContent[] }) => {
    // --- EMPTY STATE DESIGN ---
    if (!contents || contents.length === 0) {
        return (
            <Paper 
                sx={{ 
                    py: 10, 
                    px: 3, 
                    bgcolor: 'transparent', 
                    border: '2px dashed rgba(255,255,255,0.05)',
                    borderRadius: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <AutoStories sx={{ fontSize: 60, color: 'rgba(99, 101, 241, 0.47)', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'rgb(255, 255, 255)', fontWeight: 600 }}>
                    No Lesson Content Yet
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.59)' }}>
                    The instructor hasn't added any materials to this lesson.
                </Typography>
            </Paper>
        );
    }

    // --- CONTENT RENDERER ---
    return (
        <Box sx={{ maxWidth: '100%' }}>
            <Stack> {/* Increased spacing to 4 for better readability */}
                {contents.map((block) => (
                    <Box key={block.id}>
                        {/* --- RENDER TEXT --- */}
                        {block.contentType === 'text' && (
                            <Typography
                                sx={{
                                    color: 'white',
                                    lineHeight: 1.8,
                                    fontSize: '1.1rem',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}
                            >
                                {block.body}
                            </Typography>
                        )}

                        {/* --- RENDER IMAGE --- */}
                        {block.contentType === 'image' && block.body && (
                            <Box
                                component="img"
                                src={block.body}
                                sx={{
                                    mx: 'auto',
                                    my: '20px',
                                    width: '70%',
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgb(255, 255, 255)',
                                    display: 'block'
                                }}
                                alt="Lesson content"
                            />
                        )}

                        {/* --- RENDER VIDEO --- */}
                        {block.contentType === 'video' && block.body && (
                            <Box
                                sx={{
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    borderRadius: 3,
                                    overflow: 'hidden',
                                    bgcolor: 'black',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                                }}
                            >
                                {block.body.startsWith('data:video') || (block.body.startsWith('http') && !block.body.includes('youtube') && !block.body.includes('vimeo')) ? (
                                    <video 
                                        src={block.body} 
                                        controls 
                                        style={{ width: '100%', height: '100%' }} 
                                    />
                                ) : (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        src={block.body.replace("watch?v=", "embed/")}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                )}
                            </Box>
                        )}
                    </Box>
                ))}
            </Stack>
        </Box>
    );
};

export default LessonContentViewer;