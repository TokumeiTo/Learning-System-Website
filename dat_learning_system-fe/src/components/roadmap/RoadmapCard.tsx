import React from 'react';
import { Paper, Box, Typography, Stack, Chip, IconButton, Tooltip } from '@mui/material';
import { ArrowForwardIos, Map, PlaylistAdd, Delete, ContentCopy } from '@mui/icons-material';
import { motion } from 'framer-motion';
import type { RoadmapResponse } from '../../types_interfaces/roadmap';
import { useNavigate } from 'react-router-dom';
import { duplicateRoadmap, deleteRoadmap } from '../../api/roadmap.api'; 

interface RoadmapCardProps {
    roadmap: RoadmapResponse;
    isAdmin?: boolean;
    onRefresh: () => void;
}

const RoadmapCard: React.FC<RoadmapCardProps> = ({ roadmap, isAdmin, onRefresh }) => {
    const navigate = useNavigate();

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent navigating to details
        if (window.confirm(`Are you sure you want to delete "${roadmap.title}"? This cannot be undone.`)) {
            try {
                await deleteRoadmap(roadmap.id);
                onRefresh();
            } catch (err) {
                console.error("Delete failed:", err);
                alert("Failed to delete the roadmap.");
            }
        }
    };

    const handleDuplicate = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Duplicate this blueprint?")) {
            try {
                await duplicateRoadmap(roadmap.id);
                onRefresh();
            } catch (err) {
                alert("Duplicate failed");
            }
        }
    };

    return (
        <Paper
            component={motion.div}
            whileHover={{ x: 3 }}
            elevation={0}
            sx={{
                p: 3, mb: 2, borderRadius: 4, border: '1px solid',
                borderColor: 'divider', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 3,
            }}
            onClick={() => navigate(`/roadmaps/${roadmap.id}`)}
        >
            {/* Visual Icon */}
            <Box sx={{
                width: 60, height: 60, borderRadius: 3,
                bgcolor: 'primary.light', display: 'flex',
                alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <Map sx={{ fontSize: 30, color: 'background.paper' }} />
            </Box>

            {/* Content */}
            <Box sx={{ flexGrow: 1 }}>
                <Stack direction="row" spacing={1} sx={{ mb: 0.5 }}>
                    <Chip label={roadmap.targetRole || "General"} size="small" sx={{ fontWeight: 700, height: 20, fontSize: '10px' }} />
                    <Typography variant="caption" fontWeight={700} color="text.disabled">
                        {roadmap.stepCount} STEPS
                    </Typography>
                </Stack>
                <Typography variant="h6" fontWeight={800}>{roadmap.title}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 400 }}>
                    {roadmap.description}
                </Typography>
            </Box>

            {/* ADMIN ACTIONS */}
            {isAdmin && (
                <Stack direction="row" spacing={1} sx={{ mr: 2 }} onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Manage Steps">
                        <IconButton
                            size="small"
                            onClick={() => navigate(`/roadmaps/${roadmap.id}/edit`)}
                            sx={{ color: 'primary.main', bgcolor: 'rgba(59, 130, 246, 0.08)' }}
                        >
                            <PlaylistAdd fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete Roadmap">
                        <IconButton 
                            size="small" 
                            onClick={handleDelete}
                            sx={{ color: 'error.main', bgcolor: 'rgba(239, 68, 68, 0.08)' }}
                        >
                            <Delete fontSize="small" />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Duplicate Roadmap">
                        <IconButton
                            size="small"
                            onClick={handleDuplicate}
                            sx={{ color: 'secondary.main', bgcolor: 'rgba(156, 39, 176, 0.08)' }}
                        >
                            <ContentCopy fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
            )}

            <ArrowForwardIos sx={{ fontSize: 14, color: 'text.disabled' }} />
        </Paper>
    );
};

export default RoadmapCard;