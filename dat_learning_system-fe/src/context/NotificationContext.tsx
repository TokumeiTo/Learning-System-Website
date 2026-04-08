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
    // Safety check for user data and auth status
    if (!isAuthenticated || !token || !user?.id) return;

    let isMounted = true;
    refreshAnnouncements();

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_API_URL}/notificationHub`, {
        accessTokenFactory: () => token
      })
      .configureLogging(signalR.LogLevel.Critical)
      .withAutomaticReconnect()
      .build();

    const startConnection = async () => {
      try {
        await connection.start();

        // Only proceed with setup if the component is still mounted
        if (isMounted) {
          console.log("Connected to SignalR!");
          
          // Join necessary groups
          await connection.invoke("JoinUserGroup", user.id);
          if (user.position) {
            await connection.invoke("JoinPositionGroup", user.position);
          }
        } else {
          // If unmounted during the async start, stop immediately
          await connection.stop();
        }
      } catch (err) {
        // Only log errors if the component is still mounted 
        // (This silences the AbortError from React Strict Mode)
        if (isMounted) {
          console.error("SignalR Connection Error: ", err);
        }
      }
    };

    // Event Listeners
    connection.on("ReceiveNotification", (data) => {
      console.log("Real-time notification received:", data);
      setUnreadCount(prev => prev + 1);
    });

    connection.on("ReceiveAnnouncement", (message) => {
      console.log("Announcement Signal:", message);
      refreshAnnouncements();
    });

    startConnection();

    // Cleanup logic
    return () => {
      isMounted = false;
      // Use a fire-and-forget stop to avoid blocking the unmount
      if (connection.state === signalR.HubConnectionState.Connected || 
          connection.state === signalR.HubConnectionState.Connecting) {
        connection.stop().catch(err => console.warn("Error stopping SignalR:", err));
      }
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