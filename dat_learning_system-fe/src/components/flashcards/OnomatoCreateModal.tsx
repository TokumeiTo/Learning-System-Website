import {
    Box, Modal, Typography, TextField, Button, IconButton,
    Stack, FormControl, InputLabel, Select, MenuItem, Divider
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import type { 
    Onomatopoeia, 
    OnomatoType, 
    OnomatoExample, 
    UpsertOnomatoRequest,  
} from "../../types_interfaces/onomatopoeia";
import { ONOMATO_TYPES, ONOMATO_CATEGORIES } from "../../utils/onomato_type_category";
import { saveOnomato } from "../../api/onomatopoeia.api";
import ConfirmModal from "../feedback/ComfirmModal";

interface Props {
    open: boolean;
    onomatoToEdit: Onomatopoeia | null;
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
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto'
};

export default function OnomatoCreateModal({ open, onomatoToEdit, onClose, onSuccess }: Props) {
    // --- Form States ---
    const [phrase, setPhrase] = useState("");
    const [romaji, setRomaji] = useState("");
    const [meaning, setMeaning] = useState("");
    const [type, setType] = useState<OnomatoType>("Gitaigo");
    const [category, setCategory] = useState("Condition");
    const [explanation, setExplanation] = useState("");
    const [examples, setExamples] = useState<OnomatoExample[]>([]);

    // Confirmation State for the final Save/Update
    const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

    useEffect(() => {
        if (onomatoToEdit && open) {
            setPhrase(onomatoToEdit.phrase);
            setRomaji(onomatoToEdit.romaji);
            setMeaning(onomatoToEdit.meaning);
            setType(onomatoToEdit.type);
            setCategory(onomatoToEdit.category);
            setExplanation(onomatoToEdit.explanation || "");
            setExamples(onomatoToEdit.examples);
        } else if (open) {
            setPhrase(""); setRomaji(""); setMeaning(""); setType("Gitaigo"); setCategory("Condition"); setExplanation("");
            setExamples([{ japanese: "", english: "" }]);
        }
    }, [onomatoToEdit, open]);

    // --- Example Handlers ---
    const updateExample = (index: number, field: keyof OnomatoExample, value: string) => {
        const copy = [...examples];
        copy[index] = { ...copy[index], [field]: value };
        setExamples(copy);
    };

    const removeExample = (index: number) => {
        setExamples(prev => prev.filter((_, i) => i !== index));
    };

    const addExample = () => setExamples([...examples, { japanese: "", english: "" }]);

    // --- Submit Logic ---
    const handleActualSubmit = async () => {
        const payload: UpsertOnomatoRequest = {
            id: onomatoToEdit?.id || null,
            phrase,
            romaji,
            meaning,
            type,
            category,
            explanation,
            examples: examples.filter(ex => ex.japanese.trim() !== "")
        };

        try {
            await saveOnomato(payload);
            setShowSubmitConfirm(false);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save onomatopoeia:", error);
        }
    };

    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={modalStyle}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                            {onomatoToEdit ? "Edit Onomatopoeia" : "Add New Onomatopoeia"}
                        </Typography>
                        <IconButton onClick={onClose}><CloseIcon /></IconButton>
                    </Box>

                    <Stack spacing={2.5}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField fullWidth label="Phrase (Kana)" value={phrase} onChange={(e) => setPhrase(e.target.value)} placeholder="e.g. ぴかぴか" />
                            <TextField fullWidth label="Romaji" value={romaji} onChange={(e) => setRomaji(e.target.value)} placeholder="e.g. pika-pika" />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select value={type} label="Type" onChange={(e) => setType(e.target.value as OnomatoType)}>
                                    {ONOMATO_TYPES.map(t => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
                                    {ONOMATO_CATEGORIES.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Box>

                        <TextField fullWidth label="Main Meaning" value={meaning} onChange={(e) => setMeaning(e.target.value)} />
                        <TextField fullWidth multiline rows={2} label="Usage Explanation" value={explanation} onChange={(e) => setExplanation(e.target.value)} />

                        <Divider sx={{ my: 1 }}>Example Sentences</Divider>

                        <Stack spacing={2}>
                            {examples.map((ex, i) => (
                                <Box key={i} sx={{ p: 2, border: '1px dashed grey', borderRadius: 1, position: 'relative' }}>
                                    <Stack spacing={2}>
                                        <TextField label="Japanese" fullWidth value={ex.japanese} onChange={(e) => updateExample(i, 'japanese', e.target.value)} />
                                        <TextField label="English" fullWidth value={ex.english} onChange={(e) => updateExample(i, 'english', e.target.value)} />
                                        <Button color="error" size="small" onClick={() => removeExample(i)}>Remove Example</Button>
                                    </Stack>
                                </Box>
                            ))}
                            <Button startIcon={<AddIcon />} onClick={addExample} sx={{ alignSelf: 'center' }}>Add Example</Button>
                        </Stack>

                        <Button 
                            variant="contained" 
                            size="large" 
                            onClick={() => setShowSubmitConfirm(true)} 
                            sx={{ mt: 2, py: 1.5, fontWeight: 'bold' }}
                        >
                            {onomatoToEdit ? "Update Word" : "Save Word"}
                        </Button>
                    </Stack>
                </Box>
            </Modal>

            <ConfirmModal 
                open={showSubmitConfirm}
                title={onomatoToEdit ? "Confirm Update" : "Confirm Save"}
                message={`Are you sure you want to ${onomatoToEdit ? 'update' : 'save'} "${phrase}"?`}
                onClose={() => setShowSubmitConfirm(false)}
                onConfirm={handleActualSubmit}
            />
        </>
    );
}