import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, MenuItem, IconButton, Typography,
    Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState, useEffect } from "react";
import type { Kanji, JLPTLevel, KanjiExample } from "../../types_interfaces/kanji";
import { saveKanji } from "../../api/kanji.api";
import ConfirmModal from "../feedback/ConfirmModal";

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    kanjiToEdit?: Kanji | null; // New prop for Edit mode
};

export default function KanjiCreateModal({ open, onClose, onSuccess, kanjiToEdit }: Props) {
    const [character, setCharacter] = useState("");
    const [meaning, setMeaning] = useState("");
    const [romaji, setRomaji] = useState("");
    const [strokes, setStrokes] = useState(0);
    const [jlptLevel, setJlptLevel] = useState<JLPTLevel>("N5");
    const [onyomi, setOnyomi] = useState<string[]>([""]);
    const [kunyomi, setKunyomi] = useState<string[]>([""]);
    const [examples, setExamples] = useState<KanjiExample[]>([
        { word: "", reading: "", meaning: "" },
    ]);

    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Populate fields if editing
    useEffect(() => {
        if (kanjiToEdit) {
            setCharacter(kanjiToEdit.character);
            setMeaning(kanjiToEdit.meaning);
            setRomaji(kanjiToEdit.romaji || "");
            setStrokes(kanjiToEdit.strokes);
            setJlptLevel(kanjiToEdit.jlptLevel);
            setOnyomi((kanjiToEdit.onyomi ?? []).length ? (kanjiToEdit.onyomi ?? []) : [""]);
            setKunyomi((kanjiToEdit.kunyomi ?? []).length ? (kanjiToEdit.kunyomi ?? []) : [""]);
            setExamples(kanjiToEdit.examples.length ? kanjiToEdit.examples : [{ word: "", reading: "", meaning: "" }]);
        } else {
            // Reset for Create mode
            setCharacter("");
            setMeaning("");
            setRomaji("");
            setStrokes(0);
            setJlptLevel("N5");
            setOnyomi([""]);
            setKunyomi([""]);
            setExamples([{ word: "", reading: "", meaning: "" }]);
        }
    }, [kanjiToEdit, open]);

    const handlePreSubmit = () => {
        // You can add validation here: if (word === "") return;
        setShowSubmitConfirm(true);
    };
    const handleActualSubmit = async () => {
        const payload = {
            id: kanjiToEdit?.id, // If present, backend triggers PUT sync
            character,
            meaning,
            romaji,
            strokes,
            jlptLevel,
            // Filter out empty strings before sending
            onyomi: onyomi.filter(o => o.trim() !== ""),
            kunyomi: kunyomi.filter(k => k.trim() !== ""),
            examples: examples.filter(ex => ex.word.trim() !== ""),
        };

        try {
            await saveKanji(payload);
            setShowSubmitConfirm(false);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        {kanjiToEdit ? `Edit Kanji: ${kanjiToEdit.character}` : "Create New Kanji"}
                    </Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </DialogTitle>

                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <TextField label="Kanji Character" sx={{ mt: 1 }} fullWidth value={character} onChange={(e) => setCharacter(e.target.value)} />
                    <TextField label="Meaning" fullWidth value={meaning} onChange={(e) => setMeaning(e.target.value)} />
                    <TextField label="Romaji" fullWidth value={romaji} onChange={(e) => setRomaji(e.target.value)} />
                    <TextField label="Strokes" type="number" fullWidth value={strokes} onChange={(e) => setStrokes(parseInt(e.target.value) || 0)} />

                    <TextField select label="JLPT Level" value={jlptLevel} onChange={(e) => setJlptLevel(e.target.value as JLPTLevel)}>
                        {["N5", "N4", "N3", "N2", "N1"].map(level => (
                            <MenuItem key={level} value={level}>{level}</MenuItem>
                        ))}
                    </TextField>

                    <Typography fontWeight="bold">Onyomi</Typography>
                    {onyomi.map((o, i) => (
                        <Box key={i} sx={{ display: "flex", gap: 1 }}>
                            <TextField fullWidth value={o} onChange={(e) => {
                                const copy = [...onyomi];
                                copy[i] = e.target.value;
                                setOnyomi(copy);
                            }} />
                            <IconButton onClick={() => setOnyomi(onyomi.filter((_, idx) => idx !== i))}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => setOnyomi([...onyomi, ""])}>Add Onyomi</Button>

                    <Typography fontWeight="bold">Kunyomi</Typography>
                    {kunyomi.map((k, i) => (
                        <Box key={i} sx={{ display: "flex", gap: 1 }}>
                            <TextField fullWidth value={k} onChange={(e) => {
                                const copy = [...kunyomi];
                                copy[i] = e.target.value;
                                setKunyomi(copy);
                            }} />
                            <IconButton onClick={() => setKunyomi(kunyomi.filter((_, idx) => idx !== i))}>
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => setKunyomi([...kunyomi, ""])}>Add Kunyomi</Button>

                    <Divider sx={{ my: 1 }}>Example Sentences</Divider>

                    {examples.map((ex, i) => (
                        <Box key={i} sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1, border: '1px dashed grey' }}>
                            <TextField label="Sentence or word" value={ex.word} onChange={(e) => {
                                const copy = [...examples];
                                copy[i].word = e.target.value;
                                setExamples(copy);
                            }} />
                            <TextField label="Reading" value={ex.reading} onChange={(e) => {
                                const copy = [...examples];
                                copy[i].reading = e.target.value;
                                setExamples(copy);
                            }} />
                            <TextField label="Meaning" value={ex.meaning} onChange={(e) => {
                                const copy = [...examples];
                                copy[i].meaning = e.target.value;
                                setExamples(copy);
                            }} />
                            <Button color="error" size="small" onClick={() => setExamples(examples.filter((_, idx) => idx !== i))}>Remove Example</Button>
                        </Box>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => setExamples([...examples, { word: "", reading: "", meaning: "" }])}>
                        Add Example
                    </Button>
                </DialogContent>

                <DialogActions>
                    <Button variant="contained" sx={{ width: '100%' }} onClick={handlePreSubmit}>
                        {kanjiToEdit ? "Update Kanji" : "Create Kanji"}
                    </Button>
                </DialogActions>

            </Dialog>

            <ConfirmModal
                open={showSubmitConfirm}
                title={kanjiToEdit ? "Confirm Update" : "Confirm Save"}
                message={`Are you sure you want to ${kanjiToEdit ? 'update' : 'save'}?`}
                confirmColor="primary" // Since saving is a positive action
                onClose={() => setShowSubmitConfirm(false)}
                onConfirm={handleActualSubmit}
            />
        </>
    );
}