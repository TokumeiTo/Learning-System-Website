import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Button, Paper, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    IconButton, Chip, Tooltip, CircularProgress, Stack, Avatar, TablePagination
} from '@mui/material';
import { Add, Edit, Delete, FileDownload, Visibility, FiberManualRecord } from '@mui/icons-material';
import PageLayout from '../../components/layout/PageLayout';
import EBookFormDialog from '../../components/ebooks/EBookFormDialog';
import { fetchAllBooks, createBook, updateBook, deleteBook } from '../../api/library.api';
import type { EBook } from '../../types_interfaces/library';

const LibraryAdminPage: React.FC = () => {
    const [books, setBooks] = useState<EBook[]>([]);
    const [loading, setLoading] = useState(true);

    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(0);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedBook, setSelectedBook] = useState<EBook | null>(null);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await fetchAllBooks();
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
            if (selectedBook) {
                await updateBook(selectedBook.id, formData, (pct) => setUploadProgress(pct));
            } else {
                await createBook(formData, (pct) => setUploadProgress(pct));
            }
            setIsDialogOpen(false);
            await loadData();
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Move this resource to trash? Students will lose access immediately.")) {
            await deleteBook(id);
            loadData();
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
                            Total Records: <b>{totalCount}</b>
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
                                                <Tooltip title="Readers">
                                                    <Stack direction="row" alignItems="center" sx={{ color: '#64748b' }}>
                                                        <Visibility sx={{ fontSize: 14, mr: 0.5 }} />
                                                        <Typography variant="caption" fontWeight={700}>{book.totalReaderCount}</Typography>
                                                    </Stack>
                                                </Tooltip>
                                                <Tooltip title="Downloads">
                                                    <Stack direction="row" alignItems="center" sx={{ color: '#64748b' }}>
                                                        <FileDownload sx={{ fontSize: 14, mr: 0.5 }} />
                                                        <Typography variant="caption" fontWeight={700}>{book.totalDownloadCount}</Typography>
                                                    </Stack>
                                                </Tooltip>
                                            </Stack>
                                        </TableCell>

                                        <TableCell align="right">
                                            <IconButton onClick={() => setSelectedBook(book)} sx={{ color: '#6366f1' }}><Edit fontSize="small" /></IconButton>
                                            <IconButton onClick={() => handleDelete(book.id)} sx={{ color: '#ef4444' }}><Delete fontSize="small" /></IconButton>
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
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            sx={{
                                borderTop: '1px solid #e2e8f0',
                                bgcolor: '#f8fafc',
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
        </PageLayout>
    );
};

export default LibraryAdminPage;