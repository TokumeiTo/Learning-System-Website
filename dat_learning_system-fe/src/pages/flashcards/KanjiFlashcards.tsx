import { Box, FormControl, InputLabel, MenuItem, Select, CircularProgress } from "@mui/material";
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
  const [level, setLevel] = useState<JLPTLevel>("N5");
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

  return (
    <>
      {/* Header */}
      <Box sx={{ mb: 5, display: "flex", justifyContent: "space-between", gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>JLPT</InputLabel>
          <Select
            value={level}
            label="JLPT"
            onChange={(e) => setLevel(e.target.value as JLPTLevel)}
          >
            <MenuItem value="N5">N5</MenuItem>
            <MenuItem value="N4">N4</MenuItem>
            <MenuItem value="N3">N3</MenuItem>
            <MenuItem value="N2">N2</MenuItem>
            <MenuItem value="N1">N1</MenuItem>
          </Select>
        </FormControl>

        <SearchBar
          placeholder="Search kanji or meaning"
          options={kanjis.map(k => ({
            label: `${k.character} – ${k.meaning}`,
          }))}
          // Change 'value' to string if that's what SearchBar returns
          onSelect={(value: string) => {
            const found = kanjis.find(k => `${k.character} – ${k.meaning}` === value);
            if (found) setSelectedKanji(found);
          }}
        />
        <AddBoxIcon sx={{
          cursor: 'pointer',
          "&:hover": { transform: 'scale(1.05)' },
          "&:active": { transform: 'scale(0.95)' }
        }} onClick={() => setOpenCreate(true)} fontSize="large" color="primary" />
      </Box>

      {/* Kanji Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2 }}>
          {kanjis.map(kanji => (
            <Box key={kanji.id} sx={{ minWidth: 200 }}>
              <KanjiCard
                kanji={kanji}
                onClick={() => setSelectedKanji(kanji)}
              />
            </Box>
          ))}
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