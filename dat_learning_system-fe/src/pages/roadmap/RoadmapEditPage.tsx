import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Stack,
    Divider, Paper, IconButton
} from '@mui/material';
import { ArrowBack, Save } from '@mui/icons-material';
import { fetchRoadmapById, updateRoadmap } from '../../api/roadmap.api';
import type { RoadmapResponse, RoadmapStep } from '../../types_interfaces/roadmap';
import RoadmapForm from '../../components/roadmap/RoadmapForm';
import RoadmapStepListEditor from '../../components/roadmap/RoadmapStepListEditor';
import PageLayout from '../../components/layout/PageLayout';
// Import your new loader
import AppLoader from '../../components/feedback/AppLoader'; 

const RoadmapEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
    const [loading, setLoading] = useState(true); // Added loading state

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await fetchRoadmapById(Number(id));
                setRoadmap(data);
            } catch (err) {
                console.error("Failed to load roadmap details");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    const handleUpdateSteps = (newSteps: RoadmapStep[]) => {
        if (!roadmap) return;
        setRoadmap({ ...roadmap, steps: newSteps });
    };

    const handleSaveAll = async () => {
        if (!roadmap || !id) return;
        try {
            await updateRoadmap(Number(id), roadmap);
            alert("Blueprint updated successfully!");
            navigate('/roadmaps');
        } catch (err) {
            alert("Failed to save changes.");
        }
    };

    // 1. Show your custom AppLoader while fetching
    if (loading) {
        return (
            <PageLayout>
                <AppLoader kanji="編" /> 
            </PageLayout>
        );
    }

    // 2. Handle the case where the ID actually doesn't exist in DB
    if (!roadmap) {
        return (
            <PageLayout>
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Typography variant="h6">RoadMap not found.</Typography>
                    <Button onClick={() => navigate('/roadmaps')}>Back to List</Button>
                </Box>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Container maxWidth="md" sx={{ py: 6 }}>
                {/* Header and Content remain the same... */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton onClick={() => navigate('/roadmaps')}>
                            <ArrowBack />
                        </IconButton>
                        <Box>
                            <Typography variant="h5" fontWeight={900}>Edit RoadMap</Typography>
                            <Typography variant="caption" color="text.secondary">
                                ID: {id} • {roadmap.steps.length} Milestones
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSaveAll}
                        sx={{ borderRadius: 3, fontWeight: 800, px: 3 }}
                    >
                        Save All Changes
                    </Button>
                </Stack>

                <Stack spacing={4}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 4 }}>
                        <RoadmapForm
                            initialData={{
                                title: roadmap.title,
                                description: roadmap.description,
                                targetRole: roadmap.targetRole
                            }}
                            onSubmit={(data) => setRoadmap({ ...roadmap, ...data })}
                        />
                    </Paper>

                    <Divider />

                    <Box>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2 }}> Path Milestones</Typography>
                        <RoadmapStepListEditor
                            steps={roadmap.steps}
                            onUpdateSteps={handleUpdateSteps}
                        />
                    </Box>
                </Stack>
            </Container>
        </PageLayout>
    );
};

export default RoadmapEditPage;