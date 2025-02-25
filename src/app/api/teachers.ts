const API_URL = 'http://localhost:8080/api';

export interface Teacher {
    id: string;
    firstName: string;
    lastName: string;
    teacherNumber: string;
    department: string;
    status: 'ACTIVE' | 'ON_LEAVE' | 'RETIRED' | 'TRANSFERRED';
}

export interface CreateTeacherRequest {
    firstName: string;
    lastName: string;
    teacherNumber: string;
    department: string;
    username: string;
    password: string;
}

export const createTeacher = async (request: CreateTeacherRequest, token: string): Promise<Teacher> => {
    const response = await fetch(`${API_URL}/teachers`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Failed to create teacher');
    }

    return response.json();
};

export const getAllTeachers = async (token: string): Promise<Teacher[]> => {
    const response = await fetch(`${API_URL}/teachers`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch teachers');
    }

    return response.json();
};

export const getTeacherById = async (id: string, token: string): Promise<Teacher> => {
    const response = await fetch(`${API_URL}/teachers/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch teacher');
    }

    return response.json();
};

export const updateTeacherStatus = async (id: string, status: Teacher['status'], token: string): Promise<Teacher> => {
    const response = await fetch(`${API_URL}/teachers/${id}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
    });

    if (!response.ok) {
        throw new Error('Failed to update teacher status');
    }

    return response.json();
};

export const deleteTeacher = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/teachers/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete teacher');
    }
};

export const getActiveTeachersByDepartment = async (departmentId: string, token: string): Promise<Teacher[]> => {
    const response = await fetch(`${API_URL}/teachers/department/${departmentId}/active`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch active teachers');
    }

    return response.json();
};

export const getNextTeacherNumber = async (token: string): Promise<string> => {
    try {
        console.log('Fetching next teacher number...');
        const response = await fetch(`${API_URL}/teachers/next-number`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to get next teacher number:', errorData.error || 'Unknown error');
            // Hata durumunda varsayılan bir numara döndür
            return 'T1000';
        }

        const data = await response.json();
        console.log('Received next teacher number:', data);
        return data.number; // JSON yanıtından number alanını al
    } catch (error) {
        console.error('Error in getNextTeacherNumber:', error);
        // Hata durumunda varsayılan bir numara döndür
        return 'T1000';
    }
};

export const getMyTeacherInfo = async (token: string): Promise<Teacher> => {
    const response = await fetch(`${API_URL}/teachers/me`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch teacher information');
    }

    return response.json();
};

export const getMyClassrooms = async (token: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/teachers/my-classrooms`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch teacher classrooms');
    }

    return response.json();
};

export const getMyLessons = async (token: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/teachers/my-lessons`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch teacher lessons');
    }

    return response.json();
};

export const getMyStudents = async (token: string): Promise<any[]> => {
    const response = await fetch(`${API_URL}/teachers/my-students`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch teacher students');
    }

    return response.json();
}; 