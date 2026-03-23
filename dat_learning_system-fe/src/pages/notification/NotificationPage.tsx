import React, { useState, useEffect, useMemo } from 'react';
import {
    Box, Typography, List, ListItem, ListItemText, ListItemIcon,
    IconButton, Chip, Tabs, Tab, Paper, Divider, Button, Stack,
    Tooltip, Avatar, CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions
} from '@mui/material';
import {
    Circle, DeleteOutline, DoneAll, NotificationsActive,
    Info, CheckCircle, Campaign, School
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import PageLayout from '../../components/layout/PageLayout';

import { getMyNotifications, markNotificationAsRead, clearAllNotifications } from '../../api/announce_noti.api';
import type { Notification } from '../../types_interfaces/notifications';
import MessagePopup from '../../components/feedback/MessagePopup';
import { useNavigate } from 'react-router-dom';

const NotificationPage = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0); // 0: All, 1: Unread, 2: Read
    const [openConfirm, setOpenConfirm] = useState(false);
    const [popup, setPopup] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success"
    });
    const showPopup = (message: string, severity: "success" | "error" = "success") => {
        setPopup({ open: true, message, severity });
    };
    const navigate = useNavigate();

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

    useEffect(() => { fetchNotifications(); }, []);

    // 1. Fixed Filtering (Added 'Read' tab logic)
    const filteredNotifications = useMemo(() => {
        if (activeTab === 1) return notifications.filter(n => !n.isRead);
        if (activeTab === 2) return notifications.filter(n => n.isRead);
        return notifications;
    }, [notifications, activeTab]);

    // 2. Mark Single as Read
    const handleMarkAsRead = async (id: string) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) { console.error(err); }
    };

    // 3. Mark All as Read (Logic)
    const handleMarkAllRead = async () => {
        const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
        if (unreadIds.length === 0) return;

        try {
            await Promise.all(unreadIds.map(id => markNotificationAsRead(id)));
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            showPopup("All notifications marked as read");
        } catch (err) {
            showPopup("Failed to update notifications", "error");
        }
    };

    const handleClearAllClick = () => {
        if (notifications.length > 0) {
            setOpenConfirm(true); // Open the modal instead of window.confirm
        }
    };

    const handleConfirmClear = async () => {
        try {
            await clearAllNotifications();
            setNotifications([]);
            setOpenConfirm(false);
            showPopup("Inbox cleared successfully");
        } catch (err) {
            showPopup("Failed to clear inbox", "error");
            setOpenConfirm(false);
        }
    };

    const handleNotificationClick = async (noti: Notification) => {
        // 1. Mark as read first if it's unread
        if (!noti.isRead) {
            await handleMarkAsRead(noti.id);
        }
        if (!noti.referenceId && noti.referenceType !== 'System') {
            showPopup("Link no longer available");
            return;
        }

        // 2. Navigate based on type
        switch (noti.referenceType) {
            case 'Course':
                navigate(`/courses`);
                break;
            case 'Enrollment':
                // Admins go to the management page, Students go to their dashboard
                navigate(`/admin/enrollments`);
                break;
            case 'System':
                // Maybe just stay on the page or go to system logs
                break;
            default:
                console.log("No specific route for this type");
        }
    };

    const getIcon = (type?: string) => {
        switch (type) {
            case 'Course': return <School color="primary" />;
            case 'Enrollment': return <CheckCircle color="success" />;
            case 'System': return <Info color="warning" />;
            default: return <Campaign color="info" />;
        }
    };

    return (
        <PageLayout>
            <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                    <Box>
                        <Typography variant="h4" fontWeight={900}>Notification Center</Typography>
                        <Typography variant="body2" color="text.secondary">Stay updated with system alerts</Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button startIcon={<DoneAll />} onClick={handleMarkAllRead} variant="text" size="small">
                            Mark all read
                        </Button>
                        <Button
                            startIcon={<DeleteOutline />}
                            onClick={handleClearAllClick}
                            color="error"
                            variant="text"
                            size="small"
                            disabled={notifications.length === 0}
                        >
                            Clear all
                        </Button>
                    </Stack>
                </Stack>

                <Paper variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                    <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}>
                        <Tab label={`All (${notifications.length})`} />
                        <Tab label={`Unread (${notifications.filter(n => !n.isRead).length})`} />
                        <Tab label={`Read (${notifications.filter(n => n.isRead).length})`} />
                    </Tabs>

                    {loading ? (
                        <Box sx={{ p: 10, textAlign: 'center' }}><CircularProgress /></Box>
                    ) : (
                        <List sx={{ p: 0 }}>
                            {filteredNotifications.length > 0 ? (
                                filteredNotifications.map((noti, index) => (
                                    <React.Fragment key={noti.id}>
                                        <ListItem
                                            alignItems="flex-start"
                                            sx={{
                                                py: 2, px: 3, cursor: 'pointer',
                                                bgcolor: noti.isRead ? 'transparent' : 'action.hover',
                                                '&:hover': {
                                                    bgcolor: 'action.selected',
                                                    // Visual cue that this is clickable
                                                    '& .action-button': { opacity: 1 }
                                                }
                                            }}
                                            // Clicking the row triggers the navigation
                                            onClick={() => handleNotificationClick(noti)}
                                            secondaryAction={
                                                <Stack direction="column" spacing={1} alignItems="center">
                                                    {!noti.isRead && (
                                                        <Tooltip title="New">
                                                            <IconButton size="small" onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleMarkAsRead(noti.id);
                                                            }}>
                                                                <Circle sx={{ fontSize: 10, color: 'primary.main' }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {/* The "Quick Action" Button */}
                                                    <Button
                                                        className="action-button"
                                                        size="small"
                                                        variant="outlined"
                                                        sx={{
                                                            opacity: { xs: 1, md: 0.5 }, // Subtle until hovered on desktop
                                                            transition: '0.2s',
                                                            textTransform: 'none',
                                                            borderRadius: 2,
                                                        }}
                                                    >
                                                        View
                                                    </Button>
                                                </Stack>
                                            }
                                        >
                                            <ListItemIcon sx={{ mt: 0.5 }}>
                                                <Avatar sx={{ bgcolor: 'background.default', border: '1px solid', borderColor: 'divider' }}>
                                                    {getIcon(noti.referenceType)}
                                                </Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                // THE FIX: This prop prevents the <div> inside <p> error
                                                secondaryTypographyProps={{ component: 'div' }}
                                                primary={
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Typography variant="subtitle1" fontWeight={noti.isRead ? 500 : 800}>
                                                            {noti.title}
                                                        </Typography>
                                                        {!noti.isRead && <Chip label="New" color="primary" size="small" sx={{ height: 18, fontSize: '0.6rem' }} />}
                                                    </Stack>
                                                }
                                                secondary={
                                                    <Box>
                                                        <Typography variant="body2" color="text.primary" sx={{ my: 0.5, display: 'block', width: '90%' }}>
                                                            {noti.message}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.disabled">
                                                            {formatDistanceToNow(new Date(noti.createdAt))} ago • {noti.referenceType}
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
                                    <NotificationsActive sx={{ fontSize: 60, color: 'text.disabled', opacity: 0.5, mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">Empty here!</Typography>
                                </Box>
                            )}
                        </List>
                    )}
                </Paper>

                <Dialog
                    open={openConfirm}
                    onClose={() => setOpenConfirm(false)}
                    PaperProps={{
                        sx: { borderRadius: 3, p: 1 }
                    }}
                >
                    <DialogTitle sx={{ fontWeight: 800 }}>
                        Clear all notifications?
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            This will permanently remove all notifications from your inbox.
                            This action cannot be undone.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions sx={{ pb: 2, px: 3 }}>
                        <Button
                            onClick={() => setOpenConfirm(false)}
                            variant="text"
                            sx={{ color: 'text.secondary', fontWeight: 600 }}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirmClear}
                            variant="contained"
                            color="error"
                            autoFocus
                            sx={{
                                borderRadius: 2,
                                px: 3,
                                fontWeight: 600,
                            }}
                        >
                            Yes, Clear All
                        </Button>
                    </DialogActions>
                </Dialog>

                <MessagePopup
                    open={popup.open}
                    message={popup.message}
                    severity={popup.severity}
                    onClose={() => setPopup(prev => ({ ...prev, open: false }))}
                />
            </Box>
        </PageLayout>
    );
};

export default NotificationPage;