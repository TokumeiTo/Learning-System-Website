import React, { useState } from 'react';
import { Box, IconButton, List, ListItem, ListItemText, Typography, Paper, Button, Stack } from '@mui/material';
import { ArrowUpward, ArrowDownward, Delete, Add } from '@mui/icons-material';
import type { RoadmapStep } from '../../types_interfaces/roadmap';
import RoadmapStepModal from './RoadmapStepModal';

interface EditorProps {
    steps: RoadmapStep[];
    onUpdateSteps: (steps: RoadmapStep[]) => void;
}

const StepListEditor: React.FC<EditorProps> = ({ steps, onUpdateSteps }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const handleAddStep = (newStep: RoadmapStep) => {
        const stepWithOrder = {
            ...newStep,
            sortOrder: steps.length + 1
        };
        onUpdateSteps([...steps, stepWithOrder]);
    };

    const removeStep = (index: number) => {
        const filtered = steps.filter((_, i) => i !== index);
        // Re-index to keep sortOrder clean
        const updated = filtered.map((s, i) => ({ ...s, sortOrder: i + 1 }));
        onUpdateSteps(updated);
    };

    const moveStep = (index: number, direction: 'up' | 'down') => {
        const newSteps = [...steps];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= steps.length) return;

        [newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]];

        // Re-assign sort orders based on new positions
        const finalizedSteps = newSteps.map((s, i) => ({ ...s, sortOrder: i + 1 }));
        onUpdateSteps(finalizedSteps);
    };

    return (
        <Box sx={{ mt: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="subtitle1" fontWeight={800}>Milestones ({steps.length})</Typography>
                <Button
                    startIcon={<Add />}
                    size="small"
                    variant="outlined"
                    onClick={() => setModalOpen(true)}
                >
                    Add Step
                </Button>
            </Stack>

            <List>
                {steps.sort((a, b) => a.sortOrder - b.sortOrder).map((step, index) => (
                    <Paper key={step.id || index} variant="outlined" sx={{ mb: 1, borderRadius: 2 }}>
                        <ListItem secondaryAction={
                            <Stack direction="row">
                                <IconButton size="small" onClick={() => moveStep(index, 'up')} disabled={index === 0}>
                                    <ArrowUpward fontSize="small" />
                                </IconButton>
                                <IconButton size="small" onClick={() => moveStep(index, 'down')} disabled={index === steps.length - 1}>
                                    <ArrowDownward fontSize="small" />
                                </IconButton>
                                <IconButton size="small" color="error" onClick={() => removeStep(index)}>
                                    <Delete fontSize="small" />
                                </IconButton>
                            </Stack>
                        }>
                            <ListItemText
                                primary={step.title}
                                // HIGHLIGHT: Use slotProps to target the secondary typography component
                                slotProps={{
                                    secondary: {
                                        component: 'div', // This prevents the <p> vs <div> error
                                        variant: 'body2',
                                        sx: { color: 'text.secondary' } // You can even move styles here
                                    },
                                    primary: {
                                        fontWeight: 700
                                    }
                                }}
                                secondary={
                                    <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                        <Typography variant="caption" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                            {step.nodeType}
                                        </Typography>
                                        {step.linkedResourceId && (
                                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                                • Linked: {step.linkedResourceId}
                                            </Typography>
                                        )}
                                        <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                            • Order: {step.sortOrder}
                                        </Typography>
                                    </Stack>
                                }
                            />
                        </ListItem>
                    </Paper>
                ))}
            </List>

            <RoadmapStepModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleAddStep}
            />
        </Box>
    );
};

export default StepListEditor;