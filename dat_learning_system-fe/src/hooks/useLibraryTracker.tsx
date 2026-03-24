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
        const interval = setInterval(async () => {
            try {
                await recordBookActivity({ eBookId: bookId, minutesToAdd: 1 });

                setBooks(prevBooks =>
                    prevBooks.map(b => b.id === bookId
                        ? {
                            ...b,
                            userProgress: {
                                ...(b.userProgress || {
                                    eBookId: b.id,
                                    hasDownloaded: false,
                                    hasOpened: true,
                                    lastAccessedAt: new Date().toISOString()
                                }),
                                totalMinutesSpent: (b.userProgress?.totalMinutesSpent ?? 0) + 1
                            }
                        }
                        : b
                    )
                );

                console.log(`Updated local state for book ${bookId}`);
            } catch (err) {
                console.error("Heartbeat failed", err);
            }
        }, 60000); // 1 minute

        return () => clearInterval(interval);
    };

    const trackDownload = async (bookId: number) => {
        try {
            await recordBookActivity({
                eBookId: bookId,
                isDownloading: true,
                minutesToAdd: 0
            });
            console.log(`Download tracked for book ${bookId}`);
        } catch (err) {
            console.error("Failed to track download:", err);
        }
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
        startTracking,
        trackDownload
    };
};