import React, { useEffect, useState } from 'react';
import {
    Box, Typography, List, ListItem, ListItemAvatar,
    ListItemText, Avatar, Chip, LinearProgress,
    IconButton, Tooltip, CircularProgress, Button
} from '@mui/material';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import PersonIcon from '@mui/icons-material/Person';
import { fetchEnrolledStudents } from '../../api/classroom.api';
import type { CourseStudent } from '../../types_interfaces/classroom';

interface Props {
    courseId: string;
}

const StudentListTab = ({ courseId }: Props) => {
    const [students, setStudents] = useState<CourseStudent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStudents = async () => {
            try {
                const data = await fetchEnrolledStudents(courseId);
                setStudents(data);
            } catch (err) {
                console.error("Failed to load students", err);
            } finally {
                setLoading(false);
            }
        };
        loadStudents();
    }, [courseId]);

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={24} />
        </Box>
    );

    if (students.length === 0) return (
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center', p: 4 }}>
            No students enrolled in this course yet.
        </Typography>
    );

    return (
        <List sx={{ width: '100%', bgcolor: 'transparent' }}>
            {students.map((student) => (
                <ListItem
                    key={student.userId}
                    sx={{
                        mb: 1,
                        borderRadius: 2,
                        bgcolor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' }
                    }}
                    secondaryAction={
                        <Tooltip title={student.isCompleted ? "Issue Certificate" : "Course Incomplete"}>
                            <span>
                                <IconButton
                                    edge="end"
                                    color="primary"
                                    disabled={!student.isCompleted}
                                    onClick={() => console.log("Generating cert for:", student.userId)}
                                >
                                    <CardMembershipIcon />
                                </IconButton>
                            </span>
                        </Tooltip>
                    }
                >
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#334155' }}>
                            <PersonIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Box sx={{  gap: 1 }}>
                                <Box sx={{display: 'flex',flexDirection:'row', alignItems: 'center', gap:2}}>
                                    <Typography variant="subtitle2" sx={{ color: '#f8fafc' }}>
                                        {student.fullName}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                                        ({student.companyCode})
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                                    {student.email}
                                </Typography>
                            </Box>
                        }
                        secondary={
                            <Box sx={{ mt: 0.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                        Progress
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: student.isCompleted ? '#4ade80' : '#818cf8' }}>
                                        {student.progressPercentage}%
                                    </Typography>
                                </Box>
                                <LinearProgress
                                    variant="determinate"
                                    value={student.progressPercentage}
                                    sx={{
                                        height: 4,
                                        borderRadius: 2,
                                        bgcolor: 'rgba(255,255,255,0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: student.isCompleted ? '#4ade80' : '#6366f1'
                                        }
                                    }}
                                />
                            </Box>
                        }
                    />
                </ListItem>
            ))}
        </List>
    );
};

export default StudentListTab;