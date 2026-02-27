import { Card, CardContent, Stack, Typography,Box } from "@mui/material";
import type { QuestionAnalytic } from "../../types/test";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { motion } from 'framer-motion';

/* --- Difficult Questions Insight --- */
const DifficultQuestionsCard = ({ questions }: { questions: QuestionAnalytic[] }) => (
    <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px 0 rgba(0,0,0,0.05)' }}>
        <CardContent>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <TrendingUpIcon sx={{ color: 'error.main' }} />
                <Typography variant="h6" fontWeight="bold">Top Friction Points</Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={3}>
                Questions students fail most frequently.
            </Typography>
            <Stack spacing={3}>
                {questions.map((q) => (
                    <Box key={q.questionId}>
                        <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" sx={{ maxWidth: '80%' }}>{q.questionText}</Typography>
                            <Typography variant="body2" color="error.main" fontWeight="bold">
                                {q.failureRate}% Fail
                            </Typography>
                        </Stack>
                        <Box sx={{ width: '100%', height: 6, bgcolor: '#f1f5f9', borderRadius: 3, overflow: 'hidden' }}>
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${q.failureRate}%` }}
                                style={{ height: '100%', backgroundColor: '#ef4444' }}
                            />
                        </Box>
                    </Box>
                ))}
            </Stack>
        </CardContent>
    </Card>
);

export default DifficultQuestionsCard;