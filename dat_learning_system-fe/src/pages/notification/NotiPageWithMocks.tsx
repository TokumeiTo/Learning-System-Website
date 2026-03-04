import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, List, ListItem, ListItemText, ListItemIcon,
    IconButton, Chip, Tabs, Tab, Paper, Divider, Button, Stack,
    Tooltip, Avatar, useTheme, CircularProgress
} from '@mui/material';
import {
    Circle, DeleteOutline, DoneAll, NotificationsActive,
    Info, Error as ErrorIcon, CheckCircle, Campaign, School
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import PageLayout from '../../components/layout/PageLayout';

// Import your new API and Types
import { getMyNotifications, markNotificationAsRead, clearAllNotifications } from '../../api/announce_noti.api';
import type { Notification } from '../../types_interfaces/notifications';

const NotificationPage = () => {
    const theme = useTheme();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);

    // 1. Fetch data on mount
    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getMyNotifications();
            setNotifications(data);
        } catch (error) {
            console.error("Failed to load notifications", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    // 2. Logic to filter based on Tab
    const filteredNotifications = useMemo(() => {
        if (activeTab === 1) return notifications.filter(n => !n.isRead);
        return notifications;
    }, [notifications, activeTab]);

    // 3. Updated handlers using API
    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            // Optimistic Update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error("Update failed");
        }
    };

    const handleClearAll = async () => {
        if (window.confirm("Are you sure you want to clear all notifications?")) {
            try {
                await clearAllNotifications();
                setNotifications([]); // Backend does soft-delete, we clear UI
            } catch (err) {
                console.error("Clear failed");
            }
        }
    };

    const getIcon = (type?: string) => {
        // Backend ReferenceType mapping
        switch (type) {
            case 'Course': return <School color="primary" />;
            case 'Enrollment': return <CheckCircle sx={{ color: theme.palette.success.main }} />;
            case 'System': return <Info sx={{ color: theme.palette.warning.main }} />;
            default: return <Campaign color="info" />;
        }
    };

    return (
        <PageLayout>
            <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight={900} letterSpacing="-0.5px">
                            Notification Center
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Stay updated with your latest activities and system alerts
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        startIcon={<DeleteOutline />}
                        onClick={handleClearAll}
                        color="error"
                        disabled={notifications.length === 0}
                    >
                        Clear All
                    </Button>
                </Stack>

                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2 }}>
                            <Tab label={`All (${notifications.length})`} />
                            <Tab label={`Unread (${notifications.filter(n => !n.isRead).length})`} />
                        </Tabs>
                    </Box>

                    {loading ? (
                        <Box sx={{ p: 10, textAlign: 'center' }}>
                            <CircularProgress size={40} />
                        </Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map((noti, index) => (
                                    <React.Fragment key={noti.id}>
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{
                                                py: 3, px: 3, transition: '0.2s',
                                                bgcolor: noti.isRead ? 'transparent' : 'action.hover',
                                                '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9' },
                                            }}
                                            secondaryAction={
                                                !noti.isRead && (
                                                    <Tooltip title="Mark as Read">
                                                        <IconButton size="small" onClick={() => handleMarkAsRead(noti.id)}>
                                                            <Circle sx={{ fontSize: 10, color: 'primary.main' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )
                                            }
                                        >
                                            <ListItemIcon sx={{ mt: 0.5 }}>
                                                <Avatar sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                                                    {getIcon(noti.referenceType)}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="subtitle1" fontWeight={noti.isRead ? 500 : 800}>
                                                            {noti.title}
                                                        </Typography>
                                                        {!noti.isRead && <Chip label="New" color="primary" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 900 }} />}
                                                    </Stack>
                                                }
                                                secondary={
                                                    <Box component="span">
                                                        <Typography variant="body2" color="text.primary" sx={{ my: 0.5, display: 'block' }}>
                                                            {noti.message}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled">
                                                            {formatDistanceToNow(new Date(noti.createdAt))} ago • {noti.referenceType || 'General'}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {index < filteredNotifications.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))
                            ) : (
                                <Box sx={{ p: 10, textAlign: 'center' }}>
                                    <NotificationsActive sx={{ fontSize: 60, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
                                    <Typography variant="h6" color="text.secondary">All caught up!</Typography>
                                    <Typography variant="body2" color="text.disabled">No new notifications at the moment.</Typography>
                                </Box>
                            )}
                        </List>
                    )}
                </Paper>
            </Box>
        </PageLayout>
    );
};

export default NotificationPage;