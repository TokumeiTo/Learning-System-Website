import React from 'react';
import { Box, Typography, Drawer, Divider } from '@mui/material';
import { History } from '@mui/icons-material';

interface Props {
    log: any | null;
    onClose: () => void;
}

const formatJson = (jsonString: string) => {
    if (!jsonString || jsonString === "null") return "// No data recorded";
    try {
        return JSON.stringify(JSON.parse(jsonString), null, 2);
    } catch (e) {
        return jsonString;
    }
};

const AuditDetailsDrawer: React.FC<Props> = ({ log, onClose }) => (
    <Drawer anchor="right" open={!!log} onClose={onClose}>
        <Box sx={{ width: 550, p: 4, bgcolor: '#0d1117', height: '100%', color: '#e6edf3', overflowY: 'auto', mt: '65px' }}>
            <Typography variant="h6" fontWeight={800} sx={{ color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                <History /> Data Inspector
            </Typography>
            <Typography variant="caption" display="block" sx={{ color: 'grey.500', mb: 3 }}>
                Transaction ID: {log?.id}
            </Typography>

            <Divider sx={{ borderColor: 'grey.800', my: 2 }} />

            <Typography variant="overline" sx={{ color: '#ff7b72', fontWeight: 900 }}>- Previous State (JSON)</Typography>
            <Box component="pre" sx={{ p: 2, bgcolor: '#161b22', borderRadius: 2, overflow: 'auto', border: '1px solid #30363d', fontSize: '0.75rem', mt: 1, fontFamily: 'monospace' }}>
                {formatJson(log?.oldData)}
            </Box>

            <Box sx={{ my: 4 }} />

            <Typography variant="overline" sx={{ color: '#7ee787', fontWeight: 900 }}>+ Current State (JSON)</Typography>
            <Box component="pre" sx={{ p: 2, bgcolor: '#161b22', borderRadius: 2, overflow: 'auto', border: '1px solid #30363d', fontSize: '0.75rem', mt: 1, fontFamily: 'monospace' }}>
                {formatJson(log?.newData)}
            </Box>
        </Box>
    </Drawer>
);

export default AuditDetailsDrawer;