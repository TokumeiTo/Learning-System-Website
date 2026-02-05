import React, { useEffect, useState } from 'react';
import { 
    Box, Table, TableBody, TableCell, TableContainer, 
    TableHead, TableRow, Paper, Chip, Typography, CircularProgress, 
    useTheme, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField
} from '@mui/material';
import { CheckCircle, Cancel, Person, Autorenew } from '@mui/icons-material';
import { getEnrollmentHistory, respondToEnrollment } from '../../api/enrollment.api';
import type { EnrollmentRequest } from '../../types/enrollment';
import { format } from 'date-fns';

const EnrollmentHistory: React.FC = () => {
    const [history, setHistory] = useState<EnrollmentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReq, setSelectedReq] = useState<EnrollmentRequest | null>(null);
    const theme = useTheme();

    const loadHistory = async () => {
        try {
            setLoading(true);
            const data = await getEnrollmentHistory();
            setHistory(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadHistory(); }, []);

    const handleFlipStatus = async (req: EnrollmentRequest) => {
        if (req.status === 'Approved') {
            // If currently Approved, we need a reason to Reject
            setSelectedReq(req);
            setModalOpen(true);
        } else {
            // If currently Rejected, we move to Approved with a default reason
            await executeUpdate(req.id, true, "Status updated from Rejected to Approved");
        }
    };

    const executeUpdate = async (id: string, approve: boolean, reason: string) => {
        try {
            await respondToEnrollment(id, approve, reason);
            setModalOpen(false);
            loadHistory(); // Refresh the list to show new status
        } catch (error) {
            console.error("Update failed", error);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
            <CircularProgress size={32} />
        </Box>
    );

    return (
        <Box>
            <TableContainer component={Paper} sx={{ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, backgroundImage: 'none' }}>
                <Table>
                    <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>STUDENT</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>COURSE</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>STATUS</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>PROCESSED</TableCell>
                            <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 800 }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {history.map((req) => {
                            const isApproved = req.status === 'Approved';
                            return (
                                <TableRow key={req.id}>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Person sx={{ color: 'text.disabled' }} />
                                            <Box>
                                                <Typography variant="body2" fontWeight={700}>{req.studentName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{req.studentEmail}</Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{ fontWeight: 500 }}>{req.courseTitle}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={req.status} 
                                            size="small"
                                            icon={isApproved ? <CheckCircle /> : <Cancel />}
                                            sx={{ 
                                                bgcolor: isApproved ? 'success.light' : 'error.light',
                                                color: 'text.default',
                                                fontWeight: 800
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                        {format(new Date(req.requestedAt), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title={isApproved ? "Change to Reject" : "Change to Approve"}>
                                            <IconButton onClick={() => handleFlipStatus(req)} size="small">
                                                <Autorenew sx={{ color: isApproved ? 'error.main' : 'success.main' }} />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Rejection Modal for History Flip */}
            <Dialog open={modalOpen} onClose={() => setModalOpen(false)} fullWidth maxWidth="xs">
                <DialogTitle sx={{ fontWeight: 800 }}>Change to Rejected</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Why are you revoking <strong>{selectedReq?.studentName}</strong>'s access?
                    </Typography>
                    <TextField 
                        autoFocus fullWidth multiline rows={3} label="Reason" 
                        variant="outlined" onChange={(e) => setSelectedReq(prev => prev ? {...prev, reason: e.target.value} : null)}
                    />
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setModalOpen(false)}>Cancel</Button>
                    <Button 
                        variant="contained" color="error" 
                        onClick={() => selectedReq && executeUpdate(selectedReq.id, false, (selectedReq as any).reason || "None")}
                    >
                        Confirm Revoke
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default EnrollmentHistory;