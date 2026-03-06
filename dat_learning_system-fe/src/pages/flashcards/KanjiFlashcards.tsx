import { Box, FormControl, InputLabel, MenuItem, Select, CircularProgress, Typography, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import type { Kanji, JLPTLevel } from "../../types_interfaces/kanji";
import { getKanjis } from "../../api/kanji.api";
import KanjiCard from "../../components/flashcards/KanjiCard";
import KanjiDetailModal from "../../components/flashcards/KanjiDetailModal";
import KanjiCreateModal from "../../components/flashcards/KanjiCreateModal";
import SearchBar from "../../components/common/Search";
import AddBoxIcon from '@mui/icons-material/AddBox';

export default function KanjiFlashcards() {
  const [kanjis, setKanjis] = useState<Kanji[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKanji, setSelectedKanji] = useState<Kanji | null>(null);

  // Filter States
  const [level, setLevel] = useState<JLPTLevel>("N5");
  const [searchQuery, setSearchQuery] = useState("");
  const [maxStrokes, setMaxStrokes] = useState<number | string>("");

  const [openCreate, setOpenCreate] = useState(false);
  const [kanjiToEdit, setKanjiToEdit] = useState<Kanji | null>(null);

  // Fetch data from Backend
  const fetchKanjis = async () => {
    try {
      setLoading(true);
      const data = await getKanjis(level);
      setKanjis(data);
    } catch (error) {
      console.error("Failed to fetch Kanjis:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (kanji: Kanji) => {
    setSelectedKanji(null); // Close the detail modal
    setKanjiToEdit(kanji);  // Set the data for the create/edit modal
    setOpenCreate(true);    // Open the create/edit modal
  };

  useEffect(() => {
    fetchKanjis();
  }, [level]);

  const filteredKanjis = kanjis.filter(k => {
    const matchesSearch =
      k.character.includes(searchQuery) ||
      k.meaning.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.romaji?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStrokes = maxStrokes === "" || k.strokes == Number(maxStrokes);

    return matchesSearch && matchesStrokes;
  });

  return (
    <>
      <Box sx={{ mb: 5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>
        {/* 1. JLPT Level Filter (Triggers API Fetch) */}
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>JLPT</InputLabel>
          <Select
            value={level}
            label="JLPT"
            onChange={(e) => setLevel(e.target.value as JLPTLevel)}
          >
            {["N5", "N4", "N3", "N2", "N1"].map(l => (
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* 2. Stroke Count Filter (Local Filter) */}
        <TextField
          label="Strokes"
          type="number"
          size="small"
          sx={{ width: 120 }}
          value={maxStrokes}
          onChange={(e) => setMaxStrokes(e.target.value)}
        />

        {/* 3. Search Bar (Local Filter) */}
        <Box sx={{ flexGrow: 1 }}>
          <SearchBar
            placeholder="Search kanji or meaning"
            options={kanjis.map(k => ({ label: `${k.character} – ${k.meaning}` }))}
            onInputChange={(val) => setSearchQuery(val)} 
          />
        </Box>

        <AddBoxIcon
          sx={{ cursor: 'pointer', color: 'primary.main' }}
          fontSize="large"
          onClick={() => setOpenCreate(true)}
        />
      </Box>

      {/* Kanji Grid - Map the FILTERED list, not the raw list */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
          {filteredKanjis.length > 0 ? (
            filteredKanjis.map(kanji => (
              <Box key={kanji.id} sx={{ minWidth: 200 }}>
                <KanjiCard kanji={kanji} onClick={() => setSelectedKanji(kanji)} />
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 5, color: 'text.secondary' }}>
              No Kanji found matching your criteria.
            </Typography>
          )}
        </Box>
      )}

      {/* Detail Modal */}
      <KanjiDetailModal
        open={!!selectedKanji}
        kanji={selectedKanji}
        onClose={() => setSelectedKanji(null)}
        onRefresh={fetchKanjis}
        onEdit={handleOpenEdit}
      />

      {/* Create Modal */}
      <KanjiCreateModal
        open={openCreate}
        kanjiToEdit={kanjiToEdit} // Pass the data here!
        onClose={() => {
          setOpenCreate(false);
          setKanjiToEdit(null); // Clear edit state on close
        }}
        onSuccess={fetchKanjis}
      />
    </>
  );
}