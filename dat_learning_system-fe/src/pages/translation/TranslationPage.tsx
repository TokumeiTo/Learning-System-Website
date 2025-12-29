import { Box, Button, TextField, MenuItem, CircularProgress } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import PageLayout from "../../components/layout/PageLayout";

const languages = [
    { code: "ja", label: "Japanese" },
    { code: "en", label: "English" },
];

export default function TranslationPage() {
    const [text, setText] = useState("");
    const [result, setResult] = useState("");
    const [from, setFrom] = useState("ja");
    const [to, setTo] = useState("en");
    const [loading, setLoading] = useState(false);

    const translate = async () => {
        setLoading(true);
        try {
            const res = await axios.post("https://libretranslate.de/translate", {
                q: text,
                source: from,
                target: to,
                format: "text",
            });
            setResult(res.data.translatedText);
        } catch {
            setResult("Translation failed (demo mode)");
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageLayout>
            <Box sx={{ maxWidth: 800 , display: "flex", flexDirection: "column", gap: 2, p: '20px' }}>
                <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                        select
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        label="From"
                    >
                        {languages.map(l => (
                            <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>
                        ))}
                    </TextField>

                    <TextField
                        select
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        label="To"
                    >
                        {languages.map(l => (
                            <MenuItem key={l.code} value={l.code}>{l.label}</MenuItem>
                        ))}
                    </TextField>
                </Box>

                <TextField
                    multiline
                    minRows={4}
                    placeholder="Enter text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <Button variant="contained" onClick={translate} disabled={loading || !text}>
                    {loading ? <CircularProgress size={24} /> : "Translate"}
                </Button>

                <TextField
                    multiline
                    minRows={4}
                    value={result}
                    InputProps={{ readOnly: true }}
                />
            </Box>
        </PageLayout>
    );
}