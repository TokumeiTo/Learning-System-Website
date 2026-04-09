import { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Button, Typography, Chip, IconButton,
    Stack, Box, MenuItem, TextField, CircularProgress,
    Modal,
    Divider,
    List,
    ListItem,
    ListItemText
} from "@mui/material";
import { Edit, History, Add, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { fetchPracticeQuizzes, fetchTestVersions } from "../../api/test.api";
import type { Test } from "../../types_interfaces/test";
import PageLayout from "../../components/layout/PageLayout";

export default function QuizManagementPage() {
    const navigate = useNavigate();
    const [quizzes, setQuizzes] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [selectedHistory, setSelectedHistory] = useState<Test[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    // Filters
    const [level, setLevel] = useState("N5");
    const [category, setCategory] = useState("Vocabulary");
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchPracticeQuizzes(level, category, searchTerm);
                setQuizzes(data);
            } catch (error) {
                console.error("Failed to load quizzes", error);
            } finally {
                setLoading(false);
            }
        };

        const handler = setTimeout(load, 300);
        return () => clearTimeout(handler);

    }, [level, category, searchTerm]);

    const handleViewHistory = async (title: string, isGlobal: boolean) => {
        try {
            setHistoryLoading(true);
            setHistoryOpen(true);
            const versions = await fetchTestVersions(title, isGlobal);
            setSelectedHistory(versions);
        } catch (err) {
            console.error("Failed to load versions");
        } finally {
            setHistoryLoading(false);
        }
    };

    return (
        <PageLayout>
            <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
                {/* Header Section */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight={800}>Quiz Management</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage Hikari Learning practice tests and version history.
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        size="large"
                        startIcon={<Add />}
                        onClick={() => navigate("/admin/quiz/create")}
                        sx={{ borderRadius: 2, fontWeight: 'bold', px: 3 }}
                    >
                        Create New Quiz
                    </Button>
                </Stack>

                {/* Filters Row */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <TextField
                        size="small"
                        placeholder="Search by quiz title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ flexGrow: 1 }} // Takes up remaining space
                        InputProps={{
                            startAdornment: <Search color="action" sx={{ mr: 1 }} />,
                        }}
                    />
                    
                    <TextField
                        select
                        size="small"
                        label="JLPT Level"
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        sx={{ minWidth: 120 }}
                    >
                        {["N5", "N4", "N3", "N2", "N1"].map(l => <MenuItem key={l} value={l}>{l}</MenuItem>)}
                    </TextField>
                    <TextField
                        select
                        size="small"
                        label="Category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        sx={{ minWidth: 150 }}
                    >
                        {["Vocabulary", "Grammar", "Reading", "Listening"].map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
                    </TextField>
                </Paper>

                {/* Table Section */}
                <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'grey.100' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Level</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Passing Grade</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                        <CircularProgress size={30} />
                                        <Typography sx={{ mt: 2 }}>Loading Quizzes...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : quizzes.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                        <Typography color="text.secondary">No quizzes found for this selection.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                quizzes.map((q) => (
                                    <TableRow key={q.id} hover>
                                        <TableCell>
                                            <Typography fontWeight={600}>{q.title}</Typography>
                                        </TableCell>
                                        <TableCell><Chip label={q.jlptLevel} color="primary" variant="outlined" size="small" /></TableCell>
                                        <TableCell>{q.category}</TableCell>
                                        <TableCell>{q.passingGrade}%</TableCell>
                                        <TableCell align="right">
                                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                <IconButton
                                                    color="primary"
                                                    onClick={() => navigate(`/admin/quiz/edit/${q.id}`)}
                                                    title="Edit Content"
                                                >
                                                    <Edit />
                                                </IconButton>
                                                <IconButton
                                                    title="Version History"
                                                    onClick={() => handleViewHistory(q.title, q.isGlobal)}
                                                >
                                                    <History />
                                                </IconButton>
                                            </Stack>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* HISTORY VERSION MODAL */}
            <Modal open={historyOpen} onClose={() => setHistoryOpen(false)}>
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)', width: 500,
                    bgcolor: 'background.paper', borderRadius: 3, boxShadow: 24, p: 4
                }}>
                    <Typography variant="h6" fontWeight="bold" mb={2}>
                        Version History: {selectedHistory[0]?.title}
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    {historyLoading ? (
                        <CircularProgress size={24} sx={{ display: 'block', mx: 'auto', my: 2 }} />
                    ) : (
                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {selectedHistory.map((v, index) => (
                                <ListItem
                                    key={v.id}
                                    divider={index !== selectedHistory.length - 1}
                                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                                    secondaryAction={
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            onClick={() => navigate(`/admin/quiz/edit/${v.id}`)}
                                        >
                                            View/Restore
                                        </Button>
                                    }
                                >
                                    <ListItemText
                                        primary={`Version ${v.version || '?'}`}
                                    />
                                    {index === 0 && <Chip label="Active" color="success" size="small" sx={{ mr: '100px' }} />}
                                </ListItem>
                            ))}
                        </List>
                    )}
                    <Button fullWidth sx={{ mt: 2 }} onClick={() => setHistoryOpen(false)}>Close</Button>
                </Box>
            </Modal>
        </PageLayout>
    );
}