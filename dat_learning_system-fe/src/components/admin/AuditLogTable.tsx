import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead,
    TableRow, Paper, Chip, Stack, Typography, IconButton, Tooltip,
    Box
} from '@mui/material';
import { Terminal, Person, Fingerprint } from '@mui/icons-material';
import { format } from 'date-fns';

interface Props {
    logs: any[];
    onViewDetails: (log: any) => void;
}

const getActionColor = (action: string) => {
    const act = action?.toLowerCase() || '';
    if (act.includes('add') || act.includes('create')) return 'success';
    if (act.includes('mod') || act.includes('updat')) return 'warning';
    if (act.includes('del')) return 'error';
    return 'default';
};

const AuditLogTable: React.FC<Props> = ({ logs, onViewDetails }) => (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid', borderColor: 'divider', maxHeight: 'calc(100vh - 185px)' }}>
        <Table stickyHeader>
            <TableHead>
                <TableRow>
                    {/* We apply the solid background to the Cell, not the Row or Head */}
                    <TableCell sx={{ fontWeight: 800, bgcolor: 'background.toolbar', zIndex: 2, color:'white' }}>EVENT TIME</TableCell>
                    <TableCell sx={{ fontWeight: 800, bgcolor: 'background.toolbar', zIndex: 2, color:'white' }}>ENTITY</TableCell>
                    <TableCell sx={{ fontWeight: 800, bgcolor: 'background.toolbar', zIndex: 2, color:'white' }}>ACTION</TableCell>
                    <TableCell sx={{ fontWeight: 800, bgcolor: 'background.toolbar', zIndex: 2, color:'white' }}>ADMIN ID</TableCell>
                    <TableCell sx={{ fontWeight: 800, bgcolor: 'background.toolbar', zIndex: 2, color:'white' }}>REASON</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 800, bgcolor: 'background.toolbar', zIndex: 2, color:'white' }}>DETAILS</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {logs.map((log) => (
                    <TableRow key={log.id} hover>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                            {format(new Date(log.timestamp), 'MMM dd, yyyy HH:mm')}
                        </TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Fingerprint sx={{ fontSize: 'large', color: 'text.default' }} />
                                <Typography variant="body2" fontWeight={700}>{log.entityName}</Typography>
                            </Stack>
                        </TableCell>
                        <TableCell>
                            <Chip
                                label={log.action.toUpperCase()}
                                size="small"
                                color={getActionColor(log.action) as any}
                                sx={{ fontWeight: 900, fontSize: '0.6rem', borderRadius: 1 }}
                            />
                        </TableCell>
                        <TableCell>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Person sx={{ fontSize: 16, color: 'primary.main' }} />
                                <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                                    {log.performedBy?.substring(0, 8) || 'System'}
                                </Typography>
                            </Stack>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 250 }}>
                            <Typography variant="body2" noWrap sx={{ fontStyle: log.reason ? 'normal' : 'italic', color: log.reason ? 'text.primary' : 'text.disabled' }}>
                                {log.reason || 'N/A'}
                            </Typography>
                        </TableCell>
                        <TableCell align="right">
                            <Tooltip title="Inspect Data Changes">
                                <IconButton onClick={() => onViewDetails(log)} size="small">
                                    <Terminal sx={{ color: 'text.secondary' }} />
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        {logs.length === 0 && (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">No logs found matching your criteria.</Typography>
            </Box>
        )}
    </TableContainer>
);

export default AuditLogTable;