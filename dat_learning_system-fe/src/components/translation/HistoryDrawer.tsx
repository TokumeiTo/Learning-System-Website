import React from 'react';
import { 
    Drawer, Box, Typography, List, ListItem, 
    ListItemText, Divider, IconButton, Stack, Button, ListItemButton 
} from '@mui/material';
import { Close, History as HistoryIcon, DeleteOutline } from '@mui/icons-material';
import type { TranslationHistoryItem } from '../../types/translation';

interface HistoryDrawerProps {
    open: boolean;
    onClose: () => void;
    history: TranslationHistoryItem[];
    onSelect: (item: TranslationHistoryItem) => void;
    onClear: () => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ open, onClose, history, onSelect, onClear }) => {
    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 350, p: 3, pt:'100px' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <HistoryIcon color="primary" />
                        <Typography variant="h6" fontWeight={700}>History</Typography>
                    </Stack>
                    <IconButton onClick={onClose}><Close /></IconButton>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                {history.length === 0 ? (
                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
                        No recent translations found.
                    </Typography>
                ) : (
                    <>
                        <List disablePadding>
                            {history.map((item) => (
                                <ListItem 
                                    key={item.id} 
                                    disablePadding
                                    sx={{ 
                                        mb: 1, 
                                        border: '1px solid', 
                                        borderColor: 'divider',
                                        borderRadius: 2,
                                        overflow: 'hidden' // Keeps the ripple effect inside the rounded corners
                                    }}
                                >
                                    <ListItemButton 
                                        onClick={() => { onSelect(item); onClose(); }}
                                        sx={{ py: 1.5 }}
                                    >
                                        <ListItemText 
                                            primary={item.source} 
                                            secondary={item.timestamp}
                                            primaryTypographyProps={{ 
                                                noWrap: true, 
                                                fontWeight: 600,
                                                fontSize: '0.95rem'
                                            }}
                                            secondaryTypographyProps={{
                                                fontSize: '0.75rem'
                                            }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                        <Button 
                            fullWidth 
                            startIcon={<DeleteOutline />} 
                            color="error" 
                            onClick={onClear} 
                            sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
                        >
                            Clear History
                        </Button>
                    </>
                )}
            </Box>
        </Drawer>
    );
};

export default HistoryDrawer;