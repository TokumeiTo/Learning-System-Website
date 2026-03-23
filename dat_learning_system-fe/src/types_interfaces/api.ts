export interface ApiResponse<T = any> {
    message: string;
    isSuccess?: boolean;
    data?: T;
}