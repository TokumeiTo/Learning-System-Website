import api from '../hooks/useApi';
import type { 
    Announcement, 
    UpsertAnnouncementRequest, 
    Notification 
} from '../types_interfaces/noti_announce';

// --- ANNOUNCEMENT ENDPOINTS ---

// Get active announcements filtered by user position (Backend handles filtering)
export const getMyAnnouncements = async (): Promise<Announcement[]> => {
    const response = await api.get('/api/announcement');
    return response.data;
};

// Admin: Get all announcements for the management table
export const getAdminAnnouncements = async (): Promise<Announcement[]> => {
    const response = await api.get('/api/announcement/admin');
    return response.data;
};

// Admin: Manual Sync (Create if id is empty, Update if id exists)
export const upsertAnnouncement = async (data: UpsertAnnouncementRequest): Promise<{ message: string }> => {
    const response = await api.post('/api/announcement', data);
    return response.data;
};

// Admin: Delete an announcement
export const deleteAnnouncement = async (id: string): Promise<void> => {
    await api.delete(`/api/announcement/${id}`);
};

// --- NOTIFICATION ENDPOINTS ---

// Get current user's system notifications (Direct)
export const getMyNotifications = async (): Promise<Notification[]> => {
    const response = await api.get('/api/notification');
    return response.data;
};

// Mark a specific notification as read (Removes "New" badge)
export const markNotificationAsRead = async (id: string): Promise<void> => {
    await api.patch(`/api/notification/${id}/read`);
};

// User: Soft delete all notifications from their view
export const clearAllNotifications = async (): Promise<void> => {
    await api.delete('/api/notification/clear-all');
};