import React, { useEffect, useState } from 'react';
import {
    Box, Button, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Chip, Stack,
    Dialog, DialogTitle, DialogContent, TextField,
    MenuItem, DialogActions, CircularProgress,
    Switch,
    FormControlLabel,
    Tooltip
} from '@mui/material';
import { Add, Edit, Delete, History, FiberManualRecord, PlaylistAddOutlined } from '@mui/icons-material';
import { format } from 'date-fns';
import PageLayout from '../../components/layout/PageLayout';
import { getAdminAnnouncements, upsertAnnouncement, deleteAnnouncement } from '../../api/announce_noti.api';
import type { Announcement, UpsertAnnouncementRequest } from '../../types_interfaces/noti_announce';
import MessagePopup from '../../components/feedback/MessagePopup';

const AnnouncementManagementPage = () => {
    const [list, setList] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(false);
    const [selected, setSelected] = useState<UpsertAnnouncementRequest>({
        title: '',
        content: '',
        targetPositions: [],
        displayUntil: '',
    });
    const [showExpired, setShowExpired] = useState(false);

    const [popup, setPopup] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const isExpired = (date: string) => new Date(date) < new Date();

    const filteredList = list.filter(item => showExpired || !isExpired(item.displayUntil));

    const fetchAll = async () => {
        setLoading(true);
        try {
            const data = await getAdminAnnouncements();
            setList(data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchAll(); }, []);

    const handleOpenModal = (item?: Announcement) => {
        if (item) {
            setSelected({
                id: item.id,
                title: item.title,
                content: item.content,
                targetPositions: item.targetPosition
                    ? item.targetPosition.split(',')
                    : [],
                displayUntil: item.displayUntil
            });
        } else {
            setSelected({ id: undefined, title: '', content: '', targetPositions: [], displayUntil: '' });
        }
        setOpenModal(true);
    };

    const handleSave = async () => {
        if (!selected) return;
        try {
            const payload = { ...selected };
            if (payload.displayUntil) {
                payload.displayUntil = new Date(payload.displayUntil).toISOString();
            }
            await upsertAnnouncement(selected);
            setPopup({ open: true, message: 'Announcement synced successfully', severity: 'success' });
            setOpenModal(false);
            fetchAll();
        } catch (err) {
            setPopup({ open: true, message: 'Failed to save', severity: 'error' });
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await deleteAnnouncement(id);
            setList(prev => prev.filter(a => a.id !== id));
        } catch (err) { console.error(err); }
    };

    return (
        <PageLayout>
            <Box sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight={900}>Announcements</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Manage what users see on their dashboard banners.
                        </Typography>
                    </Box>

                    <Stack direction="row" spacing={3} alignItems="center">
                        <FormControlLabel
                            control={<Switch checked={showExpired} onChange={(e) => setShowExpired(e.target.checked)} />}
                            label="Show Expired"
                        />
                        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal()}>
                            Create New
                        </Button>
                    </Stack>
                </Stack>

                <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: 'action.hover' }}>
                            <TableRow>
                                <TableCell width="120px">Status</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Target</TableCell>
                                <TableCell>Expires</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow><TableCell colSpan={5} align="center" sx={{ py: 8 }}><CircularProgress /></TableCell></TableRow>
                            ) : filteredList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                        <Typography color="text.secondary">No announcements found matching your filter.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredList.map((item) => (
                                <TableRow key={item.id} hover sx={{ opacity: isExpired(item.displayUntil) ? 0.6 : 1 }}>
                                    <TableCell>
                                        {isExpired(item.displayUntil) ?
                                            <Chip size="small" label="Expired" variant="outlined" /> :
                                            <Chip size="small" color="success" label="Active" />
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2">{item.title}</Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                                            {item.content}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {!item.targetPosition ? (
                                                <Chip label="Everyone" size="small" variant="outlined" />
                                            ) : (
                                                item.targetPosition.split(',').map((pos) => (
                                                    <Chip
                                                        key={pos}
                                                        label={pos}
                                                        size="small"
                                                        color="primary"
                                                        sx={{ fontWeight: 600 }}
                                                    />
                                                ))
                                            )}
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {format(new Date(item.displayUntil), 'MMM dd, yyyy')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" justifyContent="flex-end">
                                            <Tooltip title="Edit">
                                                <IconButton onClick={() => handleOpenModal(item)}><Edit fontSize="small" /></IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton onClick={() => handleDelete(item.id)} color="error"><Delete fontSize="small" /></IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* UPSERT MODAL */}
                <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
                    <DialogTitle>{selected?.id ? "Edit Announcement" : "New Announcement"}</DialogTitle>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 1 }}>
                            <TextField
                                label="Title"
                                fullWidth
                                value={selected?.title}
                                onChange={(e) => setSelected(prev => ({ ...prev!, title: e.target.value }))}
                            />
                            <TextField
                                label="Content"
                                multiline
                                rows={4}
                                fullWidth
                                value={selected?.content}
                                onChange={(e) => setSelected(prev => ({ ...prev!, content: e.target.value }))}
                            />
                            <TextField
                                select
                                label="Target Positions"
                                fullWidth
                                SelectProps={{
                                    multiple: true,
                                    // This renders the selected items as Chips in the input field
                                    renderValue: (selected: any) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.length === 0 ? <em>Everyone</em> : selected.map((value: string) => (
                                                <Chip key={value} label={value} size="small" />
                                            ))}
                                        </Box>
                                    ),
                                }}
                                value={selected?.targetPositions || []}
                                onChange={(e) => {
                                    // MUI multiple select returns an array in e.target.value
                                    const value = e.target.value;
                                    setSelected(prev => ({
                                        ...prev!,
                                        targetPositions: typeof value === 'string' ? value.split(',') : value
                                    }));
                                }}
                            >
                                <MenuItem value="SuperAdmin">Super Admin</MenuItem>
                                <MenuItem value="Admin">Admin</MenuItem>
                                <MenuItem value="DivHead">Division Head</MenuItem>
                                <MenuItem value="DepHead">Department Head</MenuItem>
                                <MenuItem value="SecHead">Section Head</MenuItem>
                                <MenuItem value="ProjectManager">Project Manager</MenuItem>
                                <MenuItem value="Employee">Employee</MenuItem>
                            </TextField>
                            <TextField
                                label="Display Until"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={selected?.displayUntil ? selected.displayUntil.substring(0, 16) : ''}
                                onChange={(e) => setSelected(prev => ({ ...prev!, displayUntil: e.target.value }))}
                            />
                        </Stack>
                    </DialogContent>
                    <DialogActions sx={{ p: 3 }}>
                        <Button onClick={() => setOpenModal(false)}>Cancel</Button>
                        <Button variant="contained" onClick={handleSave}>Sync Announcement</Button>
                    </DialogActions>
                </Dialog>

                <MessagePopup {...popup} onClose={() => setPopup(p => ({ ...p, open: false }))} />
            </Box>
        </PageLayout>
    );
};

export default AnnouncementManagementPage;