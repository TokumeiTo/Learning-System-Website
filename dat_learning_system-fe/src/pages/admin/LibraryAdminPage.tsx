import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    IconButton, Chip, Tooltip, CircularProgress, Stack, Avatar, TablePagination,
    TextField, MenuItem, InputAdornment
} from '@mui/material';
import { Add, Edit, Delete, FileDownload, Visibility, FiberManualRecord, Search } from '@mui/icons-material';
import PageLayout from '../../components/layout/PageLayout';
import EBookFormDialog from '../../components/ebooks/EBookFormDialog';
import { fetchAllBooks, createBook, updateBook, deleteBook } from '../../api/library.api';
import type { EBook } from '../../types_interfaces/library';
import MessagePopup from '../../components/feedback/MessagePopup';
import ConfirmModal from '../../components/feedback/ConfirmModal';

const LibraryAdminPage: React.FC = () => {
    const [books, setBooks] = useState<EBook[]>([]);
    const [loading, setLoading] = useState(true);

    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(30);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<EBook | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [popup, setPopup] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [bookToDelete, setBookToDelete] = useState<number | null>(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All');
    const [categories] = useState(['All', 'Japanese', 'English', 'IT', 'Business', 'Grammar']);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            loadData();
        }, 500); // Wait 500ms after last keystroke

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, category, page, rowsPerPage]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Pass the filters to your API call
            const data = await fetchAllBooks(
                page + 1,
                rowsPerPage,
                category === 'All' ? undefined : category,
                searchQuery
            );
            setBooks(data.items);
            setTotalCount(data.totalCount);
        } catch (error) {
            console.error("Failed to load books", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [page, rowsPerPage]);

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSave = async (formData: FormData) => {
        try {
            setIsUploading(true);
            const res = selectedBook
                ? await updateBook(selectedBook.id, formData, setUploadProgress)
                : await createBook(formData, setUploadProgress);

            setPopup({ open: true, message: res.message, severity: "success" });
            setIsDialogOpen(false);
            await loadData();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Save failed.";
            setPopup({ open: true, message: errorMsg, severity: "error" });
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDeleteClick = (id: number) => {
        setBookToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!bookToDelete) return;

        try {
            const res = await deleteBook(bookToDelete);

            // Success feedback
            setPopup({
                open: true,
                message: res.message,
                severity: "success"
            });

            await loadData();
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || "Failed to delete resource.";
            setPopup({ open: true, message: errorMsg, severity: "error" });
        } finally {
            setDeleteModalOpen(false);
            setBookToDelete(null);
        }
    };

    return (
        <PageLayout>
            <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
                {/* Modern Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={900} letterSpacing="-0.5px">
                            Resource Inventory
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Books: <b>{totalCount}</b>
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => { setSelectedBook(null); setIsDialogOpen(true); }}
                        sx={{
                            borderRadius: 3, px: 3, py: 1, fontWeight: 800,
                            boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                            textTransform: 'none'
                        }}
                    >
                        Add New Resource
                    </Button>
                </Stack>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                    {/* Search Field */}
                    <TextField
                        placeholder="Search by title or author..."
                        size="small"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                        sx={{ flexGrow: 1, bgcolor: 'background.paper', borderRadius: 1 }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: 'text.secondary', fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        }}
                    />

                    {/* Category Filter */}
                    <TextField
                        select
                        size="small"
                        label="Category"
                        value={category}
                        onChange={(e) => { setCategory(e.target.value); setPage(0); }}
                        sx={{ minWidth: 150, bgcolor: 'background.paper', borderRadius: 1 }}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat}
                            </MenuItem>
                        ))}
                    </TextField>
                </Stack>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>
                ) : (
                    <TableContainer component={Paper} sx={{ borderRadius: 4, boxShadow: '0 2px 15px rgba(0,0,0,0.05)', border: 'none', overflow: 'hidden' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800, color: '#475569' }}>Resource Information</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>Description</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>Visibility</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>Engagement</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 800, color: '#475569' }}>File Location</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 800, color: '#475569' }}>Manage</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody sx={{ bgcolor: 'background.paper' }}>
                                {books.map((book) => (
                                    <TableRow key={book.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar
                                                    variant="rounded"
                                                    src={`${import.meta.env.VITE_API_URL}${book.thumbnailUrl}`}
                                                    sx={{ width: 45, height: 60, borderRadius: 1.5, border: '1px solid #e2e8f0' }}
                                                />
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={800}>{book.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary" display="block">{book.author}</Typography>
                                                    <Chip label={book.category} size="small" sx={{ mt: 0.5, height: 18, fontSize: '0.6rem', fontWeight: 900, textTransform: 'uppercase' }} />
                                                </Box>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Stack direction="row" spacing={2} justifyContent="center">
                                                <Typography variant="caption" color="text.secondary" display="block">{book.description}</Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell align="center">
                                            <Chip
                                                icon={<FiberManualRecord sx={{ fontSize: '10px !important' }} />}
                                                label={book.isActive ? "Published" : "Hidden"}
                                                size="small"
                                                color={book.isActive ? "success" : "default"}
                                                variant="outlined"
                                                sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                            />
                                        </TableCell>

                                        <TableCell align="center">
                                            <Stack direction="row" spacing={1} justifyContent="center">
                                                <Tooltip title="Read counts">
                                                    <Stack direction="row" alignItems="center" sx={{ color: '#64748b' }}>
                                                        <Visibility sx={{ fontSize: 14, mr: 0.5 }} />
                                                        <Typography variant="caption" fontWeight={700}>{book.totalReaderCount}</Typography>
                                                    </Stack>
                                                </Tooltip>
                                                <Tooltip title="Download counts">
                                                    <Stack direction="row" alignItems="center" sx={{ color: '#64748b' }}>
                                                        <FileDownload sx={{ fontSize: 14, mr: 0.5 }} />
                                                        <Typography variant="caption" fontWeight={700}>{book.totalDownloadCount}</Typography>
                                                    </Stack>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>

                                        <TableCell>
                                            <Stack direction="row" spacing={2} justifyContent="center">
                                                <Typography variant="caption" color="text.secondary" display="block">{book.fileUrl}</Typography>
                                            </Stack>
                                        </TableCell>

                                        <TableCell align="right">
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedBook(book);
                                                    setIsDialogOpen(true);
                                                }}
                                                sx={{ color: '#6366f1' }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton onClick={() => handleDeleteClick(book.id)} sx={{ color: '#ef4444' }}>
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        <TablePagination
                            component="div"
                            count={totalCount}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            rowsPerPageOptions={[5, 10, 25, 30, 50]}
                            sx={{
                                borderTop: '1px solid cyan',
                                bgcolor: 'background.default',
                                '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
                                    fontWeight: 600,
                                    color: '#64748b'
                                }
                            }}
                        />
                    </TableContainer>
                )}
            </Box>

            <EBookFormDialog
                open={isDialogOpen}
                initialData={selectedBook}
                onClose={() => setIsDialogOpen(false)}
                onSave={handleSave}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
            />

            <MessagePopup
                open={popup.open} message={popup.message} severity={popup.severity}
                onClose={() => setPopup({ ...popup, open: false })}
            />

            <ConfirmModal
                open={deleteModalOpen}
                title="Confirm Deletion"
                message="Are you sure you want to delete this Book? Please copy or reconsider your Resources, they may be lost."
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                confirmColor="error"
            />
        </PageLayout>
    );
};

export default LibraryAdminPage;