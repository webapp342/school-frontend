import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface AuthRequest {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    role: string;
}

export const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    return response.data;
}; 