import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Chip,
    Divider,
} from "@mui/material";
import { type Kanji } from "../../types/kanji";
import KanjiStrokeAnimation from "./KanjiStrokeAnimation";

type Props = {
    open: boolean;
    kanji: Kanji | null;
    onClose: () => void;
};

export default function KanjiDetailModal({ open, kanji, onClose }: Props) {
    if (!kanji) return null;

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
                        bgcolor: 'lightGray',
                        mb: '20px'
                    }}
                >
                    <KanjiStrokeAnimation
                        kanji={kanji.kanji}
                        width={180}
                        height={180}
                        delay={400} // optional: adjust stroke speed
                    />
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
