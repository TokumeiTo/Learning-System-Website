import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import PageLayout from "../../components/layout/PageLayout";
import KanjiFlashcards from "./KanjiFlashcards";
import KanaFlashcards from "./KanaFlashcards";
import TabLoader from "../../components/feedback/TabLoader";

export default function FlashcardsPage() {
  const [tab, setTab] = useState(0);        // currently selected tab
  const [loading, setLoading] = useState(false); // loading state
  const [activeTab, setActiveTab] = useState(0); // actual rendered tab

  const handleChange = (_: any, newValue: number) => {
    setLoading(true);          // start loading
    setTimeout(() => {
      setActiveTab(newValue);  // switch content after 2s
      setLoading(false);       // stop loading
    }, 1200);                  // 2-second delay
    setTab(newValue);          // still update tab UI immediately
  };

  return (
    <PageLayout>
      <Box>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Flashcards
        </Typography>

        <Tabs value={tab} onChange={handleChange}>
          <Tab label="Kanji" />
          <Tab label="Vocabulary" disabled />
          <Tab label="Grammar" disabled />
          <Tab label="Kana" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {loading && <TabLoader />}

          {!loading && activeTab === 0 && <KanjiFlashcards />}
          {!loading && activeTab === 3 && <KanaFlashcards />}
        </Box>
      </Box>
    </PageLayout>
  );
}
