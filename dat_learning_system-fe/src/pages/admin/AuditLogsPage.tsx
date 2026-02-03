import React, { useState } from 'react';
import {
    Box, Typography, TextField, InputAdornment, Stack,
    CircularProgress, TablePagination, Paper, Button
} from '@mui/material';
import { Search, RestartAlt } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers';
import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';

import { getGlobalAuditLogs } from '../../api/audit.api';
import AuditDetailsDrawer from '../../components/admin/AuditDetailDrawer';
import AuditLogTable from '../../components/admin/AuditLogTable';
import PageLayout from '../../components/layout/PageLayout';

const GlobalAuditLog: React.FC = () => {
    // 1. Filter States
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [dateRange, setDateRange] = useState<{ from: Dayjs | null, to: Dayjs | null }>({
        from: null,
        to: null
    });

    const [selectedLog, setSelectedLog] = useState<any | null>(null);

    // 2. React Query - Handles fetching, loading, and caching
    const { data, isLoading, isPlaceholderData } = useQuery({
        queryKey: ['audit-logs', page, rowsPerPage, searchTerm, dateRange],
        queryFn: () => getGlobalAuditLogs({
            page: page + 1,
            pageSize: rowsPerPage,
            search: searchTerm,
            from: dateRange.from?.toISOString() ?? null,
            to: dateRange.to?.toISOString() ?? null
        }),
        placeholderData: (previousData) => previousData, // Keeps old data visible while fetching new page
    });

    const handleReset = () => {
        setSearchTerm('');
        setDateRange({ from: null, to: null });
        setPage(0);
    };

    return (
        <PageLayout>
            <Box sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 4 }}>
                    <Box>
                        <Typography variant="h4" fontWeight={900} letterSpacing="-0.5px">System Audit Trail</Typography>
                        <Typography variant="body2" color="text.secondary">Immutable record of all administrative actions</Typography>
                    </Box>

                    <Stack spacing={2} alignItems="flex-end">
                        <TextField
                            placeholder="Search entity, admin, or action..."
                            size="small"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                            InputProps={{
                                startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
                            }}
                            sx={{ width: 400, bgcolor: 'background.paper' }}
                        />

                        <Stack direction="row" spacing={1} alignItems="center">
                            <DatePicker
                                label="From"
                                slotProps={{ textField: { size: 'small' } }}
                                value={dateRange.from}
                                onChange={(val) => { setDateRange(prev => ({ ...prev, from: val })); setPage(0); }}
                            />
                            <DatePicker
                                label="To"
                                slotProps={{ textField: { size: 'small' } }}
                                value={dateRange.to}
                                onChange={(val) => { setDateRange(prev => ({ ...prev, to: val })); setPage(0); }}
                            />
                            <Button
                                variant="outlined"
                                size="medium"
                                onClick={handleReset}
                                startIcon={<RestartAlt />}
                                sx={{ height: 40 }}
                            >
                                Reset
                            </Button>
                        </Stack>
                    </Stack>
                </Stack>

                {isLoading && !data ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', opacity: isPlaceholderData ? 0.6 : 1 }}>
                        <AuditLogTable
                            logs={data?.data || []}
                            onViewDetails={(log) => setSelectedLog(log)}
                        />
                        <TablePagination
                            component="div"
                            count={data?.totalCount || 0}
                            page={page}
                            onPageChange={(_, newPage) => setPage(newPage)}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={(e) => {
                                setRowsPerPage(parseInt(e.target.value, 10));
                                setPage(0);
                            }}
                        />
                    </Paper>
                )}

                <AuditDetailsDrawer
                    log={selectedLog}
                    onClose={() => setSelectedLog(null)}
                />
            </Box>
        </PageLayout>
    );
};

export default GlobalAuditLog;