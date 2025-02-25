import { ClassRoom } from './classrooms';

const API_URL = 'http://localhost:8080/api';

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    studentNumber: string;
    classroom: {
        id: string;
    };
}

export interface CreateStudentRequest {
    firstName: string;
    lastName: string;
    studentNumber: string;
}

export const getNextStudentNumber = async (token: string): Promise<string> => {
    const response = await fetch(`${API_URL}/students/next-number`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to get next student number');
    }

    return response.json();
};

export const createStudent = async (classroomId: string, request: CreateStudentRequest, token: string): Promise<Student> => {
    const response = await fetch(`${API_URL}/students/classroom/${classroomId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Failed to create student');
    }

    return response.json();
};

export const getStudentsByClassroom = async (classroomId: string, token: string): Promise<Student[]> => {
    const response = await fetch(`${API_URL}/students/classroom/${classroomId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch students');
    }

    return response.json();
};

export const deleteStudent = async (studentId: string, classroomId: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/students/${studentId}?classroomId=${classroomId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete student');
    }
};

export const getStudentById = async (id: string, token: string): Promise<Student> => {
    const response = await fetch(`${API_URL}/students/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch student details');
    }

    return response.json();
}; 