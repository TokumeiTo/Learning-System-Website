import { useState } from "react";
import { Box, Typography, Chip, Divider, Stack, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Onomatopoeia } from "../../types_interfaces/onomatopoeia";
import "./OnamatoFlashcard.css";
import { useAuth } from "../../hooks/useAuth";

interface Props {
    data: Onomatopoeia;
    onEdit: (data: Onomatopoeia) => void;   // New Prop
    onDelete: (id: number) => void;        // New Prop
}

export default function OnomatoFlashcard({ data, onEdit, onDelete }: Props) {
    const [isFlipped, setIsFlipped] = useState(false);
    const { user } = useAuth();
    const canManageCourses = user?.position === "Admin" || user?.position === "SuperAdmin";

    // Stop Propagation prevents the card from flipping when clicking buttons
    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit(data);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete(data.id);
    };

    return (
        <Box
            className={`onomato-card-container ${isFlipped ? "flipped" : ""}`}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            <Box className="onomato-card-inner">

                {/* FRONT SIDE */}
                <Box className="onomato-card-front" sx={{ bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}>
                    {/* Category Chip */}
                    <Chip
                        label={data.category}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ position: 'absolute', top: 16, right: 16 }}
                    />

                    {/* Action Buttons (Top Left) */}
                    {canManageCourses && (
                        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" onClick={handleEdit} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={handleDelete} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    )}

                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                        {data.phrase}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {data.romaji}
                    </Typography>
                </Box>

                {/* BACK SIDE */}
                <Box className="onomato-card-back">
                    {canManageCourses && (
                        <Box sx={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" onClick={handleEdit} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={handleDelete} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main' } }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    )}
                    <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1, color: 'primary.main' }}>
                        {data.meaning}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, px: 2, fontStyle: 'italic', color: 'text.primary' }}>
                        {data.explanation}
                    </Typography>

                    <Divider sx={{ width: '100%', mb: 2 }} />

                    <Stack spacing={1.5} sx={{ width: '100%', overflowY: 'auto' }}>
                        {data.examples.map((ex, i) => (
                            <Box key={i} sx={{ textAlign: 'left' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.tertiary' }}>
                                    {ex.japanese}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {ex.english}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
}