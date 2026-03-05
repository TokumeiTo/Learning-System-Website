import React, { createContext, useContext, useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';
import { AuthContext } from './AuthContext';
import { getToken } from '../utils/token';

type NotificationContextType = {
    unreadCount: number;
    resetCount: () => void;
};

const NotificationContext = createContext<NotificationContextType>({} as NotificationContextType);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const token = getToken();
        if (!isAuthenticated || !token || !user?.id) return;

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5251/notificationHub", {
                accessTokenFactory: () => token // This sends the JWT for [Authorize]
            })
            .withAutomaticReconnect()
            .build();

        connection.start()
            .then(() => {
                console.log("Connected to SignalR!");
                // Ensure user.id is the GUID string from your new LoginResponse
                if (user?.id) {
                    connection.invoke("JoinUserGroup", user.id);
                }
            })
            .catch(err => console.error("SignalR Connection Error: ", err));

        // Listen for the "ReceiveNotification" event from the backend
        connection.on("ReceiveNotification", (data) => {
            console.log("Real-time notification received:", data);
            setUnreadCount(prev => prev + 1);
        });

        // Cleanup connection on logout or unmount
        return () => {
            if (connection) connection.stop();
        };
    }, [isAuthenticated, user?.id]);

    const resetCount = () => setUnreadCount(0);

    return (
        <NotificationContext.Provider value={{ unreadCount, resetCount }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);