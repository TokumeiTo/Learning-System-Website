import { memo } from 'react';
import { Box, Typography, RadioGroup, FormControlLabel, Radio, Stack } from '@mui/material';

interface QuizQuestionProps {
    q: any;
    index: number;
    currentAnswer: string;
    submitted: boolean;
    isLocked: boolean;
    // NEW: Pass the answer key from the DTO
    correctAnswerId?: string;
    onAnswer: (questionId: string, value: string) => void;
}

const QuizQuestion = memo(({ q, index, currentAnswer, submitted, isLocked, correctAnswerId, onAnswer }: QuizQuestionProps) => {
    const questionId = q.id || `q-${index}`;

    return (
        <Box sx={{ p: 2, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                <Typography sx={{ color: 'white', fontWeight: 500, flex: 1 }}>
                    {index + 1}. {q.questionText}
                </Typography>

                {/* NEW: Points Badge */}
                <Typography
                    variant="caption"
                    sx={{
                        color: q.points > 40 ? 'yellow' : '#818cf8',
                        bgcolor: q.points > 40 ? '#ffeba4ab' : 'rgba(129, 140, 248, 0.1)',
                        px: 1,
                        py: 0.2,
                        borderRadius: 1,
                        border: '1px solid rgba(129, 140, 248, 0.2)',
                        ml: 2,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {q.points} {q.points === 1 ? 'pt' : 'pts'}
                </Typography>
            </Stack>

            <RadioGroup
                value={currentAnswer || ''}
                onChange={(e) => onAnswer(questionId, e.target.value)}
            >
                {q.options.map((opt: any) => {
                    // Logic Change: Check the prop instead of the option object
                    const isCorrect = correctAnswerId === opt.id || opt.isCorrect;
                    const isSelected = currentAnswer === opt.id;
                    let labelColor = 'rgba(255,255,255,0.7)';

                    if (submitted) {
                        if (isCorrect) labelColor = '#10b981';
                        else if (isSelected) labelColor = '#f43f5e';
                    }

                    return (
                        <FormControlLabel
                            key={opt.id}
                            value={opt.id}
                            disabled={submitted || isLocked}
                            control={<Radio size="small" sx={{ color: 'rgba(255,255,255,0.3)', '&.Mui-checked': { color: '#818cf8' } }} />}
                            sx={{ color: labelColor }}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2">{opt.optionText}</Typography>
                                    {submitted && isCorrect && (
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: '#10b981',
                                                bgcolor: 'rgba(16, 185, 129, 0.1)',
                                                px: 0.8,
                                                py: 0.2,
                                                borderRadius: 0.5,
                                                fontWeight: 700,
                                                fontSize: '0.65rem',
                                                border: '1px solid rgba(16, 185, 129, 0.2)'
                                            }}
                                        >
                                            CORRECT ANSWER
                                        </Typography>
                                    )}
                                </Stack>
                            }
                        />
                    );
                })}
            </RadioGroup>
        </Box>
    );
});

export default QuizQuestion;