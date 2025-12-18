import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import { kanjiMockData } from "../../mocks/kanji.mock";
import type { Kanji, JLPTLevel } from "../../types/kanji";
import KanjiCard from "../../components/flashcards/KanjiCard";
import KanjiDetailModal from "../../components/flashcards/KanjiDetailModal";
import SearchBar from "../../components/common/Search";

const searchOptions = kanjiMockData.map(k => ({
  label: `${k.kanji} – ${k.meaning}`,
}));


export default function KanjiFlashcards() {
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);
  const [level, setLevel] = useState<JLPTLevel>("N5");

  const filteredKanji = kanjiMockData.filter(
    kanji => kanji.jlptLevel === level
  );

  return (
    <>
      {/* Header */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
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
          options={searchOptions}
          onSelect={(value) => console.log("Selected:", value)}
        />
      </Box>

      {/* Kanji Grid (Flex) */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 2,
        }}
      >
        {filteredKanji.map(kanji => (
          <Box
            key={kanji.id}
            sx={{
              minWidth: '200px',
              width: {
                xs: "48%",
                sm: "31%",
                md: "10%",
              },
            }}
          >
            <KanjiCard
              kanji={kanji}
              onClick={() => setSelectedKanji(kanji)}
            />
          </Box>
        ))}
      </Box>

      <KanjiDetailModal
        open={!!selectedKanji}
        kanji={selectedKanji}
        onClose={() => setSelectedKanji(null)}
      />
    </>
  );
}
