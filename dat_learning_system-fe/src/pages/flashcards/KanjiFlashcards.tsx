import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { kanjiMockData } from "../../mocks/kanji.mock";
import type { Kanji, JLPTLevel } from "../../types/kanji";
import KanjiCard from "../../components/flashcards/KanjiCard";
import KanjiDetailModal from "../../components/flashcards/KanjiDetailModal";
import KanjiCreateModal from "../../components/flashcards/KanjiCreateModal";
import SearchBar from "../../components/common/Search";
import AddBoxIcon from '@mui/icons-material/AddBox';

export default function KanjiFlashcards() {
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);
  const [level, setLevel] = useState<JLPTLevel>("N5");
  const [openCreate, setOpenCreate] = useState(false);

  const filteredKanji = kanjiMockData.filter(
    kanji => kanji.jlptLevel === level
  );

  return (
    <>
      {/* Header */}
      <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>JLPT</InputLabel>
          <Select
            value={level}
            label="JLPT"
            onChange={(e) => setLevel(e.target.value as JLPTLevel)}
          >
            <MenuItem value="N5">N5</MenuItem>
            <MenuItem value="N4" disabled>N4</MenuItem>
            <MenuItem value="N3" disabled>N3</MenuItem>
            <MenuItem value="N2" disabled>N2</MenuItem>
            <MenuItem value="N1" disabled>N1</MenuItem>
          </Select>
        </FormControl>

        <SearchBar
          placeholder="Search kanji or meaning"
          options={kanjiMockData.map(k => ({
            label: `${k.kanji} – ${k.meaning}`,
          }))}
          onSelect={(value) => console.log("Selected:", value)}
        />


        <AddBoxIcon sx={{
          cursor: 'pointer', 
          "&:hover": {
            transform: 'scale(1.05)',
          },
          "&:active": {
            transform: 'scale(0.95)',
          }
        }} onClick={() => setOpenCreate(true)} fontSize="large" color="primary" />

      </Box>

      {/* Kanji Grid */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
        {filteredKanji.map(kanji => (
          <Box key={kanji.id} sx={{ minWidth: 200 }}>
            <KanjiCard
              kanji={kanji}
              onClick={() => setSelectedKanji(kanji)}
            />
          </Box>
        ))}
      </Box>

      {/* Detail Modal */}
      <KanjiDetailModal
        open={!!selectedKanji}
        kanji={selectedKanji}
        onClose={() => setSelectedKanji(null)}
      />

      {/* Create Modal */}
      <KanjiCreateModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </>
  );
}