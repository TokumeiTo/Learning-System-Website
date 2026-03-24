import React, { useState } from 'react';
import { TextField, Button, Stack, Typography } from '@mui/material';
import type { RoadmapRequest } from '../../types_interfaces/roadmap';

interface FormProps {
    onSubmit: (data: RoadmapRequest) => void;
    initialData?: RoadmapRequest;
}

const RoadmapForm: React.FC<FormProps> = ({ onSubmit, initialData }) => {
    const [form, setForm] = useState<RoadmapRequest>(initialData || {
        title: '',
        description: '',
        targetRole: ''
    });

    return (
        <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight={800}>RoadMap Configuration</Typography>
            <TextField
                label="RoadMap Title"
                fullWidth
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g., JLPT N5 Mastery Path"
            />
            <TextField
                label="Target Role / Level"
                fullWidth
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                placeholder="e.g., Junior Developer / N5 Student"
            />
            <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <Button 
                variant="contained" 
                onClick={() => onSubmit(form)}
                disabled={!form.title}
                sx={{ py: 1.5, fontWeight: 800 }}
            >
                Save RoadMaps
            </Button>
        </Stack>
    );
};

export default RoadmapForm;