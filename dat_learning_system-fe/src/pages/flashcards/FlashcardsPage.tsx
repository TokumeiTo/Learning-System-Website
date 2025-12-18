import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import KanjiFlashcards from "./KanjiFlashcards";
import PageLayout from "../../components/layout/PageLayout";

export default function FlashcardsPage() {
    const [tab, setTab] = useState(0);

    return (
        <PageLayout>
            <Box>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    Flashcards
                </Typography>

                <Tabs value={tab} onChange={(_, v) => setTab(v)}>
                    <Tab label="Kanji" />
                    <Tab label="Vocabulary" disabled />
                    <Tab label="Grammar" disabled />
                    <Tab label="Kana" disabled />
                </Tabs>

                <Box sx={{ mt: 3 }}>
                    {tab === 0 && <KanjiFlashcards />}
                </Box>
            </Box>
        </PageLayout>
    );
}
