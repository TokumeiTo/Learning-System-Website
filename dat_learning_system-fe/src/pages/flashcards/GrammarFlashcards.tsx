import { Box, FormControl, InputLabel, MenuItem, Select, CircularProgress, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import type { Grammar } from "../../types_interfaces/grammar";
import type { JLPTLevel } from "../../types_interfaces/kanji";
import GrammarCard from "../../components/flashcards/GrammarCard";
import GrammarDetailModal from "../../components/flashcards/GrammarDetailModal";
import GrammarCreateModal from "../../components/flashcards/GrammarCreateModal";
import MessagePopup from "../../components/feedback/MessagePopup";
import SearchBar from "../../components/common/Search"; // Import SearchBar
import AddBoxIcon from '@mui/icons-material/AddBox';
import { getGrammars, getGrammarById } from "../../api/grammar.api";
import { useAuth } from "../../hooks/useAuth";

export default function GrammarFlashcards() {
  const [level, setLevel] = useState<JLPTLevel>("N5");
  const [grammars, setGrammars] = useState<Grammar[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const canManageCourses = user?.position === "Admin" || user?.position === "SuperAdmin";


  // Filter State
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedGrammar, setSelectedGrammar] = useState<Grammar | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [grammarToEdit, setGrammarToEdit] = useState<Grammar | null>(null);

  const [popup, setPopup] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error"
  }>({
    open: false,
    message: "",
    severity: "success"
  });

  const showPopup = (message: string, severity: "success" | "error" = "success") => {
    setPopup({ open: true, message, severity });
  };

  const fetchGrammars = async () => {
    try {
      setLoading(true);
      const data = await getGrammars(level);
      setGrammars(data);
    } catch (error) {
      showPopup("Failed to load grammar data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrammars();
  }, [level]);

  // Logic: Local Filtering
  const filteredGrammars = grammars.filter(g => {
    const searchLower = searchQuery.toLowerCase();
    return (
      g.title.toLowerCase().includes(searchLower) ||
      g.meaning.toLowerCase().includes(searchLower)
    );
  });

  const handleOpenEdit = (grammar: Grammar) => {
    setSelectedGrammar(null);
    setGrammarToEdit(grammar);
    setOpenCreate(true);
  };

  const handleSelectGrammar = async (id: string) => {
    try {
      const fullGrammar = await getGrammarById(id);
      setSelectedGrammar(fullGrammar);
    } catch (error) {
      showPopup("Failed to load details", "error");
    }
  };

  return (
    <>
      {/* Header with JLPT filter, Search, and Add Button */}
      <Box sx={{ mb: 5, display: "flex", flexWrap: "wrap", alignItems: "center", gap: 2 }}>

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

        {/* Search Bar - Taking up remaining space */}
        <Box sx={{ flexGrow: 1 }}>
          <SearchBar
            placeholder="Search grammar title or meaning..."
            options={grammars.map(g => ({ label: `${g.title} – ${g.meaning}` }))}
            onInputChange={(val) => setSearchQuery(val)}
          />
        </Box>

        {canManageCourses && (
          <AddBoxIcon
            sx={{
              cursor: 'pointer',
              fontSize: 40,
              color: 'primary.main',
              transition: '0.2s',
              "&:hover": { transform: 'scale(1.1)' },
              "&:active": { transform: 'scale(0.9)' }
            }}
            onClick={() => setOpenCreate(true)}
          />
        )}

      </Box>

      {/* Grid - Mapping filteredGrammars */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
          {filteredGrammars.length > 0 ? (
            filteredGrammars.map(grammar => (
              <Box key={grammar.id} sx={{ minWidth: 220 }}>
                <GrammarCard
                  grammar={grammar}
                  onClick={() => handleSelectGrammar(grammar.id)}
                />
              </Box>
            ))

          ) : (
            <Typography sx={{ color: 'text.secondary', mt: 5 }}>
              No grammar found matching "{searchQuery}" for {level}
            </Typography>
          )}
        </Box>
      )}

      {/* Modals and Toasts remain the same */}
      <GrammarDetailModal
        open={!!selectedGrammar}
        grammar={selectedGrammar}
        onClose={() => setSelectedGrammar(null)}
        onEdit={handleOpenEdit}
        onRefresh={() => {
          fetchGrammars();
          showPopup("Deleted successfully!");
        }}
      />

      <GrammarCreateModal
        open={openCreate}
        grammarToEdit={grammarToEdit}
        onClose={() => {
          setOpenCreate(false);
          setGrammarToEdit(null);
        }}
        onSuccess={fetchGrammars}
      />

      <MessagePopup
        open={popup.open}
        message={popup.message}
        severity={popup.severity}
        onClose={() => setPopup({ ...popup, open: false })}
      />
    </>
  );
}