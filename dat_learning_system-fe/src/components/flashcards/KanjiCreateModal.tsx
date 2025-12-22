import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    MenuItem,
    IconButton,
    Typography,
    Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import type { JLPTLevel } from "../../types/kanji";

type Props = {
    open: boolean;
    onClose: () => void;
};

export default function KanjiCreateModal({ open, onClose }: Props) {
    const [onyomi, setOnyomi] = useState<string[]>([""]);
    const [kunyomi, setKunyomi] = useState<string[]>([""]);
    const [examples, setExamples] = useState([
        { word: "", reading: "", meaning: "" },
    ]);

    const handleSubmit = () => {
        const newKanji = {
            id: crypto.randomUUID(), // frontend mock
            kanji: "",
            jlptLevel: "N5" as JLPTLevel,
            onyomi,
            kunyomi,
            meaning: "",
            romaji: "",
            strokes: 0,
            examples,
        };

        console.log("CREATE KANJI:", newKanji);
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Create New Kanji</DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField label="Kanji Character" fullWidth />
                <TextField label="Meaning" fullWidth />
                <TextField label="Romaji" fullWidth />
                <TextField label="Strokes" type="number" fullWidth />

                <TextField select label="JLPT Level" defaultValue="N5">
                    {["N5", "N4", "N3", "N2", "N1"].map(level => (
                        <MenuItem key={level} value={level}>
                            {level}
                        </MenuItem>
                    ))}
                </TextField>

                {/* Onyomi */}
                <Typography fontWeight="bold">Onyomi</Typography>
                {onyomi.map((o, i) => {
                    const isLast = i === onyomi.length - 1;

                    return (
                        <Box key={i} sx={{ display: "flex", gap: 1 }}>
                            <TextField
                                fullWidth
                                value={o}
                                onChange={(e) => {
                                    const copy = [...onyomi];
                                    copy[i] = e.target.value;
                                    setOnyomi(copy);
                                }}
                            />

                            {isLast ? (
                                <Tooltip title="Create new input">
                                    <Box sx={{display:"flex", alignItems:"center"}}>
                                        <IconButton onClick={() => setOnyomi([...onyomi, ""])} size="small" sx={{ position: "relative" }}>
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </Tooltip>
                            ) : (
                                <IconButton
                                    onClick={() =>
                                        setOnyomi(onyomi.filter((_, idx) => idx !== i))
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>
                    );
                })}


                <Typography fontWeight="bold">Kunyomi</Typography>
                {kunyomi.map((k, i) => {
                    const isLast = i === kunyomi.length - 1;

                    return (
                        <Box key={i} sx={{ display: "flex", gap: 1 }}>
                            <TextField
                                fullWidth
                                value={k}
                                onChange={(e) => {
                                    const copy = [...kunyomi];
                                    copy[i] = e.target.value;
                                    setKunyomi(copy);
                                }}
                            />

                            {isLast ? (
                                <IconButton onClick={() => setKunyomi([...kunyomi, ""])}>
                                    <AddIcon />
                                </IconButton>
                            ) : (
                                <IconButton
                                    onClick={() =>
                                        setKunyomi(kunyomi.filter((_, idx) => idx !== i))
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>
                    );
                })}


                {/* Examples */}
                <Typography fontWeight="bold">Examples</Typography>
                {examples.map((ex, i) => (
                    <Box key={i} sx={{ display: "flex", gap: 1 }}>
                        <TextField label="Word" value={ex.word} />
                        <TextField label="Reading" value={ex.reading} />
                        <TextField label="Meaning" value={ex.meaning} />
                        <IconButton
                            onClick={() =>
                                setExamples(examples.filter((_, idx) => idx !== i))
                            }
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ))}

                <Button
                    startIcon={<AddIcon />}
                    onClick={() =>
                        setExamples([...examples, { word: "", reading: "", meaning: "" }])
                    }
                >
                    Add Example
                </Button>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
}
