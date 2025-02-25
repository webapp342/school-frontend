const API_URL = 'http://localhost:8080/api';

export interface Department {
    id: string;
    name: string;
    code: string;
    description?: string;
}

export interface CreateDepartmentRequest {
    name: string;
    code?: string;
    description?: string;
}

export const createDepartment = async (request: CreateDepartmentRequest, token: string): Promise<Department> => {
    const response = await fetch(`${API_URL}/departments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Failed to create department');
    }

    return response.json();
};

export const getAllDepartments = async (token: string): Promise<Department[]> => {
    const response = await fetch(`${API_URL}/departments`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch departments');
    }

    return response.json();
};

export const getDepartmentById = async (id: string, token: string): Promise<Department> => {
    const response = await fetch(`${API_URL}/departments/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch department');
    }

    return response.json();
};

export const updateDepartment = async (id: string, request: CreateDepartmentRequest, token: string): Promise<Department> => {
    const response = await fetch(`${API_URL}/departments/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(request)
    });

    if (!response.ok) {
        throw new Error('Failed to update department');
    }

    return response.json();
};

export const deleteDepartment = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/departments/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete department');
    }
};

export const getNextDepartmentCode = async (token: string): Promise<string> => {
    try {
        console.log('Fetching next department code...');
        const response = await fetch(`${API_URL}/departments/next-code`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to get next department code:', errorData.error || 'Unknown error');
            // Hata durumunda varsayılan bir kod döndür
            return 'D1';
        }

        const data = await response.json();
        console.log('Received next department code:', data);
        return data.code; // JSON yanıtından code alanını al
    } catch (error) {
        console.error('Error in getNextDepartmentCode:', error);
        // Hata durumunda varsayılan bir kod döndür
        return 'D1';
    }
}; 