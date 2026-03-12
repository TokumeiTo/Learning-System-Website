import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Stack, IconButton, Tooltip } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface StarPuzzleProps {
    options: string[]; 
    onSelectionChange: (answer: string) => void;
}

export default function StarPuzzle({ options, onSelectionChange }: StarPuzzleProps) {
    const [shuffledBank, setShuffledBank] = useState<string[]>([]);
    const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null]);

    useEffect(() => {
        handleReset();
    }, [options]);

    const handleReset = () => {
        setShuffledBank([...options]);
        setSlots([null, null, null, null]);
        onSelectionChange("");
    };

    const handlePickWord = (word: string, bankIndex: number) => {
        const firstEmptyIndex = slots.indexOf(null);
        if (firstEmptyIndex === -1) return;

        const newSlots = [...slots];
        newSlots[firstEmptyIndex] = word;
        setSlots(newSlots);

        const newBank = [...shuffledBank];
        newBank.splice(bankIndex, 1);
        setShuffledBank(newBank);

        onSelectionChange(newSlots[2] || "");
    };

    const handleRemoveWord = (word: string, slotIndex: number) => {
        const newSlots = [...slots];
        newSlots[slotIndex] = null;
        
        // Shift words to the left to maintain order
        const remainingWords = newSlots.filter(s => s !== null) as string[];
        const shiftedSlots = [...Array(4)].map((_, i) => remainingWords[i] || null);
        
        setSlots(shiftedSlots);
        setShuffledBank(prev => [...prev, word]);
        
        onSelectionChange(shiftedSlots[2] || "");
    };

    return (
        <Stack spacing={3} alignItems="center" sx={{ mt: 2, width: '100%' }}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                <Tooltip title="Reset Puzzle">
                    <IconButton onClick={handleReset} color="warning" size="small">
                        <RestartAltIcon />
                        <Typography variant="caption" sx={{ ml: 0.5 }}>Clear</Typography>
                    </IconButton>
                </Tooltip>
            </Box>

            {/* THE SENTENCE SLOTS */}
            <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                minHeight: '85px' 
            }}>
                {slots.map((word, idx) => (
                    <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Paper
                            elevation={word ? 3 : 0}
                            onClick={() => word && handleRemoveWord(word, idx)}
                            sx={{
                                width: { xs: 75, sm: 95 },
                                height: 55,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderBottom: word ? 'none' : '4px solid #ddd',
                                bgcolor: word ? 'primary.main' : 'rgba(0,0,0,0.03)',
                                color: word ? 'white' : 'inherit',
                                cursor: word ? 'pointer' : 'default',
                                transition: '0.2s transform, 0.2s background-color',
                                '&:hover': { 
                                    transform: word ? 'scale(1.05)' : 'none',
                                    bgcolor: word ? 'primary.dark' : 'rgba(0,0,0,0.05)' 
                                }
                            }}
                        >
                            <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.2rem' }, fontWeight: 600 }}>
                                {word}
                            </Typography>
                        </Paper>
                        {idx === 2 && (
                            <StarIcon sx={{ color: '#FFD700', fontSize: '1.8rem', mt: 0.5 }} />
                        )}
                    </Box>
                ))}
            </Box>

            <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ fontStyle: 'italic' }}>
                Arrange the blocks. The word in the <b>★</b> position is your answer.
            </Typography>

            {/* THE WORD BANK */}
            <Box sx={{ 
                display: 'flex', 
                gap: 1.5, 
                flexWrap: 'wrap', 
                justifyContent: 'center',
                p: 3,
                bgcolor: '#f8f9fa',
                borderRadius: 3,
                border: '1px dashed #ccc',
                width: '100%'
            }}>
                {shuffledBank.map((word, idx) => (
                    <Button
                        key={idx}
                        variant="outlined"
                        onClick={() => handlePickWord(word, idx)}
                        sx={{ 
                            borderRadius: 2, 
                            textTransform: 'none', 
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            px: 3,
                            py: 1,
                            bgcolor: 'white',
                            borderColor: '#ddd',
                            color: 'text.primary',
                            '&:hover': { bgcolor: '#fff', borderColor: 'primary.main' }
                        }}
                    >
                        {word}
                    </Button>
                ))}
            </Box>
        </Stack>
    );
}