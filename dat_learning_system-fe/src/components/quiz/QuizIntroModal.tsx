import { 
    Dialog, 
    DialogContent, 
    Box, 
    Typography, 
    Button, 
    Stack, 
    Divider 
} from "@mui/material";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import TimerIcon from '@mui/icons-material/Timer';
import StarIcon from '@mui/icons-material/Star';
import ListAltIcon from '@mui/icons-material/ListAlt';

import type { JlptTestDto } from "../../types_interfaces/jlptquiz";

interface QuizIntroModalProps {
    test: JlptTestDto;
    onClose: () => void;
    onStart: (testId: string) => void; // This will trigger the API call in the parent
}

export default function QuizIntroModal({ test, onClose, onStart }: QuizIntroModalProps) {
    return (
        <Dialog 
            open={true} 
            onClose={onClose}
            PaperProps={{
                sx: { borderRadius: 5, p: 2, maxWidth: 450 }
            }}
        >
            <DialogContent>
                <Stack spacing={3} alignItems="center">
                    {/* HEADER */}
                    <Box textAlign="center">
                        <Typography variant="overline" color="primary" fontWeight="bold">
                            {test.jlptLevel} • {test.category}
                        </Typography>
                        <Typography variant="h5" fontWeight="800">
                            {test.title}
                        </Typography>
                    </Box>

                    <Divider sx={{ width: '100%' }} />

                    {/* QUIZ DETAILS BOX */}
                    <Box sx={{ 
                        width: '100%', 
                        bgcolor: 'grey.50', 
                        borderRadius: 3, 
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2
                    }}>
                        <Box display="flex" alignItems="center" gap={2}>
                            <ListAltIcon color="action" />
                            <Typography variant="body1">
                                <b>{test.questionCount}</b> Questions
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                            <TimerIcon color="action" />
                            <Typography variant="body1">
                                Passing Score: <b>{test.passingGrade}%</b>
                            </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={2}>
                            <StarIcon sx={{ color: '#FFD700' }} />
                            <Typography variant="body2" color="text.secondary">
                                Includes <b>Star Puzzle</b> (Sentence Scramble)
                            </Typography>
                        </Box>
                    </Box>

                    {/* INSTRUCTIONS */}
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                        Once you click start, the session will be recorded. 
                        Make sure you have a stable connection.
                    </Typography>

                    {/* ACTIONS */}
                    <Box sx={{ 
                        display: 'flex', 
                        gap: 2, 
                        width: '100%', 
                        mt: 1 
                    }}>
                        <Button 
                            fullWidth 
                            variant="outlined" 
                            onClick={onClose}
                            sx={{ borderRadius: 10, py: 1.5 }}
                        >
                            Back
                        </Button>
                        <Button 
                            fullWidth 
                            variant="contained" 
                            startIcon={<PlayCircleOutlineIcon />}
                            onClick={() => onStart(test.id)}
                            sx={{ borderRadius: 10, py: 1.5 }}
                        >
                            Start Quiz
                        </Button>
                    </Box>
                </Stack>
            </DialogContent>
        </Dialog>
    );
}