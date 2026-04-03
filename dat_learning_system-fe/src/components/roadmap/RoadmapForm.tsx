import React from 'react';
import { TextField, Stack, Typography } from '@mui/material';
import type { RoadmapRequest } from '../../types_interfaces/roadmap';

interface RoadmapFormProps {
    /** The current roadmap data from the parent state */
    data: RoadmapRequest;
    /** Callback to update the parent state in real-time */
    onChange: (updatedFields: Partial<RoadmapRequest>) => void;
}

const RoadmapForm: React.FC<RoadmapFormProps> = ({ data, onChange }) => {
    
    // Helper to reduce boilerplate on change events
    const handleChange = (field: keyof RoadmapRequest) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        onChange({ [field]: e.target.value });
    };

    return (
        <Stack spacing={3} sx={{ mt: 2 }}>
            <Typography variant="h6" fontWeight={800} color="primary.main">
                General Information
            </Typography>

            <TextField
                label="RoadMap Title"
                fullWidth
                required
                value={data.title}
                onChange={handleChange('title')}
                placeholder="e.g., N5 Japanese Mastery"
            />

            <TextField
                label="Target Role"
                fullWidth
                value={data.targetRole || ''}
                onChange={handleChange('targetRole')}
                placeholder="e.g., Junior Developer / Student"
            />

            <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={data.description}
                onChange={handleChange('description')}
                placeholder="Describe the learning path..."
            />
        </Stack>
    );
};

export default RoadmapForm;