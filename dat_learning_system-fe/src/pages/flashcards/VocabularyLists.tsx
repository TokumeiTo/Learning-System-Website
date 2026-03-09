import {
  Box, FormControl, InputLabel, MenuItem, Select, CircularProgress,
  Typography, Stack, Chip, IconButton, Tooltip
} from "@mui/material";
import { useState, useEffect, useMemo } from "react";
import type { JLPTLevel } from "../../types_interfaces/kanji";
import type { Vocabulary } from "../../types_interfaces/vocabulary";
import { getVocabularies, getVocabById } from "../../api/vocabulary.api";
import SearchBar from "../../components/common/Search";
import AddBoxIcon from '@mui/icons-material/AddBox';
import VocabCreateModal from "../../components/flashcards/VocabularyCreateModal";
import VocabDetailModal from "../../components/flashcards/VocabularyDetailModal";
import { useAuth } from "../../hooks/useAuth";

export default function VocabularyLists() {
  const [vocabs, setVocabs] = useState<Vocabulary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVocab, setSelectedVocab] = useState<Vocabulary | null>(null);

  // Filter States
  const [level, setLevel] = useState<JLPTLevel>("N5");
  const [searchQuery, setSearchQuery] = useState("");
  const [posFilter, setPosFilter] = useState<string>("All");
  const { user } = useAuth();
  const canManageCourses = user?.position === "Admin" || user?.position === "SuperAdmin";

  const [openCreate, setOpenCreate] = useState(false);
  const [vocabToEdit, setVocabToEdit] = useState<Vocabulary | null>(null);

  const fetchVocabs = async () => {
    try {
      setLoading(true);
      const data = await getVocabularies(level);
      setVocabs(data);
    } catch (error) {
      console.error("Failed to fetch Vocabulary:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVocabs();
  }, [level]);

  const handleOpenDetail = async (id: string) => {
    try {
      const fullVocab = await getVocabById(id);
      setSelectedVocab(fullVocab);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handleOpenEdit = (vocab: Vocabulary) => {
    setSelectedVocab(null);
    setVocabToEdit(vocab);
    setOpenCreate(true);
  };

  // Local Filtering Logic with useMemo for performance
  const filteredVocabs = useMemo(() => {
    return vocabs.filter(v => {
      const matchesSearch =
        v.word.includes(searchQuery) ||
        v.reading.includes(searchQuery) ||
        v.meaning.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPos = posFilter === "All" || v.partOfSpeech === posFilter;
      return matchesSearch && matchesPos;
    });
  }, [vocabs, searchQuery, posFilter]);

  return (
    <>
      <Box sx={{ mb: 4, display: "flex", flexWrap: "wrap", justifyContent:'space-between', gap: 2 }}>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>JLPT</InputLabel>
          <Select value={level} label="JLPT" onChange={(e) => setLevel(e.target.value as JLPTLevel)}>
            {["N5", "N4", "N3", "N2", "N1"].map(l => (
              <MenuItem key={l} value={l}>{l}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Type</InputLabel>
          <Select value={posFilter} label="Type" onChange={(e) => setPosFilter(e.target.value)}>
            <MenuItem value="All">All Types</MenuItem>
            {["Noun", "Verb", "Adjective", "Adverb", "Particle", "Expression"].map(type => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ flexGrow: 1 }}>
          <SearchBar
            placeholder="Search words..."
            options={vocabs.map(v => ({ label: `${v.word} (${v.reading})` }))}
            onInputChange={(val) => setSearchQuery(val)}
          />
        </Box>

        {canManageCourses && (
          <Tooltip title="Add New Vocabulary">
            <IconButton onClick={() => setOpenCreate(true)} sx={{ color: 'primary.main' }}>
              <AddBoxIcon sx={{ fontSize: 40 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
      ) : (
        <Stack spacing={1.5}>
          {filteredVocabs.length > 0 ? (
            filteredVocabs.map((vocab) => (
              <Box
                key={vocab.id}
                onClick={() => handleOpenDetail(vocab.id)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  p: 2,
                  bgcolor: 'background.paper',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateX(8px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    borderColor: 'primary.light',
                    bgcolor: 'primary.50'
                  }
                }}
              >
                {/* Visual Accent Side-Bar */}
                <Box sx={{ width: 4, height: 40, bgcolor: 'primary.main', borderRadius: 4, mr: 3 }} />

                <Box sx={{ minWidth: 120 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                    {vocab.word}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: 1 }}>
                    {vocab.reading}
                  </Typography>
                </Box>

                <Box sx={{ flexGrow: 1, ml: 2 }}>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {vocab.meaning}
                  </Typography>
                </Box>

                <Chip
                  label={vocab.partOfSpeech}
                  size="small"
                  sx={{
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    bgcolor: 'primary.100',
                    color: 'primary.dark'
                  }}
                />
              </Box>
            ))
          ) : (
            <Typography align="center" color="text.secondary" sx={{ py: 10 }}>
              No vocabulary found.
            </Typography>
          )}
        </Stack>
      )}

      <VocabDetailModal
        open={!!selectedVocab}
        vocab={selectedVocab}
        onClose={() => setSelectedVocab(null)}
        onRefresh={fetchVocabs}
        onEdit={handleOpenEdit}
      />

      <VocabCreateModal
        open={openCreate}
        vocabToEdit={vocabToEdit}
        onClose={() => {
          setOpenCreate(false);
          setVocabToEdit(null);
        }}
        onSuccess={fetchVocabs}
      />
    </>
  );
}