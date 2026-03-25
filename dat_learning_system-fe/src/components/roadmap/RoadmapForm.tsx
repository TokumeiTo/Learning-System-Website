import React, { useState } from 'react';
import { TextField, Stack, Typography, Button } from '@mui/material';
import type { RoadmapRequest } from '../../types_interfaces/roadmap';

interface RoadmapFormProps {
    onSubmit: (payload: RoadmapRequest) => void;
    initialData?: RoadmapRequest;
}

const RoadmapForm: React.FC<RoadmapFormProps> = ({ onSubmit, initialData }) => {
    // Internal state initialized with initialData or defaults
    const [formData, setFormData] = useState<RoadmapRequest>(initialData || {
        title: '',
        targetRole: '',
        description: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Stack component="form" onSubmit={handleSubmit} spacing={3} sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight={800}>General Information</Typography>
            
            <TextField
                label="RoadMap Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />

            <TextField
                label="Target Role"
                fullWidth
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
            />

            <TextField
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />

            <Button 
                type="submit" 
                variant="contained" 
                size="large" 
                sx={{ fontWeight: 800, borderRadius: 2, py: 1.5 }}
            >
                Save Roadmap
            </Button>
        </Stack>
    );
};

export default RoadmapForm;