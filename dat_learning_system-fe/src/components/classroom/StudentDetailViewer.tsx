import { useEffect, useState } from 'react';
import {
    getCourseProgressForUser,
    getCourseAttemptsForUser,
    type LessonProgress,
    type LessonAttempt
} from '../../api/lessonProgress.api';
import {
    Box, Chip, Table, TableBody, TableCell, TableHead,
    TableRow, Typography, Paper, Divider, Stack
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import HistoryIcon from '@mui/icons-material/History';

import { formatDuration } from '../../utils/dateUtils';
import AppLoader from '../feedback/AppLoader';

interface LessonMap {
    [id: string]: string;
}

interface Props {
    userId: string;
    courseId: string;
    lessonMap: LessonMap;
}

const StudentDetailViewer = ({ userId, courseId, lessonMap }: Props) => {
    const [progressList, setProgressList] = useState<LessonProgress[]>([]);
    const [attempts, setAttempts] = useState<LessonAttempt[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadAllData = async () => {
            setLoading(true);
            try {
                const [progressData, attemptData] = await Promise.all([
                    getCourseProgressForUser(courseId, userId),
                    getCourseAttemptsForUser(courseId, userId)
                ]);
                setProgressList(progressData);
                setAttempts(attemptData);
            } catch (err) {
                console.error("Error loading student detail:", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId && courseId) loadAllData();
    }, [userId, courseId]);

    if (loading) return <AppLoader kanji="調" />;

    const totalSeconds = progressList.reduce((acc, curr) => acc + curr.timeSpentSeconds, 0);
    const completedLessons = progressList.filter(p => p.isCompleted).length;

    return (
        <Box sx={{ color: '#f8fafc', p: 1 }}>
            {/* --- Summary Cards Section (Using Stack instead of Grid) --- */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                <Paper sx={{
                    flex: 1, p: 2,
                    bgcolor: 'rgba(56, 189, 248, 0.05)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '12px'
                }}>
                    <Typography variant="caption" sx={{ color: '#38bdf8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessTimeIcon sx={{ fontSize: 16 }} /> TOTAL TIME SPENT
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
                        {formatDuration(totalSeconds)}
                    </Typography>
                </Paper>

                <Paper sx={{
                    flex: 1, p: 2,
                    bgcolor: 'rgba(74, 222, 128, 0.05)',
                    border: '1px solid rgba(74, 222, 128, 0.2)',
                    borderRadius: '12px'
                }}>
                    <Typography variant="caption" sx={{ color: '#4ade80', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AssignmentTurnedInIcon sx={{ fontSize: 16 }} /> COMPLETION
                    </Typography>
                    <Typography variant="h5" sx={{ mt: 0.5, fontWeight: 800 }}>
                        {completedLessons} <span style={{ fontSize: '0.9rem', opacity: 0.5 }}>/ {Object.keys(lessonMap).length} Lessons</span>
                    </Typography>
                </Paper>
            </Stack>

            {/* --- Lesson Engagement --- */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                    <AnalyticsIcon sx={{ fontSize: 18 }} /> Attendance & Activity
                </Typography>
                {attempts.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', py: 4, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        No test data available for this course.
                    </Typography>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ '& th': { color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)', py: 1.5 } }}>
                                <TableCell>Lesson</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="right">Duration</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {progressList.map((progress) => (
                                <TableRow key={progress.lessonId} hover sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.05)', py: 2 } }}>
                                    <TableCell sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                                        {lessonMap[progress.lessonId] || `Lesson ID: ${progress.lessonId.substring(0, 4)}`}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={progress.isCompleted ? "DONE" : "PENDING"}
                                            size="small"
                                            sx={{
                                                height: '20px', fontSize: '0.65rem', fontWeight: 900,
                                                bgcolor: progress.isCompleted ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255,255,255,0.05)',
                                                color: progress.isCompleted ? '#4ade80' : 'rgba(255,255,255,0.4)',
                                                border: progress.isCompleted ? '1px solid rgba(74, 222, 128, 0.2)' : '1px solid rgba(255,255,255,0.1)'
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell align="right" sx={{ color: '#94a3b8', fontFamily: 'monospace' }}>
                                        {formatDuration(progress.timeSpentSeconds)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>

            <Divider sx={{ mb: 4, bgcolor: 'rgba(255,255,255,0.05)' }} />

            {/* --- Quiz Results --- */}
            <Box>
                <Typography variant="subtitle2" sx={{ mb: 2, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                    <HistoryIcon sx={{ fontSize: 18 }} /> Test History
                </Typography>
                {attempts.length === 0 ? (
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', py: 4, bgcolor: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                        No test data available for this course.
                    </Typography>
                ) : (
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ '& th': { color: 'rgba(255,255,255,0.3)', borderBottom: '1px solid rgba(255,255,255,0.1)' } }}>
                                <TableCell>Test</TableCell>
                                <TableCell align="center">Score</TableCell>
                                <TableCell align="center">Total Attempts</TableCell>
                                <TableCell align="center">Outcome</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attempts.map((attempt, index) => (
                                <TableRow
                                    key={attempt.id || `attempt-${index}`}
                                    hover
                                    sx={{ '& td': { borderBottom: '1px solid rgba(255,255,255,0.05)', py: 2 } }}
                                >
                                    <TableCell sx={{ color: '#f1f5f9' }}>
                                        {lessonMap[attempt.lessonId ?? ''] || "Final Assessment"}
                                    </TableCell>

                                    <TableCell align="center">
                                        <Box>
                                            <Typography variant="body2" sx={{
                                                fontWeight: 700,
                                                color: attempt.percentage >= 80 ? '#4ade80' : attempt.percentage >= 50 ? '#fbbf24' : '#f87171'
                                            }}>
                                                {attempt.score} / {attempt.maxScore}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.4)', display: 'block', mt: -0.5 }}>
                                                {attempt.percentage}%
                                            </Typography>
                                        </Box>
                                    </TableCell>

                                    <TableCell align="center" sx={{ color: '#f1f5f9' }}>
                                        {attempt.attempts}
                                    </TableCell>

                                    {/* FIX: Wrapped the outcome in a TableCell */}
                                    <TableCell align="center">
                                        <Typography variant="caption" sx={{
                                            color: attempt.isPassed ? '#4ade80' : '#f87171',
                                            fontWeight: 600,
                                            textTransform: 'uppercase'
                                        }}>
                                            {attempt.isPassed ? "Passed" : 'Failed'}
                                        </Typography>
                                    </TableCell>

                                    <TableCell align="right" sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>
                                        {new Date(attempt.attemptedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Box>
        </Box>
    );
};

export default StudentDetailViewer;