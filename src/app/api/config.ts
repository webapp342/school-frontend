// API URL configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-f68e.up.railway.app';

// API endpoints
export const API_ENDPOINTS = {
    // Auth
    LOGIN: `${API_URL}/api/auth/login`,
    
    // Schools
    SCHOOLS: `${API_URL}/api/schools`,
    MY_SCHOOL: `${API_URL}/api/schools/my-school`,
    
    // Teachers
    TEACHERS: `${API_URL}/api/teachers`,
    
    // Students
    STUDENTS: `${API_URL}/api/students`,
    
    // Classrooms
    CLASSROOMS: `${API_URL}/api/classrooms`,
    
    // Lessons
    LESSONS: `${API_URL}/api/lessons`,
    
    // Departments
    DEPARTMENTS: `${API_URL}/api/departments`,
    
    // Schedules
    SCHEDULES: `${API_URL}/api/schedules`,
    
    // Grades
    GRADES: `${API_URL}/api/grades`,
}; 