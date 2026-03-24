import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Stack
} from '@mui/material';
import type { RoadmapStep } from '../../types_interfaces/roadmap';
import type { EBook } from '../../types_interfaces/library';
// Import from your existing API layer
import { fetchAllBooks } from '../../api/library.api';

interface StepModalProps {
    open: boolean;
    onClose: () => void;
    onSave: (step: RoadmapStep) => void;
    initialData?: RoadmapStep;
}

const RoadmapStepModal: React.FC<StepModalProps> = ({ open, onClose, onSave, initialData }) => {
    const [step, setStep] = useState<RoadmapStep>(initialData || {
        id: 0,
        title: '',
        nodeType: 'Instruction',
        content: '',
        linkedResourceId: undefined,
        sortOrder: 0
    });

    const [books, setBooks] = useState<EBook[]>([]);
    const [loadingBooks, setLoadingBooks] = useState(false);

    useEffect(() => {
        const loadBooks = async () => {
            if (open && step.nodeType === 'EBook') {
                setLoadingBooks(true);
                try {
                    // Using your fetchAllBooks with a large pageSize for the Admin picker
                    const response = await fetchAllBooks(1, 100);
                    setBooks(response.items); // Accessing .items from PagedLibraryResponse
                } catch (err) {
                    console.error("Failed to load books for roadmap editor", err);
                } finally {
                    setLoadingBooks(false);
                }
            }
        };
        loadBooks();
    }, [open, step.nodeType]);

    const handleSave = () => {
        onSave(step);
        onClose();
    };

    return (
        <Dialog
            open={open} onClose={onClose} disableEnforceFocus
            disableAutoFocus={false} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: 4 } }}
        >
            <DialogTitle sx={{ fontWeight: 900 }}>
                {initialData ? 'Edit Milestone' : 'New Milestone'}
            </DialogTitle>
            <DialogContent>
                <Stack spacing={3} sx={{ mt: 1 }}>
                    <TextField
                        label="Step Title"
                        fullWidth
                        value={step.title}
                        onChange={(e) => setStep({ ...step, title: e.target.value })}
                    />

                    <TextField
                        select
                        label="Step Type"
                        value={step.nodeType}
                        onChange={(e) => setStep({ ...step, nodeType: e.target.value as any, linkedResourceId: undefined })}
                    >
                        <MenuItem value="Instruction">Manual Instruction</MenuItem>
                        <MenuItem value="EBook">Library Resource (EBook)</MenuItem>
                        <MenuItem value="Course">External Link (Course)</MenuItem>
                    </TextField>

                    {step.nodeType === 'EBook' && (
                        <TextField
                            select
                            label="Select EBook"
                            fullWidth
                            value={step.linkedResourceId || ''}
                            onChange={(e) => setStep({ ...step, linkedResourceId: Number(e.target.value) })}
                            disabled={loadingBooks}
                            helperText={loadingBooks ? "Loading library..." : "Choose a book to link to this step"}
                        >
                            {books.map((book) => (
                                <MenuItem key={book.id} value={book.id}>
                                    {book.title}
                                </MenuItem>
                            ))}
                        </TextField>
                    )}

                    <TextField
                        label={step.nodeType === 'Course' ? 'Course URL' : 'Content / Instructions'}
                        multiline
                        rows={3}
                        fullWidth
                        value={step.content}
                        onChange={(e) => setStep({ ...step, content: e.target.value })}
                    />
                </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="inherit" sx={{ fontWeight: 700 }}>Cancel</Button>
                <Button variant="contained" onClick={handleSave} disabled={!step.title} sx={{ fontWeight: 800 }}>
                    Confirm
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RoadmapStepModal;