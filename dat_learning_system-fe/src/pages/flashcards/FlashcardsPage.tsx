import { Box, Tabs, Tab } from "@mui/material";
import { useState } from "react";
import PageLayout from "../../components/layout/PageLayout";
import KanjiFlashcards from "./KanjiFlashcards";
import KanaFlashcards from "./KanaFlashcards";
import TabLoader from "../../components/feedback/TabLoader";
import GrammarFlashcards from "./GrammarFlashcards";

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
      <Box mt="10px" px="20px">
        <Tabs value={tab} onChange={handleChange}>
          <Tab label="Kanji" />
          <Tab label="Vocabulary" disabled />
          <Tab label="Grammar" />
          <Tab label="Kana" />
        </Tabs>

        <Box sx={{ mt: 3 }}>
          {loading && <TabLoader />}

          {!loading && activeTab === 0 && <KanjiFlashcards />}
          {!loading && activeTab === 2 && <GrammarFlashcards />}
          {!loading && activeTab === 3 && <KanaFlashcards />}
        </Box>
      </Box>
    </PageLayout>
  );
}