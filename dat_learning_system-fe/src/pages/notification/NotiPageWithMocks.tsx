import React, { useState, useMemo } from 'react';
import {
    Box, Typography, List, ListItem, ListItemText, ListItemIcon,
    IconButton, Chip, Tabs, Tab, Paper, Divider, Button, Stack,
    Tooltip, Avatar, useTheme
} from '@mui/material';
import {
    Circle, DeleteOutline, DoneAll, NotificationsActive,
    Info, Error, CheckCircle, Campaign, School
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import PageLayout from '../../components/layout/PageLayout';

// 1. Mock Data Structure
const MOCK_NOTIFICATIONS = [
    {
        id: '1',
        title: 'Course Enrollment',
        message: 'You have been successfully enrolled in "Advanced .NET Architecture".',
        type: 'Success',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
        category: 'Academic'
    },
    {
        id: '2',
        title: 'System Maintenance',
        message: 'The system will be offline for 2 hours this Sunday for scheduled updates.',
        type: 'Warning',
        isRead: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        category: 'System'
    },
    {
        id: '3',
        title: 'New Security Alert',
        message: 'A new login was detected from a Chrome browser on Windows.',
        type: 'Error',
        isRead: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        category: 'Security'
    }
];

const NotificationPage = () => {
    const theme = useTheme();
    const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
    const [activeTab, setActiveTab] = useState(0);

    // Filter logic
    const filteredNotifications = useMemo(() => {
        if (activeTab === 1) return notifications.filter(n => !n.isRead);
        return notifications;
    }, [notifications, activeTab]);

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const deleteNoti = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    // UI Helper for Icons
    const getIcon = (type: string) => {
        switch (type) {
            case 'Success': return <CheckCircle sx={{ color: theme.palette.success.main }} />;
            case 'Error': return <Error sx={{ color: theme.palette.error.main }} />;
            case 'Warning': return <Info sx={{ color: theme.palette.warning.main }} />;
            case 'Academic': return <School color="primary" />;
            default: return <Campaign color="info" />;
        }
    };

    return (
        <PageLayout>
            <Box sx={{ maxWidth: 1000, mx: 'auto', p: 4 }}>
                {/* Header Section */}
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
                        startIcon={<DoneAll />}
                        onClick={markAllRead}
                        disabled={!notifications.some(n => !n.isRead)}
                    >
                        Mark all as read
                    </Button>
                </Stack>

                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    {/* Tabs for Filtering */}
                    <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
                        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2 }}>
                            <Tab label={`All (${notifications.length})`} />
                            <Tab label={`Unread (${notifications.filter(n => !n.isRead).length})`} />
                        </Tabs>
                    </Box>

                    {/* Notification List */}
                    <List sx={{ p: 0 }}>
                        {filteredNotifications.length > 0 ? (
                            filteredNotifications.map((noti, index) => (
                                <React.Fragment key={noti.id}>
                                    <ListItem
                                        alignItems="flex-start"
                                        sx={{
                                            py: 3,
                                            px: 3,
                                            transition: '0.2s',
                                            bgcolor: noti.isRead ? 'transparent' : 'action.hover',
                                            '&:hover': { bgcolor: theme.palette.mode === 'dark' ? '#1e293b' : '#f1f5f9' },
                                        }}
                                        secondaryAction={
                                            <Stack direction="row" spacing={1}>
                                                {!noti.isRead && (
                                                    <Tooltip title="Mark as Read">
                                                        <IconButton size="small" onClick={() => markAsRead(noti.id)}>
                                                            <Circle sx={{ fontSize: 10, color: 'primary.main' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <IconButton size="small" color="error" onClick={() => deleteNoti(noti.id)}>
                                                    <DeleteOutline fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        }
                                    >
                                        <ListItemIcon sx={{ mt: 0.5 }}>
                                            <Avatar sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                                                {getIcon(noti.type)}
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
                                                        {formatDistanceToNow(noti.createdAt)} ago • {noti.category}
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
                </Paper>
            </Box>
        </PageLayout>
    );
};

export default NotificationPage;