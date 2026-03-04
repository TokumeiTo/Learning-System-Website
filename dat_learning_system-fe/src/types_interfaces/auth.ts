export interface LoginRequest {
    companyCode: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    fullName: string;
    position: string;
    email: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
    position: number;
    companyCode: string;
    orgUnitId: number;
}

export interface RegisterResponse {
    isSuccess: boolean;
    message: string;
    companyCode?: string;
    userPosition?: string;
}