import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { grammarMockData, type Grammar } from "../../mocks/grammar.mock";
import type { JLPTLevel } from "../../types/kanji";
import GrammarCard from "../../components/flashcards/GrammarCard";
import GrammarDetailModal from "../../components/flashcards/GrammarDetailModal";

export default function FlashcardsPage() {
  const [level, setLevel] = useState<JLPTLevel>("N5");
  const [selectedGrammar, setSelectedGrammar] = useState<Grammar | null>(null);

  const filteredGrammar = grammarMockData.filter(
    g => g.jlptLevel === level
  );

  return (
    <>
      {/* Header */}
      <Box sx={{ mb: 5 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>JLPT</InputLabel>
          <Select
            value={level}
            label="JLPT"
            onChange={(e) => setLevel(e.target.value as JLPTLevel)}
          >
            <MenuItem value="N5">N5</MenuItem>
            <MenuItem value="N4">N4</MenuItem>
            <MenuItem value="N3" disabled>N3</MenuItem>
            <MenuItem value="N2" disabled>N2</MenuItem>
            <MenuItem value="N1" disabled>N1</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Grammar Flashcards Grid */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {filteredGrammar.map(grammar => (
          <Box key={grammar.id} sx={{ minWidth: 220 }}>
            <GrammarCard
              grammar={grammar}
              onClick={() => setSelectedGrammar(grammar)}
            />
          </Box>
        ))}
      </Box>

      {/* Grammar Detail */}
      <GrammarDetailModal
        open={!!selectedGrammar}
        grammar={selectedGrammar}
        onClose={() => setSelectedGrammar(null)}
      />
    </>
  );
}
