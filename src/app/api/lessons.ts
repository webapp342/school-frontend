const API_URL = 'http://localhost:8080/api';

export interface Lesson {
    id: string;
    name: string;
    code: string;
    duration: number;
    teacher?: {
        id: string;
        firstName: string;
        lastName: string;
        teacherNumber: string;
        department: string;
    };
    department: string;
}

export interface CreateLessonRequest {
    name: string;
    code: string;
    duration: number;
    teacherId?: string;
    department: string;
}

export interface UpdateLessonRequest {
    name?: string;
    code?: string;
    duration?: number;
    teacherId?: string;
    departmentId?: string;
}

export const createLesson = async (request: CreateLessonRequest, token: string): Promise<Lesson> => {
    const response = await fetch(`${API_URL}/lessons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Failed to create lesson');
    }

    return response.json();
};

export const getAllLessons = async (token: string): Promise<Lesson[]> => {
    const response = await fetch(`${API_URL}/lessons`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch lessons');
    }

    return response.json();
};

export const getLessonById = async (id: string, token: string): Promise<Lesson> => {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch lesson');
    }

    return response.json();
};

export const updateLesson = async (id: string, request: UpdateLessonRequest, token: string): Promise<Lesson> => {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Failed to update lesson');
    }

    return response.json();
};

export const assignTeacher = async (lessonId: string, teacherId: string, token: string): Promise<Lesson> => {
    const response = await fetch(`${API_URL}/lessons/${lessonId}/teacher/${teacherId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || 'Failed to assign teacher');
    }

    return response.json();
};

export const removeTeacher = async (lessonId: string, token: string): Promise<Lesson> => {
    const response = await fetch(`${API_URL}/lessons/${lessonId}/teacher`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to remove teacher');
    }

    return response.json();
};

export const deleteLesson = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/lessons/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete lesson');
    }
};

export const getNextLessonCode = async (token: string): Promise<string> => {
    try {
        console.log('Fetching next lesson code...');
        const response = await fetch(`${API_URL}/lessons/next-code`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to get next lesson code:', errorData.error || 'Unknown error');
            // Hata durumunda varsayılan bir kod döndür
            return 'L100';
        }

        const data = await response.json();
        console.log('Received next lesson code:', data);
        return data.code; // JSON yanıtından code alanını al
    } catch (error) {
        console.error('Error in getNextLessonCode:', error);
        // Hata durumunda varsayılan bir kod döndür
        return 'L100';
    }
}; 