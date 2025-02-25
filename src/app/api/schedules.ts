const API_URL = 'http://localhost:8080/api';

export interface Schedule {
    id: string;
    lessonId: string;
    classroomId: string;
    dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
    lessonOrder: number;
    startTime: string;
    endTime: string;
    lessonName?: string;
    lessonCode?: string;
    teacherName?: string | null;
}

export interface CreateScheduleRequest {
    lessonId: string;
    classroomId: string;
    dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';
    lessonOrder: number;
    startTime: string;
    endTime: string;
}

export const createSchedule = async (request: CreateScheduleRequest, token: string): Promise<Schedule> => {
    const response = await fetch(`${API_URL}/schedules/classroom/${request.classroomId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            lessonId: request.lessonId,
            dayOfWeek: request.dayOfWeek,
            startTime: request.startTime,
            endTime: request.endTime,
            lessonOrder: request.lessonOrder
        })
    });

    if (!response.ok) {
        throw new Error('Failed to create schedule');
    }

    return response.json();
};

export const getSchedulesByClassroom = async (classroomId: string, token: string): Promise<Schedule[]> => {
    const response = await fetch(`${API_URL}/schedules/classroom/${classroomId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch schedules');
    }

    const schedules = await response.json();
    return schedules;
};

export const deleteSchedule = async (id: string, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/schedules/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete schedule');
    }
}; 