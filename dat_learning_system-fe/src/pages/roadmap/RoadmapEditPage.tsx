import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Button, Stack,
    Divider, Paper, IconButton
} from '@mui/material';
import { ArrowBack, Save, Map } from '@mui/icons-material';
import { fetchRoadmapById, updateRoadmap } from '../../api/roadmap.api';
import type { RoadmapResponse, RoadmapStep, RoadmapRequest } from '../../types_interfaces/roadmap';
import RoadmapForm from '../../components/roadmap/RoadmapForm';
import RoadmapStepListEditor from '../../components/roadmap/RoadmapStepListEditor';
import PageLayout from '../../components/layout/PageLayout';
import AppLoader from '../../components/feedback/AppLoader'; 

const RoadmapEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data: RoadmapResponse = await fetchRoadmapById(Number(id));
                setRoadmap(data);
            } catch (err) {
                console.error("Failed to load roadmap details");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    // Updates the state when the Form (Title/Desc) changes
    const handleHeaderChange = (updatedHeader: Partial<RoadmapRequest>) => {
        if (!roadmap) return;
        setRoadmap({ ...roadmap, ...updatedHeader });
    };

    // Updates the state when the Step List changes
    const handleUpdateSteps = (newSteps: RoadmapStep[]) => {
        if (!roadmap) return;
        setRoadmap({ ...roadmap, steps: newSteps });
    };

    const handleSaveAll = async () => {
        if (!roadmap || !id) return;
        try {
            setSaving(true);
            await updateRoadmap(Number(id), roadmap);
            alert("Blueprint updated successfully!");
            navigate('/roadmaps');
        } catch (err) {
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <PageLayout>
                <AppLoader kanji="編" /> 
            </PageLayout>
        );
    }

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
                {/* Unified Header with Save Action */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton onClick={() => navigate('/roadmaps')} sx={{ border: '1px solid #eee' }}>
                            <ArrowBack />
                        </IconButton>
                        <Box>
                            <Typography variant="h5" fontWeight={900}>Edit RoadMap</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Map sx={{ fontSize: 12 }} /> ID: {id} • {roadmap.steps.length} Milestones
                            </Typography>
                        </Box>
                    </Stack>

                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSaveAll}
                        disabled={saving}
                        sx={{ borderRadius: 3, fontWeight: 800, px: 4, py: 1.2, boxShadow: 3 }}
                    >
                        {saving ? 'Saving...' : 'Save All Changes'}
                    </Button>
                </Stack>

                <Stack spacing={4}>
                    {/* Part 1: General Info (No internal submit button) */}
                    <Paper variant="outlined" sx={{ p: 4, borderRadius: 4, borderStyle: 'dashed', borderWidth: 2 }}>
                        <RoadmapForm
                            data={{
                                title: roadmap.title,
                                description: roadmap.description,
                                targetRole: roadmap.targetRole || ''
                            }}
                            onChange={handleHeaderChange}
                        />
                    </Paper>

                    <Divider />

                    {/* Part 2: Step Editor */}
                    <Box>
                        <Typography variant="h6" fontWeight={800} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            🚀 Path Milestones
                        </Typography>
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