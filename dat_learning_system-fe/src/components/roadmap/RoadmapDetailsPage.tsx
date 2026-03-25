import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Stepper, Step, StepLabel,
    StepContent, Button, Paper, IconButton, Stack, Chip, Avatar
} from '@mui/material';
import { ArrowBack, AutoStories, OpenInNew, CheckCircle, MenuBook, School, Launch } from '@mui/icons-material';
import { fetchRoadmapById } from '../../api/roadmap.api';
import type { RoadmapResponse } from '../../types_interfaces/roadmap';
import PageLayout from '../layout/PageLayout';
import AppLoader from '../../components/feedback/AppLoader';

const RoadmapDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
    const [loading, setLoading] = useState(true);

    const getResourceAction = (resourceLink: string | null) => {
        if (!resourceLink) return { label: 'View', icon: <OpenInNew /> };
        const [type] = resourceLink.split(' - ');

        switch (type) {
            case 'EBook':
                return { label: 'Read Book', icon: <MenuBook /> };
            case 'Course':
                return { label: 'Open Course', icon: <School /> };
            default:
                return { label: 'Open', icon: <Launch /> };
        }
    };

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;
            try {
                setLoading(true);
                const data = await fetchRoadmapById(Number(id));
                // Sort steps by sortOrder before rendering
                data.steps.sort((a, b) => a.sortOrder - b.sortOrder);
                setRoadmap(data);
            } catch (err) {
                console.error("Failed to fetch roadmap:", err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    // Helper to handle the "Loose Link" navigation
    const handleResourceClick = (resourceLink: string, resourceTitle: string) => {
        if (!resourceLink) return;
        const [type] = resourceLink.split(' - ');

        if (type === 'EBook') {
            // We pass the title in the URL: /library?search=React+Mastery
            navigate(`/ebooks?search=${encodeURIComponent(resourceTitle)}`);
        } else if (type === 'Course') {
            navigate(`/courses?search=${encodeURIComponent(resourceTitle)}`);
        }
    };

    if (loading) return <PageLayout><AppLoader kanji="道" /></PageLayout>;

    if (!roadmap) {
        return (
            <PageLayout>
                <Container sx={{ py: 10, textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={800}>Roadmap Not Found</Typography>
                    <Button onClick={() => navigate('/roadmaps')} sx={{ mt: 2 }}>Return to List</Button>
                </Container>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <Container maxWidth="md" sx={{ py: 6 }}>
                {/* 1. Hero Section */}
                <Stack spacing={2} sx={{ mb: 6 }}>
                    <IconButton
                        onClick={() => navigate('/roadmaps')}
                        sx={{ alignSelf: 'flex-start', bgcolor: 'background.paper', border: '1px solid #e2e8f0' }}
                    >
                        <ArrowBack />
                    </IconButton>

                    <Typography variant="overline" color="primary.main" fontWeight={900} sx={{ letterSpacing: 2 }}>
                        LEARNING PATHWAY
                    </Typography>

                    <Typography variant="h3" fontWeight={900} sx={{ lineHeight: 1.2 }}>
                        {roadmap.title}
                    </Typography>

                    {roadmap.targetRole && (
                        <Chip
                            label={`Target: ${roadmap.targetRole}`}
                            color="secondary"
                            sx={{ alignSelf: 'flex-start', fontWeight: 700, borderRadius: 1.5 }}
                        />
                    )}

                    <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem', maxWidth: '80ch' }}>
                        {roadmap.description}
                    </Typography>
                </Stack>

                {/* 2. The Stepper */}
                <Stepper
                    orientation="vertical"
                    sx={{
                        '& .MuiStepConnector-line': {
                            borderLeftStyle: 'dashed',
                            borderLeftWidth: '2px',
                            minHeight: '40px',
                        }
                    }}
                >
                    {roadmap.steps.map((step, index) => (
                        <Step key={step.id} active expanded>
                            <StepLabel
                                StepIconComponent={() => (
                                    <Avatar
                                        sx={{
                                            width: 28, height: 28, fontSize: '0.8rem',
                                            bgcolor: 'primary.main', fontWeight: 900
                                        }}
                                    >
                                        {index + 1}
                                    </Avatar>
                                )}
                            >
                                <Typography variant="h6" fontWeight={800}>
                                    {step.title}
                                </Typography>
                            </StepLabel>

                            <StepContent>
                                <Paper
                                    variant="outlined"
                                    sx={{
                                        p: 3, borderRadius: 4, mb: 3,
                                        bgcolor: 'background.paper',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
                                    }}
                                >
                                    <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 3, color: 'text.primary', lineHeight: 1.8 }}>
                                        {step.content || "Read the materials linked below to master this milestone."}
                                    </Typography>

                                    {step.linkedResourceId && (
                                        <Box sx={{ mt: 2, p: 2, bgcolor: 'action.hover', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                {/* 1. Dynamic Icon based on the TYPE part of the string */}
                                                {step.linkedResourceId.startsWith('EBook') ? (
                                                    <AutoStories color="primary" />
                                                ) : (
                                                    <OpenInNew color="secondary" />
                                                )}

                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="subtitle2" fontWeight={700}>
                                                        {step.linkedResourceTitle || "Linked Resource"}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {/* 2. Dynamic Helper Text */}
                                                        {step.linkedResourceId.startsWith('EBook')
                                                            ? "Click to open this material in the library."
                                                            : "Click to view this external course material."}
                                                    </Typography>
                                                </Box>

                                                {step.linkedResourceId && (
                                                    <Button
                                                        size="small"
                                                        variant="outlined"
                                                        startIcon={getResourceAction(step.linkedResourceId).icon}
                                                        onClick={() => handleResourceClick(step.linkedResourceId!, step.linkedResourceTitle!)}
                                                        sx={{
                                                            borderRadius: 2,
                                                            textTransform: 'none',
                                                            fontWeight: 700,
                                                            px: 2
                                                        }}
                                                    >
                                                        {getResourceAction(step.linkedResourceId).label}
                                                    </Button>
                                                )}
                                            </Stack>
                                        </Box>
                                    )}
                                </Paper>
                            </StepContent>
                        </Step>
                    ))}
                </Stepper>

                {/* 3. Footer / Completion */}
                <Box sx={{ mt: 8, p: 6, borderRadius: 6, bgcolor: 'primary.main', color: 'white', textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 60, mb: 2 }} />
                    <Typography variant="h4" fontWeight={900} gutterBottom>
                        Way to go!
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                        Complete these steps to level up your {roadmap.targetRole || 'skills'}.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/roadmaps')}
                        sx={{
                            bgcolor: 'white', color: 'primary.main', fontWeight: 900,
                            px: 4, py: 1.5, borderRadius: 3,
                            '&:hover': { bgcolor: '#f8fafc' }
                        }}
                    >
                        Browse More Paths
                    </Button>
                </Box>
            </Container>
        </PageLayout>
    );
};

export default RoadmapDetailsPage;