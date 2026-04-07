import React, { useState } from 'react';
import { TextField, Stack, Typography, Button } from '@mui/material';
import { Save } from '@mui/icons-material';
import type { RoadmapRequest } from '../../types_interfaces/roadmap';

interface RoadmapFormProps {
    data?: RoadmapRequest; // Optional for "Create" mode
    onChange?: (updatedFields: Partial<RoadmapRequest>) => void;
    onSubmit?: (payload: RoadmapRequest) => void; // For the List Page Dialog
}

const EMPTY_ROADMAP: RoadmapRequest = {
    title: '',
    description: '',
    targetRole: '',
    linkedResourceId: null
};

const RoadmapForm: React.FC<RoadmapFormProps> = ({ data, onChange, onSubmit }) => {
    // Local state for when we are creating from the List Page Dialog
    const [localData, setLocalData] = useState<RoadmapRequest>(data || EMPTY_ROADMAP);

    const handleChange = (field: keyof RoadmapRequest) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const val = e.target.value;
        if (onChange) {
            onChange({ [field]: val });
        } else {
            setLocalData(prev => ({ ...prev, [field]: val }));
        }
    };

    // Use either the passed data (Edit Page) or local state (List Page)
    const activeData = data || localData;

    return (
        <Stack spacing={3} sx={{ mt: 2 }}>
            <TextField
                label="RoadMap Title"
                fullWidth
                required
                value={activeData.title}
                onChange={handleChange('title')}
            />

            <TextField
                label="Target Role"
                fullWidth
                value={activeData.targetRole || ''}
                onChange={handleChange('targetRole')}
                placeholder="e.g., Junior Developer"
            />

            <TextField
                label="Description"
                fullWidth
                multiline
                rows={4}
                value={activeData.description}
                onChange={handleChange('description')}
            />

            {/* Only show the submit button if an onSubmit handler is provided (Dialog mode) */}
            {onSubmit && (
                <Button 
                    variant="contained" 
                    onClick={() => onSubmit(activeData)}
                    fullWidth
                    sx={{ mt: 2, borderRadius: 3, py: 1.5, fontWeight: 800 }}
                    startIcon={<Save />}
                >
                    Create Blueprint
                </Button>
            )}
        </Stack>
    );
};

export default RoadmapForm;