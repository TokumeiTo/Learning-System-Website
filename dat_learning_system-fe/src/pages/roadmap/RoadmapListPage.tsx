import React, { useEffect, useState } from 'react';
import {
    Container, Box, Typography, Stack, Alert,
    Fab, Dialog, DialogContent, DialogTitle
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { fetchAllRoadmaps, createRoadmap } from '../../api/roadmap.api';
import type { RoadmapResponse } from '../../types_interfaces/roadmap';
import RoadmapCard from '../../components/roadmap/RoadmapCard';
import LearningTip from '../../components/ebooks/LearningTip';
import RoadmapForm from '../../components/roadmap/RoadmapForm';
import PageLayout from '../../components/layout/PageLayout';
import { useAuth } from '../../hooks/useAuth';

const RoadmapListPage: React.FC = () => {
    const [roadmaps, setRoadmaps] = useState<RoadmapResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [openForm, setOpenForm] = useState(false);
    const { isAdmin } = useAuth();

    const loadData = async () => {
        try {
            const data = await fetchAllRoadmaps();
            setRoadmaps(data);
        } catch (err) {
            setError("Failed to load roadmaps. Please check your connection.");
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleCreateSubmit = async (payload: any) => {
        try {
            await createRoadmap(payload);
            setOpenForm(false);
            await loadData();
        } catch (err) {
            console.error("Error creating RoadMap:", err);
        }
    };

    return (
        <PageLayout>
            <Container maxWidth="md" sx={{ py: 6 }}>
                {/* Header Section */}
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h4" fontWeight={900} gutterBottom>
                        RoadMaps
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Select a structured path to guide your professional growth or JLPT progress.
                    </Typography>
                </Box>

                {/* Optional Learning Tip at the top */}
                <LearningTip tip="Roadmaps are designed by Admins to give you the most efficient learning sequence. Follow them step-by-step!" />

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                {/* THE STACK (Instead of Grid) */}
                <Stack spacing={2}>
                    {roadmaps.map((roadmap) => (
                        <RoadmapCard
                            key={roadmap.id}
                            roadmap={roadmap}
                            isAdmin={isAdmin}
                            onRefresh={loadData}
                        />
                    ))}
                </Stack>

                {isAdmin && (
                    <Fab
                        color="primary"
                        onClick={() => setOpenForm(true)}
                        sx={{ position: 'fixed', bottom: 32, right: 32, boxShadow: 4 }}
                    >
                        <AddIcon />
                    </Fab>
                )}

                <Dialog
                    open={openForm}
                    onClose={() => setOpenForm(false)}
                    maxWidth="sm"
                    fullWidth
                    PaperProps={{ sx: { borderRadius: 5, p: 2 } }}
                >
                    <DialogTitle sx={{ fontWeight: 900 }}>Create New RoadMap</DialogTitle>
                    <DialogContent>
                        <RoadmapForm onSubmit={handleCreateSubmit} />
                    </DialogContent>
                </Dialog>
            </Container>
        </PageLayout>
    );
};

export default RoadmapListPage;