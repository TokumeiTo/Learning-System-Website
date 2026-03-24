import React from 'react';
import { Typography, Button, Stack, Paper } from '@mui/material';
import { AutoStories, OpenInNew } from '@mui/icons-material';
import type { RoadmapStep } from '../../types_interfaces/roadmap';
import { useNavigate } from 'react-router-dom';

interface NodeItemProps {
    step: RoadmapStep;
    onComplete: () => void;
}

const RoadmapNodeItem: React.FC<NodeItemProps> = ({ step, onComplete }) => {
    const navigate = useNavigate();

    const renderAction = () => {
        switch (step.nodeType) {
            case 'EBook':
                return (
                    <Button 
                        variant="contained" 
                        startIcon={<AutoStories />}
                        onClick={() => navigate(`/library`)}
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        Open Library
                    </Button>
                );
            case 'Course':
                return (
                    <Button 
                        variant="outlined" 
                        startIcon={<OpenInNew />}
                        href={step.content?.startsWith('http') ? step.content : '#'}
                        target="_blank"
                        sx={{ borderRadius: 2, fontWeight: 700 }}
                    >
                        View External Course
                    </Button>
                );
            default:
                return null;
        }
    };

    return (
        <Paper elevation={0} sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 4, border: '1px solid #e2e8f0' }}>
            <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 3, color: 'text.secondary', lineHeight: 1.7 }}>
                {step.content || "No specific instructions provided."}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
                {renderAction()}
                <Button 
                    onClick={onComplete}
                    sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}
                >
                    Mark as Done
                </Button>
            </Stack>
        </Paper>
    );
};

export default RoadmapNodeItem;