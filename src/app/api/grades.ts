import { Lesson } from './lessons';

const API_URL = 'http://localhost:8080/api';

export interface Grade {
    id: string;
    student: {
        id: string;
    };
    lesson: Lesson;
    examNumber: number;
    score: number;
    notes?: string;
}

export interface CreateGradeRequest {
    studentId: string;
    lessonId: string;
    examNumber: number;
    score: number;
    notes?: string;
}

export const createGrade = async (request: CreateGradeRequest, token: string): Promise<Grade> => {
    const response = await fetch(`${API_URL}/grades`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Failed to create grade');
    }

    return response.json();
};

export const createOrUpdateGrade = async (request: CreateGradeRequest, token: string): Promise<Grade> => {
    const response = await fetch(`${API_URL}/grades/update`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Failed to create or update grade');
    }

    return response.json();
};

export const getStudentGrades = async (studentId: string, token: string): Promise<Grade[]> => {
    const response = await fetch(`${API_URL}/grades/student/${studentId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch student grades');
    }

    return response.json();
};

export const getStudentGradesByLesson = async (studentId: string, lessonId: string, token: string): Promise<Grade[]> => {
    const response = await fetch(`${API_URL}/grades/student/${studentId}/lesson/${lessonId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch student grades for lesson');
    }

    return response.json();
};

export const getStudentAverages = async (studentId: string, token: string): Promise<Record<string, number>> => {
    const response = await fetch(`${API_URL}/grades/student/${studentId}/averages`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch student averages');
    }

    return response.json();
}; 