import React from 'react';
import { Stack, Chip, Paper, InputBase, FormControl, Select, MenuItem, IconButton } from '@mui/material';
import { Search, Sort, Dashboard, Terminal, Translate, Language, Close } from '@mui/icons-material';

interface FilterProps {
    activeCategory: string;
    setActiveCategory: (cat: string) => void;
    sortBy: string;
    setSortBy: (sort: string) => void;
    searchTerm: string;      // Added
    setSearchTerm: (term: string) => void; // Added
}

const LibraryFilters: React.FC<FilterProps> = ({
    activeCategory, setActiveCategory, sortBy, setSortBy, searchTerm, setSearchTerm
}) => {
    const categories = [
        { label: 'All', icon: <Dashboard fontSize="small" /> },
        { label: 'IT', icon: <Terminal fontSize="small" /> },
        { label: 'Japanese', icon: <Translate fontSize="small" /> },
        { label: 'English', icon: <Language fontSize="small" /> },
    ];

    return (
        <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={3}
            justifyContent="space-between"
            alignItems={{ xs: 'start', lg: 'center' }}
            sx={{ mb: 6 }}
        >
            <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', width: '100%', pb: { xs: 1, lg: 0 } }}>
                {categories.map((cat) => (
                    <Chip
                        key={cat.label}
                        label={cat.label}
                        icon={cat.icon}
                        onClick={() => setActiveCategory(cat.label)}
                        color={activeCategory === cat.label ? "primary" : "default"}
                        variant={activeCategory === cat.label ? "filled" : "outlined"}
                        sx={{ px: 2, py: 2.5, borderRadius: 3, fontWeight: 700 }}
                    />
                ))}
            </Stack>

            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', lg: 'auto' } }}>
                <Paper
                    elevation={0}
                    sx={{
                        display: 'flex', alignItems: 'center', px: 2, py: 0.5,
                        borderRadius: 3,
                        bgcolor: 'background.paper',
                        // Logic: if there's a search term, make the border blue to show it's "Active"
                        border: searchTerm ? '1px solid #3b82f6' : '1px solid #e2e8f0',
                        boxShadow: searchTerm ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
                        transition: 'all 0.2s ease',
                        width: { xs: '100%', lg: 300 }
                    }}
                >
                    <Search sx={{ color: searchTerm ? 'primary.main' : 'gray', fontSize: 20 }} />
                    <InputBase
                        sx={{ ml: 1, flex: 1, fontSize: 14 }}
                        placeholder="Search titles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                            <Close sx={{ fontSize: 16 }} />
                        </IconButton>
                    )}
                </Paper>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        startAdornment={<Sort sx={{ mr: 1, fontSize: 18, color: 'gray' }} />}
                        sx={{ borderRadius: 3, bgcolor: 'background.paper' }}
                    >
                        <MenuItem value="Newest">Newest</MenuItem>
                        <MenuItem value="Popular">Popular</MenuItem>
                        <MenuItem value="Rating">Rating</MenuItem>
                    </Select>
                </FormControl>
            </Stack>
        </Stack>
    );
};

export default LibraryFilters;