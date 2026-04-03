import api from "../hooks/useApi";
import type {
    BulkSaveContentsRequest,
    ClassroomView,
    CreateLessonRequest,
    Lesson,
    ReOrderLessonsRequest,
    UpdateLessonRequest
} from "../types_interfaces/classroom";

export const fetchClassroomData = async (courseId: string): Promise<ClassroomView> => {
    const res = await api.get(`/api/classroom/${courseId}`);

    console.log(res)
    return res.data;
};

export const createLesson = async (payload: CreateLessonRequest): Promise<Lesson> => {
    const response = await api.post('/api/classroom/lessons', payload);
    return response.data;
};

export const updateLesson = async (lessonId: string, payload: UpdateLessonRequest): Promise<Lesson> => {
    const response = await api.put(`/api/classroom/lessons/${lessonId}`, payload);
    return response.data;
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
    await api.delete(`/api/classroom/lessons/${lessonId}`);
};

export const reorderLessons = async (payload: ReOrderLessonsRequest): Promise<void> => {
    await api.put('/api/classroom/lessons/reorder', payload);
};

export const bulkSaveLessonContents = async (
    payload: BulkSaveContentsRequest,
    onProgress?: (data: { percent: number; timeLeft: number }) => void
): Promise<void> => {
    const formData = new FormData();
    const startTime = Date.now();

    // 1. We separate the files from the metadata
    const metadataContents = payload.contents.map(content => {
        const currentFile = content.file;

        if (currentFile && (currentFile instanceof File || currentFile instanceof Blob)) {
            const fName = (currentFile as File).name || content.fileName || "unnamed_file";

            console.log(`✅ Appending file: ${fName}`);
            formData.append('files', currentFile, fName); // Don't use 3rd param for now to simplify

            return {
                ...content,
                body: null, // Don't send the large data in JSON
                fileName: fName,
                file: undefined // Remove the File object from the JSON metadata
            };
        }

        console.log(`📄 Block is text/metadata (Order: ${content.sortOrder})`);
        return content;
    });

    // 2. Append the JSON metadata as a string
    formData.append('jsonData', JSON.stringify({
        lessonId: payload.lessonId,
        contents: metadataContents
    }));

    // 3. Send as multipart/form-data
    await api.post('/api/classroom/lessons/contents/bulk', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        // Optional: track upload progress for your big 400MB files!
        onUploadProgress: (progressEvent) => {
            const loaded = progressEvent.loaded;
            const total = progressEvent.total ?? 0;
            const percent = Math.round((loaded * 100) / total);

            const elapsedTime = (Date.now() - startTime) / 1000;
            const speed = loaded / elapsedTime;
            const remainingBytes = total - loaded;
            const timeLeft = speed > 0 ? Math.round(remainingBytes / speed) : 0;

            // Trigger the callback to update the UI state
            if (onProgress) {
                onProgress({ percent, timeLeft });
            }
        }
    });
};