import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Box, MenuItem, Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import type { JLPTLevel } from "../../types_interfaces/kanji";
import type { Grammar, GrammarExample } from "../../types_interfaces/grammar";
import { saveGrammar } from "../../api/grammar.api";

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
    grammarToEdit?: Grammar | null;
};

export default function GrammarCreateModal({ open, onClose, onSuccess, grammarToEdit }: Props) {
    // 1. Individual State Hooks (Matching your Kanji style)
    const [title, setTitle] = useState("");
    const [jlptLevel, setJlptLevel] = useState<JLPTLevel>("N5");
    const [meaning, setMeaning] = useState("");
    const [structure, setStructure] = useState("");
    const [explanation, setExplanation] = useState("");
    const [examples, setExamples] = useState<GrammarExample[]>([
        { jp: "", romaji: "", en: "" },
    ]);

    // 2. Populate fields if editing
    useEffect(() => {
        if (grammarToEdit) {
            setTitle(grammarToEdit.title);
            setJlptLevel(grammarToEdit.jlptLevel);
            setMeaning(grammarToEdit.meaning);
            setStructure(grammarToEdit.structure);
            setExplanation(grammarToEdit.explanation);
            setExamples(grammarToEdit.examples.length ? [...grammarToEdit.examples] : [{ jp: "", romaji: "", en: "" }]);
        } else {
            setTitle("");
            setJlptLevel("N5");
            setMeaning("");
            setStructure("");
            setExplanation("");
            setExamples([{ jp: "", romaji: "", en: "" }]);
        }
    }, [grammarToEdit, open]);

    const handleSubmit = async () => {
        const payload = {
            id: grammarToEdit?.id,
            title,
            jlptLevel,
            meaning,
            structure,
            explanation,
            // Filter empty examples before sending
            examples: examples.filter(ex => ex.jp.trim() !== ""),
        };

        try {
            await saveGrammar(payload);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                {grammarToEdit ? `Edit Grammar: ${grammarToEdit.title}` : "Create New Grammar Point"}
            </DialogTitle>

            <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 3 }}>
                <TextField label="Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} />

                <TextField select label="JLPT Level" value={jlptLevel} onChange={(e) => setJlptLevel(e.target.value as JLPTLevel)}>
                    {["N5", "N4", "N3", "N2", "N1"].map(level => (
                        <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                </TextField>

                <TextField label="Meaning" fullWidth value={meaning} onChange={(e) => setMeaning(e.target.value)} />
                <TextField label="Structure" fullWidth value={structure} onChange={(e) => setStructure(e.target.value)} />
                <TextField label="Explanation" fullWidth multiline rows={3} value={explanation} onChange={(e) => setExplanation(e.target.value)} />

                <Typography fontWeight="bold">Examples</Typography>
                {examples.map((ex, i) => (
                    <Box key={i} sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1.5, border: '1px dashed grey', borderRadius: 1 }}>
                        <TextField label="Japanese" size="small" value={ex.jp} onChange={(e) => {
                            const copy = [...examples];
                            copy[i].jp = e.target.value;
                            setExamples(copy);
                        }} />
                        <TextField label="Romaji" size="small" value={ex.romaji} onChange={(e) => {
                            const copy = [...examples];
                            copy[i].romaji = e.target.value;
                            setExamples(copy);
                        }} />
                        <TextField label="English" size="small" value={ex.en} onChange={(e) => {
                            const copy = [...examples];
                            copy[i].en = e.target.value;
                            setExamples(copy);
                        }} />
                        <Button
                            color="error"
                            size="small"
                            sx={{ alignSelf: 'flex-start', textAlign: 'center', width: '100%' }}
                            onClick={() => setExamples(examples.filter((_, idx) => idx !== i))}
                        >
                            Remove Example
                        </Button>
                    </Box>
                ))}

                <Button
                    startIcon={<AddIcon />}
                    sx={{ alignSelf: 'flex-start', textAlign: 'center', width: '100%' }}
                    onClick={() => setExamples([...examples, { jp: "", romaji: "", en: "" }])}
                >
                    Add Example
                </Button>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button variant="contained" onClick={handleSubmit}>
                    {grammarToEdit ? "Update" : "Create"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}