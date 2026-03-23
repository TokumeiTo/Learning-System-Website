import { useEffect, useState, useMemo } from "react";
import { Box, Button, Typography, CircularProgress, TextField, MenuItem, Select, FormControl, InputLabel, InputAdornment } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import type { Onomatopoeia } from "../../types_interfaces/onomatopoeia";
import { ONOMATO_CATEGORIES } from "../../utils/onomato_type_category";
import { getAllOnomato, deleteOnomato } from "../../api/onomatopoeia.api";
import OnomatoFlashcard from "../../components/flashcards/OnomatoSpecificFlashcard";
import OnomatoCreateModal from "../../components/flashcards/OnomatoCreateModal";
import ConfirmModal from "../../components/feedback/ConfirmModal";
import { useAuth } from "../../hooks/useAuth";

export default function OnomatoFlashcards() {
    const [list, setList] = useState<Onomatopoeia[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const canManageCourses = user?.position === "Admin" || user?.position === "SuperAdmin";

    // Search & Filter State
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Modal & Delete States
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [onomatoToEdit, setOnomatoToEdit] = useState<Onomatopoeia | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getAllOnomato();
            setList(data);
        } catch (error) {
            console.error("Error loading Onomatopoeia:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, []);

    // --- Filter Logic ---
    // We use useMemo so we don't re-filter on every tiny render, only when search/category/list changes
    const filteredList = useMemo(() => {
        return list.filter(item => {
            const matchesSearch =
                item.phrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.meaning.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.romaji.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;

            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory, list]);

    // --- Handlers ---
    const handleEditRequest = (item: Onomatopoeia) => {
        setOnomatoToEdit(item);
        setOpenCreateModal(true);
    };

    const handleDeleteRequest = (id: number) => {
        setDeleteId(id);
        setOpenDeleteConfirm(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            await deleteOnomato(deleteId);
            await loadData();
            setOpenDeleteConfirm(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
    );

    return (
        <Box>
            {/* Search and Filter Bar */}
            <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ width: '200px' }}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <MenuItem value="All">All Categories</MenuItem>
                        {ONOMATO_CATEGORIES.map(cat => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    placeholder="Search by phrase, meaning, or romaji..."
                    variant="outlined"
                    size="small"
                    sx={{ flex: 1, minWidth: '250px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                />
                {canManageCourses && (
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setOnomatoToEdit(null); setOpenCreateModal(true); }}>
                        Add New
                    </Button>
                )}
            </Box>

            {/* Flex Container for Cards */}
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'flex-start' }}>
                {filteredList.map((item) => (
                    <Box
                        key={item.id}
                        sx={{
                            flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 24px)', md: '1 1 calc(33.333% - 24px)' },
                            maxWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' }
                        }}
                    >
                        <OnomatoFlashcard
                            data={item}
                            onEdit={handleEditRequest}
                            onDelete={handleDeleteRequest}
                        />
                    </Box>
                ))}

                {filteredList.length === 0 && (
                    <Box sx={{ width: '100%', py: 10, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 2 }}>
                        <Typography color="text.secondary">No matching onomatopoeia found.</Typography>
                    </Box>
                )}
            </Box>

            {/* Modals */}
            <OnomatoCreateModal
                open={openCreateModal}
                onomatoToEdit={onomatoToEdit}
                onClose={() => setOpenCreateModal(false)}
                onSuccess={loadData}
            />

            <ConfirmModal
                open={openDeleteConfirm}
                title="Delete Word"
                message="Are you sure? This will permanently remove this flashcard."
                onClose={() => setOpenDeleteConfirm(false)}
                onConfirm={handleConfirmDelete}
            />
        </Box>
    );
}