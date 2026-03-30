import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { AuthContext } from './AuthContext';
import { getToken } from '../utils/token';
import { getMyAnnouncements } from '../api/announce_noti.api';
import type { Announcement } from '../types_interfaces/noti_announce';

type NotificationContextType = {
    unreadCount: number;
    resetCount: () => void;
    announcements: Announcement[];
    refreshAnnouncements: () => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [unreadCount, setUnreadCount] = useState(0);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);

    const refreshAnnouncements = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const data = await getMyAnnouncements();
            setAnnouncements(data);
        } catch (error) {
            console.error("Failed to fetch announcements", error);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const token = getToken();
        if (!isAuthenticated || !token || !user?.id) return;

        refreshAnnouncements();

        const connection = new signalR.HubConnectionBuilder()
            .withUrl(`${import.meta.env.VITE_API_URL}/notificationHub`, {
                accessTokenFactory: () => token // This sends the JWT for [Authorize]
            })
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log("Connected to SignalR!");
                    connection.invoke("JoinUserGroup", user.id);
                if(user.position) {
                    connection.invoke("JoinPositionGroup", user.position);
                }

            })
            .catch(err => console.error("SignalR Connection Error: ", err));

        // Listen for the "ReceiveNotification" event from the backend
        connection.on("ReceiveNotification", (data) => {
            console.log("Real-time notification received:", data);
            setUnreadCount(prev => prev + 1);
        });

        connection.on("ReceiveAnnouncement", (message) => {
            console.log("Announcement Signal:", message);
            // Re-fetch the list automatically when a new one is posted
            refreshAnnouncements();
        });

        // Cleanup connection on logout or unmount
        return () => {
            if (connection) connection.stop();
        };
    }, [isAuthenticated, user?.id, user?.position, refreshAnnouncements]);

    const resetCount = () => setUnreadCount(0);

    return (
        <NotificationContext.Provider value={{ unreadCount, resetCount, announcements, refreshAnnouncements }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);