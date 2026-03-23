import { useState, useCallback } from 'react';
import { fetchAllBooks, recordBookActivity } from '../api/library.api';
import type { EBook } from '../types_interfaces/library';

export const useLibraryTracker = () => {
    const [books, setBooks] = useState<EBook[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(12);

    const loadCatalog = useCallback(async (category?: string, search?: string, forcePage?: number) => {
        setLoading(true);
        try {
            // Use forcePage if provided (e.g., resetting to page 1 on search), else use current state
            const targetPage = forcePage ?? page;
            const response = await fetchAllBooks(targetPage, pageSize, category, search);
            
            setBooks(response.items || []);
            setTotalCount(response.totalCount);
        } catch (err) {
            console.error("Failed to load catalog:", err);
            setBooks([]); 
        } finally {
            setLoading(false);
        }
    }, [page, pageSize]);

    const startTracking = (bookId: number) => {
        recordBookActivity({ eBookId: bookId, isOpening: true, minutesToAdd: 0 });

        const interval = setInterval(() => {
            recordBookActivity({ eBookId: bookId, minutesToAdd: 1 });
            console.log(`Heartbeat sent for book ${bookId}`);
        }, 60000);

        return () => clearInterval(interval);
    };

    // Export EVERYTHING the component needs to control the view
    return { 
        books, 
        totalCount, 
        loading, 
        page, 
        setPage, 
        pageSize, 
        loadCatalog, 
        startTracking 
    };
};