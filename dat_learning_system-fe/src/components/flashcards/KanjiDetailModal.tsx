import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Chip,
    Divider,
    IconButton,
    Button,
    DialogActions
} from "@mui/material";
import { useState } from "react";
import { type Kanji } from "../../types_interfaces/kanji";
import KanjiStrokeAnimation from "./KanjiStrokeAnimation";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import GestureIcon from '@mui/icons-material/Gesture';
import { deleteKanji } from "../../api/kanji.api";

type Props = {
    open: boolean;
    kanji: Kanji | null;
    onClose: () => void;
    onRefresh: () => void; // Added for the list refresh
    onEdit: (kanji: Kanji) => void;
};

export default function KanjiDetailModal({ open, kanji, onClose, onRefresh, onEdit }: Props) {
    if (!kanji) return null;
    const [animationKey, setAnimationKey] = useState(0);

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete ${kanji.character}?`)) {
            await deleteKanji(kanji.id);
            onRefresh();
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: "center", pb: 3, pt: 3 }}>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>

                    {/* Stroke Count Badge (Top Right of the header) */}
                    <Chip
                        icon={<GestureIcon sx={{ fontSize: '14px !important' }} />}
                        label={`${kanji.strokes} strokes`}
                        size="small"
                        variant="outlined"
                        sx={{ position: 'absolute', top: 0, right: 20, opacity: 0.8 }}
                    />

                    <Typography variant="caption" sx={{ fontSize: 16, color: "text.secondary", letterSpacing: 2, mb: -0.5 }}>
                        {kanji.romaji}
                    </Typography>

                    <Typography variant="h1" sx={{ fontSize: 60, fontWeight: "bold", color: "text.primary" }}>
                        {kanji.character}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box
                    sx={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "background.paper",
                        mb: 2,
                        borderRadius: 2,
                        position: "relative",
                        border: '1px solid',
                        borderColor: 'divider'
                    }}
                >
                    <KanjiStrokeAnimation
                        key={animationKey}
                        kanji={kanji.character} // Fixed
                        width={180}
                        height={180}
                    />

                    <IconButton
                        size="small"
                        sx={{ position: "absolute", bottom: 8, right: 8 }}
                        onClick={() => setAnimationKey(prev => prev + 1)}
                    >
                        <RestartAltIcon fontSize="small" />
                    </IconButton>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2,
                        p: 2.5,
                        bgcolor: 'action.hover',
                        borderRadius: 2,
                        borderLeft: '5px solid',
                        borderColor: 'error.main'
                    }}
                >
                    <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
                            Meaning
                        </Typography>
                        <Typography variant="h6" sx={{ color: 'text.primary', lineHeight: 1.4 }}>
                            {kanji.meaning}
                        </Typography>
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">Onyomi</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {kanji.onyomi?.map(o => (
                            <Chip key={o} label={o} size="small" color="primary" variant="outlined" />
                        ))}
                    </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">Kunyomi</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                        {kanji.kunyomi?.map(k => (
                            <Chip key={k} label={k} size="small" color="secondary" variant="outlined" />
                        ))}
                    </Box>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>Examples</Typography>
                {kanji.examples.length > 0 ? (
                    kanji.examples.map((ex) => (
                        <Box key={ex.id || Math.random()} sx={{ mb: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 1 }}>
                            <Typography sx={{ fontWeight: 'medium' }}>
                                {ex.word} ({ex.reading})
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {ex.meaning}
                            </Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2" color="text.disabled">No examples added yet.</Typography>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button
                    startIcon={<DeleteIcon />}
                    color="error"
                    onClick={handleDelete}
                >
                    Delete
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button onClick={onClose}>Close</Button>
                {/* You'll likely want to trigger the CreateModal in "Edit Mode" here */}
                <Button
                    variant="contained"
                    startIcon={<EditIcon />}
                    onClick={() => onEdit(kanji)}
                >
                    Edit
                </Button>
            </DialogActions>
        </Dialog>
    );
}