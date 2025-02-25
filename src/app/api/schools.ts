import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface School {
    id: string;
    name: string;
    address: string;
    code: string;
    principal?: {
        id: number;
        username: string;
        code: string;
    };
}

export interface CreateSchoolRequest {
    name: string;
    address: string;
    code: string;
    principalUsername: string;
    principalPassword: string;
}

export const createSchool = async (schoolData: CreateSchoolRequest, token?: string): Promise<School> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/schools`, {
        method: 'POST',
        headers,
        body: JSON.stringify(schoolData)
    });

    if (!response.ok) {
        throw new Error('Failed to create school');
    }

    return response.json();
};

export const getAllSchools = async (token?: string): Promise<School[]> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/schools`, {
        cache: 'no-store',
        headers
    });
    
    if (!response.ok) {
        throw new Error('Failed to fetch schools');
    }
    
    return response.json();
};

export const getSchoolById = async (id: string, token?: string): Promise<School> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/schools/${id}`, {
        headers
    });

    if (!response.ok) {
        throw new Error('Failed to fetch school');
    }

    return response.json();
}; 