import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Stepper, Step, StepLabel,
    StepContent, Button, Paper, IconButton, Stack, Chip
} from '@mui/material';
import { ArrowBack, AutoStories, OpenInNew } from '@mui/icons-material';
import { fetchRoadmapById } from '../../api/roadmap.api';
import type { RoadmapResponse } from '../../types_interfaces/roadmap';
import PageLayout from '../layout/PageLayout';
// Import your loader
import AppLoader from '../../components/feedback/AppLoader';

const RoadmapDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await fetchRoadmapById(Number(id));
                setRoadmap(data);
            } catch (err) {
                console.error("Failed to fetch roadmap:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    // 1. Show Loader while fetching
    if (loading) {
        return (
            <PageLayout>
                <AppLoader kanji="道" />
            </PageLayout>
        );
    }

    // 2. Handle missing data
    if (!roadmap) {
        return (
            <PageLayout>
                <Container sx={{ py: 10, textAlign: 'center' }}>
                    <Typography variant="h6">This Roadmap path could not be found.</Typography>
                    <Button onClick={() => navigate('/roadmaps')} sx={{ mt: 2 }}>
                        Return to List
                    </Button>
                </Container>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Container maxWidth="md" sx={{ py: 6 }}>
                {/* Navigation Header */}
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'action.hover' }}>
                        <ArrowBack />
                    </IconButton>
                    <Box>
                        <Typography variant="overline" color="primary" fontWeight={900}>
                            RoadMap Details
                        </Typography>
                        <Typography variant="h4" fontWeight={900}>{roadmap.title}</Typography>
                    </Box>
                </Stack>

                <Typography variant="body1" color="text.secondary" sx={{ textIndent: '20px', mb: 5, maxWidth: '700px' }}>
                    {roadmap.description}
                </Typography>

                {/* THE ROADMAP STEPPER */}
                <Stepper
                    orientation="vertical"
                    connector={<Box sx={{ ml: '11px', borderLeft: '2px dashed #cbd5e1', height: '100%' }} />}
                >
                    {roadmap.steps.map((step, index) => (
                        <Step
                            key={step.id}
                            active={true}   // Keeps the circle icon colored
                            expanded={true} // Keeps the content visible
                        >
                            <StepLabel
                                optional={
                                    <Chip
                                        label={step.nodeType}
                                        size="small"
                                        variant="outlined"
                                        sx={{ ml: 1, fontSize: '10px', height: '18px', fontWeight: 800 }}
                                    />
                                }
                            >
                                <Typography variant="subtitle1" fontWeight={800} color="primary">
                                    {step.title}
                                </Typography>
                            </StepLabel>

                            <StepContent>
                                <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 4, mb: 2, border: '1px solid #e2e8f0' }}>
                                    <Typography variant="body2" sx={{ whiteSpace: 'pre-line', mb: 3, color: 'text.secondary', lineHeight: 1.7 }}>
                                        {step.content || "Follow the instructions provided for this milestone."}
                                    </Typography>

                                    <Stack direction="row" spacing={2}>
                                        {step.nodeType === 'EBook' && step.linkedResourceId && (
                                            <Button
                                                variant="contained"
                                                startIcon={<AutoStories />}
                                                onClick={() => navigate(`/ebooks`)}
                                                sx={{ borderRadius: 2, fontWeight: 700 }}
                                            >
                                                Open Library
                                            </Button>
                                        )}

                                        {step.nodeType === 'Course' && (
                                            <Button
                                                variant="outlined"
                                                startIcon={<OpenInNew />}
                                                href={step.content?.startsWith('http') ? step.content : '#'}
                                                target="_blank"
                                                sx={{ borderRadius: 2, fontWeight: 700 }}
                                            >
                                                Go to Course
                                            </Button>
                                        )}

                                    </Stack>
                                </Paper>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>

                <Box sx={{ mt: 8, pt: 4, borderTop: '2px dashed', borderColor: 'divider', textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={900} gutterBottom>
                        🏁 You've reached the end!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, color: 'text.secondary' }}>
                        You've explored the full {roadmap.title} Roadmap. Ready to pick another path?
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button
                            variant="contained"
                            onClick={() => navigate('/roadmaps')}
                            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 900 }}
                        >
                            Explore Other RoadMaps
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            sx={{ px: 4, py: 1.5, borderRadius: 3, fontWeight: 900 }}
                        >
                            Back to Top
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </PageLayout>
    );
};

export default RoadmapDetailsPage;