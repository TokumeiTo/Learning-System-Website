import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Chip,
    Divider,
    IconButton,
} from "@mui/material";
import { useState } from "react";
import { type Kanji } from "../../types/kanji";
import KanjiStrokeAnimation from "./KanjiStrokeAnimation";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

type Props = {
    open: boolean;
    kanji: Kanji | null;
    onClose: () => void;
};

export default function KanjiDetailModal({ open, kanji, onClose }: Props) {
    if (!kanji) return null;
    const [animationKey, setAnimationKey] = useState(0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ textAlign: "center", fontSize: 40 }}>
                {kanji.kanji}
            </DialogTitle>

            <DialogContent>
                {/* Stroke animation placeholder */}
                <Box
                    sx={{
                        height: 200,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "background.paper",
                        mb: 2,
                        borderRadius: 2,
                        position: "relative", // 🔑 important
                    }}
                >
                    <KanjiStrokeAnimation
                        key={animationKey}   // 🔑 forces re-mount
                        kanji={kanji.kanji}
                        width={180}
                        height={180}
                    />

                    {/* Restart button */}
                    <IconButton
                        size="small"
                        sx={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                        }}
                        onClick={() => setAnimationKey(prev => prev + 1)}
                    >
                        <RestartAltIcon fontSize="small" />
                    </IconButton>
                </Box>


                <Typography>
                    <strong>Meaning:</strong> {kanji.meaning}
                </Typography>

                <Typography component="div" sx={{ mt: 1 }}>
                    <strong>Onyomi:</strong>{" "}
                    {kanji.onyomi?.map(o => (
                        <Chip key={o} label={o} sx={{ mr: 0.5 }} />
                    ))}
                </Typography>

                <Typography component="div" sx={{ mt: 1 }}>
                    <strong>Kunyomi:</strong>{" "}
                    {kanji.kunyomi?.map(k => (
                        <Chip key={k} label={k} sx={{ mr: 0.5 }} />
                    ))}
                </Typography>


                <Divider sx={{ my: 2 }} />

                <Typography variant="h6">Examples</Typography>
                {kanji.examples.map((ex, idx) => (
                    <Box key={idx} sx={{ mt: 1 }}>
                        <Typography>
                            {ex.word} ({ex.reading})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {ex.meaning}
                        </Typography>
                    </Box>
                ))}
            </DialogContent>
        </Dialog>
    );
}