import { School } from './schools';
import { Teacher } from './teachers';
import { Lesson } from './lessons';

const API_URL = 'http://localhost:8080/api';

export interface ClassRoom {
    id: string;
    name: string;
    grade: number;
    section: string;
    capacity: number;
    school?: School;
    teachers: Teacher[];
    lessons: Lesson[];
}

export interface CreateClassRoomRequest {
    name: string;
    grade: number;
    section: string;
    capacity: number;
}

export const createClassRoom = async (request: CreateClassRoomRequest, token: string): Promise<ClassRoom> => {
    try {
        const response = await fetch(`${API_URL}/classrooms`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            throw new Error(`Failed to create classroom: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error creating classroom:', error);
        throw error;
    }
};

export const getMySchoolClassRooms = async (token: string): Promise<ClassRoom[]> => {
    try {
        const response = await fetch(`${API_URL}/classrooms/my-school`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch classrooms: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching classrooms:', error);
        throw error;
    }
};

export const getClassRoomById = async (id: string, token: string): Promise<ClassRoom> => {
    try {
        const response = await fetch(`${API_URL}/classrooms/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch classroom: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching classroom:', error);
        throw error;
    }
};

export const deleteClassRoom = async (id: string, token: string): Promise<void> => {
    try {
        const response = await fetch(`${API_URL}/classrooms/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete classroom: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error deleting classroom:', error);
        throw error;
    }
};

export const getClassRoomTeachers = async (classRoomId: string, token: string): Promise<Teacher[]> => {
    try {
        const response = await fetch(`${API_URL}/classrooms/${classRoomId}/teachers`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch classroom teachers: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching classroom teachers:', error);
        throw error;
    }
};

export const addTeacherToClassRoom = async (classRoomId: string, teacherId: string, token: string): Promise<ClassRoom> => {
    try {
        const response = await fetch(`${API_URL}/classrooms/${classRoomId}/teachers/${teacherId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to add teacher to classroom: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error adding teacher to classroom:', error);
        throw error;
    }
};

export const removeTeacherFromClassRoom = async (classRoomId: string, teacherId: string, token: string): Promise<ClassRoom> => {
    try {
        const response = await fetch(`${API_URL}/classrooms/${classRoomId}/teachers/${teacherId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to remove teacher from classroom: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error removing teacher from classroom:', error);
        throw error;
    }
};

export const getClassRoomLessons = async (classRoomId: string, token: string): Promise<Lesson[]> => {
    try {
        const response = await fetch(`${API_URL}/classrooms/${classRoomId}/lessons`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch classroom lessons: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching classroom lessons:', error);
        throw error;
    }
};

export const addLessonToClassRoom = async (classRoomId: string, lessonId: string, token: string): Promise<ClassRoom> => {
    try {
        const response = await fetch(`${API_URL}/classrooms/${classRoomId}/lessons/${lessonId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to add lesson to classroom: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error adding lesson to classroom:', error);
        throw error;
    }
};

export const removeLessonFromClassRoom = async (classRoomId: string, lessonId: string, token: string): Promise<ClassRoom> => {
    try {
        const response = await fetch(`${API_URL}/classrooms/${classRoomId}/lessons/${lessonId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to remove lesson from classroom: ${response.statusText}`);
        }

        return response.json();
    } catch (error) {
        console.error('Error removing lesson from classroom:', error);
        throw error;
    }
}; 