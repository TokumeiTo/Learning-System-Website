import React, { useEffect, useState } from 'react';
import {
    Box, Typography, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, IconButton, Tooltip,
    CircularProgress, useTheme,
    Stack
} from '@mui/material';
import { CheckCircle, Cancel, Person, School } from '@mui/icons-material';
import { getPendingRequests, respondToEnrollment } from '../../api/enrollment.api';
import type { EnrollmentRequest } from '../../types/enrollment';
import { format } from 'date-fns';
import RejectionModal from './EnrollrejectionModal';

const EnrollmentQueue: React.FC = () => {
    const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Modal & Selection States
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedReq, setSelectedReq] = useState<EnrollmentRequest | null>(null);
    
    const theme = useTheme();

    const loadRequests = async () => {
        try {
            const data = await getPendingRequests();
            setRequests(data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadRequests(); }, []);

    // Initial button click handler
    const handleAction = (req: EnrollmentRequest, approve: boolean) => {
        if (approve) {
            executeResponse(req.id, true, "Approved by Admin");
        } else {
            setSelectedReq(req);
            setModalOpen(true);
        }
    };

    // The actual API call
    const executeResponse = async (id: string, approve: boolean, reason: string) => {
        try {
            await respondToEnrollment(id, approve, reason);
            setRequests(prev => prev.filter(r => r.id !== id));
            setModalOpen(false);
        } catch (error) {
            console.error("Action failed", error);
        }
    };

    return (
        <Box>
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundImage: 'none'
                }}
            >
                <Table>
                    <TableHead sx={{ bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>STUDENT</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>COURSE</TableCell>
                            <TableCell sx={{ color: 'text.secondary', fontWeight: 800 }}>DATE</TableCell>
                            <TableCell align="right" sx={{ color: 'text.secondary', fontWeight: 800 }}>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                                    <CircularProgress size={30} />
                                </TableCell>
                            </TableRow>
                        ) : requests.map((req) => (
                            <TableRow
                                key={req.id}
                                sx={{ '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.01)' : 'rgba(0,0,0,0.01)' } }}
                            >
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        <Person sx={{ color: 'primary.main', opacity: 0.8 }} />
                                        <Box>
                                            <Typography variant="body2" fontWeight={700} color="text.primary">
                                                {req.studentName}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {req.studentEmail}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <School fontSize="small" sx={{ color: 'text.tertiary' }} />
                                        <Typography variant="body2" color="text.primary">{req.courseTitle}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                                        {format(new Date(req.requestedAt), 'MMM dd, yyyy HH:mm')}
                                    </Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                        <Tooltip title="Approve">
                                            <IconButton
                                                onClick={() => handleAction(req, true)}
                                                sx={{
                                                    color: 'success.main',
                                                    '&:hover': { bgcolor: 'success.light' }
                                                }}
                                            >
                                                <CheckCircle />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Reject">
                                            <IconButton
                                                onClick={() => handleAction(req, false)}
                                                sx={{
                                                    color: 'error.main',
                                                    '&:hover': { bgcolor: 'error.light' }
                                                }}
                                            >
                                                <Cancel />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                {requests.length === 0 && !loading && (
                    <Box sx={{ p: 8, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: 'text.disabled', fontWeight: 600 }}>
                            No pending requests found.
                        </Typography>
                    </Box>
                )}
            </TableContainer>

            {/* Rejection Modal Component */}
            <RejectionModal 
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                studentName={selectedReq?.studentName || ''}
                onConfirm={(reason) => selectedReq && executeResponse(selectedReq.id, false, reason)}
            />
        </Box>
    );
};

export default EnrollmentQueue;