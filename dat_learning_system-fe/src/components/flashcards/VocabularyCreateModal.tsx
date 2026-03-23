import {
    Box, Modal, Typography, TextField, Button, IconButton,
    Stack, FormControl, InputLabel, Select, MenuItem, Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import type { Vocabulary, PartOfSpeech, VocabularyExample, UpsertVocabRequest } from "../../types_interfaces/vocabulary";
import type { JLPTLevel } from "../../types_interfaces/kanji";
import { saveVocab } from "../../api/vocabulary.api";
import ConfirmModal from "../feedback/ConfirmModal";

interface Props {
    open: boolean;
    vocabToEdit: Vocabulary | null;
    onClose: () => void;
    onSuccess: () => void;
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '95%', sm: 600 },
    bgcolor: 'background.paper',
    borderRadius: 1,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto'
};

export default function VocabCreateModal({ open, vocabToEdit, onClose, onSuccess }: Props) {
    // --- Form States ---
    const [word, setWord] = useState("");
    const [reading, setReading] = useState("");
    const [meaning, setMeaning] = useState("");
    const [level, setLevel] = useState<JLPTLevel>("N5");
    const [pos, setPos] = useState<PartOfSpeech>("Noun");
    const [explanation, setExplanation] = useState("");
    const [examples, setExamples] = useState<VocabularyExample[]>([]);
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    // Load data when editing or reset when creating
    useEffect(() => {
        if (vocabToEdit && open) {
            setWord(vocabToEdit.word);
            setReading(vocabToEdit.reading);
            setMeaning(vocabToEdit.meaning);
            setLevel(vocabToEdit.jlptLevel);
            setPos(vocabToEdit.partOfSpeech);
            setExplanation(vocabToEdit.explanation || "");
            setExamples(vocabToEdit.examples);
        } else if (open) {
            setWord(""); setReading(""); setMeaning(""); setLevel("N5"); setPos("Noun"); setExplanation("");
            setExamples([{ japanese: "", english: "" }]);
        }
    }, [vocabToEdit, open]);

    // --- Helper Functions (The Brain) ---
    const updateExample = (index: number, field: keyof VocabularyExample, value: string) => {
        const copy = [...examples];
        copy[index] = { ...copy[index], [field]: value };
        setExamples(copy);
    };

    const removeExample = (index: number) => {
        setExamples(prev => prev.filter((_, i) => i !== index));
    };

    const addExample = () => {
        setExamples([...examples, { japanese: "", english: "" }]);
    };

    const handlePreSubmit = () => {
        // You can add validation here: if (word === "") return;
        setShowSubmitConfirm(true);
    };
    const handleActualSubmit = async () => {
        const payload: UpsertVocabRequest = {
            id: vocabToEdit?.id,
            word,
            reading,
            meaning,
            partOfSpeech: pos,
            jlptLevel: level,
            explanation,
            examples: examples.filter(ex => ex.japanese.trim() !== "") // Remove empty rows before sending
        };

        try {
            await saveVocab(payload);
            setShowSubmitConfirm(false);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {vocabToEdit ? "Edit Vocabulary" : "Add New Vocabulary"}
                        </Typography>
                        <IconButton onClick={onClose}><CloseIcon /></IconButton>
                    </Box>

                    <Stack spacing={2.5}>
                        {/* Main Info Fields */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField fullWidth label="Word" value={word} onChange={(e) => setWord(e.target.value)} />
                            <TextField fullWidth label="Reading" value={reading} onChange={(e) => setReading(e.target.value)} />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>JLPT Level</InputLabel>
                                <Select value={level} label="JLPT Level" onChange={(e) => setLevel(e.target.value as JLPTLevel)}>
                                    {["N5", "N4", "N3", "N2", "N1"].map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Part of Speech</InputLabel>
                                <Select value={pos} label="Part of Speech" onChange={(e) => setPos(e.target.value as PartOfSpeech)}>
                                    {["Noun", "Verb", "Adjective", "Adverb", "Particle", "Expression"].map(p => <MenuItem key={p} value={p}>{p}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>

                        <TextField fullWidth label="Meaning" value={meaning} onChange={(e) => setMeaning(e.target.value)} />
                        <TextField fullWidth multiline rows={2} label="Explanation (Optional)" value={explanation} onChange={(e) => setExplanation(e.target.value)} />

                        <Divider sx={{ my: 1 }}>Example Sentences</Divider>

                        {/* Dynamic Examples (Dashed Style) */}
                        <Stack spacing={2}>
                            {examples.map((ex, i) => (
                                <Box
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                        p: 2,
                                        border: '1px dashed grey',
                                        borderRadius: 1,
                                        bgcolor: 'background.paper'
                                    }}
                                >
                                    <TextField
                                        label="Japanese Sentence"
                                        size="medium"
                                        fullWidth
                                        value={ex.japanese}
                                        onChange={(e) => updateExample(i, 'japanese', e.target.value)}
                                    />
                                    <TextField
                                        label="English Translation"
                                        size="medium"
                                        fullWidth
                                        value={ex.english}
                                        onChange={(e) => updateExample(i, 'english', e.target.value)}
                                    />
                                    <Button
                                        color="error"
                                        size="small"
                                        sx={{ alignSelf: 'center' }}
                                        onClick={() => removeExample(i)}
                                    >
                                        Remove Example
                                    </Button>
                                </Box>
                            ))}

                            <Button
                                startIcon={<AddIcon />}
                                onClick={addExample}
                                sx={{ alignSelf: 'center' }}
                            >
                                Add Example
                            </Button>
                        </Stack>

                        <Button
                            variant="contained"
                            size="large"
                            onClick={handlePreSubmit}
                            sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
                        >
                            {vocabToEdit ? "Update Word" : "Save Word"}
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            <ConfirmModal
                open={showSubmitConfirm}
                title={vocabToEdit ? "Confirm Update" : "Confirm Save"}
                message={`Are you sure you want to ${vocabToEdit ? 'update' : 'save'} "${word}"?`}
                confirmColor="primary" // Since saving is a positive action
                onClose={() => setShowSubmitConfirm(false)}
                onConfirm={handleActualSubmit}
            />
        </>
    );
}