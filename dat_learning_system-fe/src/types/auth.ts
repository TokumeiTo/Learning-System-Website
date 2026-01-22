export interface LoginRequest {
    companyCode: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    fullName: string;
    position: string;
}