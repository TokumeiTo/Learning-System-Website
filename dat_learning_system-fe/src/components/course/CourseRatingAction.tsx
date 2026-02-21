import React, { useState } from 'react';
import { Box, Typography, Stack, Rating, TextField, Button, CircularProgress } from '@mui/material';
import { submitCourseRating } from '../../api/rating.api';
import type { SubmitRatingDto } from '../../types/rating';

interface CourseRatingActionProps {
    courseId: string;
    initialRating?: number;
    onSuccess?: () => void; // To refresh the course data after rating
}

const CourseRatingAction: React.FC<CourseRatingActionProps> = ({ courseId, initialRating = 0, onSuccess }) => {
    const [score, setScore] = useState<number | null>(initialRating);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!score) return;
        setLoading(true);
        try {
            await submitCourseRating(courseId, { score, comment });
            if (onSuccess) onSuccess();
            // Reset or show success state
        } catch (error) {
            console.error("Failed to submit rating", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 2, bgcolor: 'background.default', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" fontWeight={900} gutterBottom>
                Rate this Course
            </Typography>
            
            <Stack spacing={2}>
                <Rating 
                    value={score} 
                    onChange={(_, newValue) => setScore(newValue)} 
                    size="large"
                />
                
                <TextField
                    fullWidth
                    multiline
                    rows={2}
                    placeholder="Share your experience (optional)..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    variant="outlined"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />

                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!score || loading}
                    startIcon={loading && <CircularProgress size={20} color="inherit" />}
                    sx={{ borderRadius: 2, fontWeight: 800, alignSelf: 'flex-end' }}
                >
                    {loading ? 'Submitting...' : 'Submit Review'}
                </Button>
            </Stack>
        </Box>
    );
};

export default CourseRatingAction;