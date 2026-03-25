import React, { useState, useEffect, useRef } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Stack, Autocomplete, CircularProgress, Typography, Box, Chip
} from '@mui/material';
import type { RoadmapStep, RoadmapGlobalSourceDto } from '../../types_interfaces/roadmap';
import { searchRoadmapResources } from '../../api/roadmap.api';

interface StepModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (step: RoadmapStep) => void;
    initialData?: RoadmapStep;
}

const RoadmapStepModal: React.FC<StepModalProps> = ({ open, onClose, onSave, initialData }) => {
    // 1. Refs for raw text (typing here triggers 0 re-renders)
    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLInputElement>(null);

    // 2. State ONLY for UI logic (type switching & search)
    const [nodeType, setNodeType] = useState<RoadmapStep['nodeType']>(initialData?.nodeType || 'Instruction');
    const [linkedResourceId, setLinkedResourceId] = useState(initialData?.linkedResourceId || '');
    const [options, setOptions] = useState<RoadmapGlobalSourceDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Sync state if initialData changes (for Edit mode)
    useEffect(() => {
        if (initialData) {
            setNodeType(initialData.nodeType);
            setLinkedResourceId(initialData.linkedResourceId || '');
        }
    }, [initialData]);

    // 3. Debounced Search Logic
    useEffect(() => {
        if (searchQuery.length < 2 || nodeType === 'Instruction') {
            setOptions([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const results = await searchRoadmapResources(searchQuery, nodeType);
                setOptions(results);
            } catch (err) {
                console.error("Search failed", err);
            } finally {
                setLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [searchQuery, nodeType]);

    const handleSave = () => {
        const finalStep: RoadmapStep = {
            ...initialData, // Keep existing ID/sortOrder
            id: initialData?.id || 0,
            title: titleRef.current?.value || '',
            content: contentRef.current?.value || '',
            nodeType: nodeType,
            linkedResourceId: linkedResourceId,
            sortOrder: initialData?.sortOrder || 0
        };

        if (!finalStep.title) return; // Basic validation
        onSave(finalStep);
        onClose();
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            fullWidth 
            maxWidth="xs"
            PaperProps={{ sx: { borderRadius: 4 } }}
        >
            <DialogTitle sx={{ fontWeight: 900 }}>
                {initialData ? 'Edit Milestone' : 'New Milestone'}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    {/* UNCONTROLLED TITLE */}
                    <TextField
                        inputRef={titleRef}
                        label="Step Title"
                        fullWidth
                        defaultValue={initialData?.title || ''}
                    />

                    {/* CONTROLLED TYPE (Required for UI logic) */}
                    <TextField
                        select
                        label="Step Type"
                        value={nodeType}
                        onChange={(e) => {
                            setNodeType(e.target.value as any);
                            setLinkedResourceId(''); // Reset link on type change
                            setOptions([]);
                        }}
                    >
                        <MenuItem value="Instruction">Manual Instruction</MenuItem>
                        <MenuItem value="EBook">Library Resource (EBook)</MenuItem>
                        <MenuItem value="Course">External Link (Course)</MenuItem>
                    </TextField>

                    {/* SEARCH BOX (Only shows if needed) */}
                    {nodeType !== 'Instruction' && (
                        <Autocomplete
                            options={options}
                            loading={loading}
                            getOptionLabel={(option) => option.title}
                            onInputChange={(_, value) => setSearchQuery(value)}
                            onChange={(_, newValue) => setLinkedResourceId(newValue?.value || '')}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={`Link ${nodeType}`}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <>
                                                {loading ? <CircularProgress size={20} /> : null}
                                                {params.InputProps.endAdornment}
                                            </>
                                        ),
                                    }}
                                />
                            )}
                            renderOption={(props, option) => (
                                <Box component="li" {...props} key={option.value}>
                                    <Stack>
                                        <Typography variant="body2" fontWeight={700}>{option.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">{option.description}</Typography>
                                    </Stack>
                                </Box>
                            )}
                        />
                    )}

                    {/* UNCONTROLLED CONTENT */}
                    <TextField
                        inputRef={contentRef}
                        label="Instructions"
                        multiline
                        rows={4}
                        fullWidth
                        defaultValue={initialData?.content || ''}
                    />
                </Stack>
            </DialogContent>

            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button variant="contained" onClick={handleSave} sx={{ fontWeight: 800 }}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoadmapStepModal;