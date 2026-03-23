export interface EBook {
    id: number;
    title: string;
    description: string;
    author: string;
    category: string;
    thumbnailUrl: string;
    isActive: boolean;
    fileUrl: string;
    fileName: string;
    totalDownloadCount: number;
    totalReaderCount: number;
    averageRating: number;
    createdAt: string;
    userProgress?: UserBookProgress;
}

export interface EBookRequest {
    title: string;
    description: string;
    author: string;
    category: string;
    thumbnailUrl: string;
    fileUrl: string;
    fileName: string;
    isActive: boolean;
    thumbnailFile?: File;
    eBookFile?: File;
}

export interface UserBookProgress {
    eBookId: number;
    totalMinutesSpent: number;
    hasDownloaded: boolean;
    hasOpened: boolean;
    lastAccessedAt: string;
}

export interface PagedLibraryResponse<T> {
    items: T[];
    totalCount: number;
    currentPage: number;
    pageSize: number;
    totalPages: number;
}

export interface BookActivityRequest {
    eBookId: number;
    minutesToAdd: number;
    isDownloading?: boolean;
    isOpening?: boolean;
}