'use client';

import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Grid,
    Card,
    CardContent,
    Paper,
    CircularProgress
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import WeeklySchedule from '../../../components/WeeklySchedule';
import { Lesson, getAllLessons } from '../../../api/lessons';
import { ClassRoom, getClassRoomById, addTeacherToClassRoom, removeTeacherFromClassRoom, getClassRoomLessons, addLessonToClassRoom, removeLessonFromClassRoom } from '../../../api/classrooms';
import { Schedule, CreateScheduleRequest, createSchedule, getSchedulesByClassroom, deleteSchedule } from '../../../api/schedules';
import { Student, CreateStudentRequest, createStudent, getStudentsByClassroom, deleteStudent, getNextStudentNumber } from '../../../api/students';
import AddScheduleDialog from '../../../components/AddScheduleDialog';
import { Teacher, getAllTeachers } from '../../../api/teachers';

export default function ClassroomDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [classroom, setClassroom] = useState<ClassRoom | null>(null);
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [error, setError] = useState('');
    const [openScheduleDialog, setOpenScheduleDialog] = useState(false);
    const [openStudentDialog, setOpenStudentDialog] = useState(false);
    const [newStudent, setNewStudent] = useState<CreateStudentRequest>({
        firstName: '',
        lastName: '',
        studentNumber: ''
    });
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [openLessonDialog, setOpenLessonDialog] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState('');
    const [classroomLessons, setClassroomLessons] = useState<Lesson[]>([]);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        type: 'student' | 'teacher' | 'lesson' | null;
        id: string | null;
        name: string | null;
    }>({
        type: null,
        id: null,
        name: null
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError('');
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to view classroom details');
                    return;
                }

                const [classroomData, studentsData, lessonsData, teachersData, classroomLessonsData] = await Promise.all([
                    getClassRoomById(params.id as string, token),
                    getStudentsByClassroom(params.id as string, token),
                    getAllLessons(token),
                    getAllTeachers(token),
                    getClassRoomLessons(params.id as string, token)
                ]);

                setClassroom(classroomData);
                setStudents(studentsData);
                setLessons(lessonsData);
                setTeachers(teachersData);
                setClassroomLessons(classroomLessonsData);

                const fetchedSchedules = await getSchedulesByClassroom(params.id as string, token);
                setSchedules(fetchedSchedules);
            } catch (err) {
                console.error('Error fetching classroom data:', err);
                setError('Failed to load data');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    const handleSubmitSchedule = async (request: CreateScheduleRequest) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !classroom) {
                setError('You must be logged in');
                return;
            }

            await createSchedule(request, token);
            const fetchedSchedules = await getSchedulesByClassroom(classroom.id, token);
            setSchedules(fetchedSchedules);
            setOpenScheduleDialog(false);
        } catch (err) {
            setError('Failed to add schedule entry');
        }
    };

    const handleCreateStudent = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !classroom) {
                setError('You must be logged in');
                return;
            }

            await createStudent(classroom.id, newStudent, token);
            const fetchedStudents = await getStudentsByClassroom(classroom.id, token);
            setStudents(fetchedStudents);
            setOpenStudentDialog(false);
            setNewStudent({ firstName: '', lastName: '', studentNumber: '' });
        } catch (err) {
            setError('Failed to add student');
        }
    };

    const handleDeleteStudent = async (studentId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !classroom) {
                setError('You must be logged in');
                return;
            }

            await deleteStudent(studentId, classroom.id, token);
            setStudents(students.filter(student => student.id !== studentId));
        } catch (err) {
            setError('Failed to delete student');
        }
    };

    const handleDeleteSchedule = async (scheduleId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !classroom) {
                setError('You must be logged in');
                return;
            }

            await deleteSchedule(scheduleId, token);
            
            // Fetch updated schedules
            const fetchedSchedules = await getSchedulesByClassroom(classroom.id, token);
            setSchedules(fetchedSchedules);
        } catch (err) {
            setError('Failed to delete schedule entry');
        }
    };

    const handleAddTeacher = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !classroom) {
                setError('You must be logged in');
                return;
            }

            await addTeacherToClassRoom(classroom.id, selectedTeacher, token);
            const updatedClassroom = await getClassRoomById(classroom.id, token);
            setClassroom(updatedClassroom);
            setOpenTeacherDialog(false);
            setSelectedTeacher('');
        } catch (err) {
            setError('Failed to add teacher');
        }
    };

    const handleRemoveTeacher = async (teacherId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !classroom) {
                setError('You must be logged in');
                return;
            }

            await removeTeacherFromClassRoom(classroom.id, teacherId, token);
            const updatedClassroom = await getClassRoomById(classroom.id, token);
            setClassroom(updatedClassroom);
        } catch (err) {
            setError('Failed to remove teacher');
        }
    };

    const handleStudentClick = (studentId: string) => {
        router.push(`/principal/students/${studentId}`);
    };

    const handleOpenStudentDialog = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in');
                return;
            }

            const nextNumber = await getNextStudentNumber(token);
            setNewStudent(prev => ({ ...prev, studentNumber: nextNumber }));
            setOpenStudentDialog(true);
        } catch (err) {
            setError('Failed to get next student number');
        }
    };

    const handleAddLesson = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !classroom) {
                setError('You must be logged in');
                return;
            }

            await addLessonToClassRoom(classroom.id, selectedLesson, token);
            const updatedLessons = await getClassRoomLessons(classroom.id, token);
            setClassroomLessons(updatedLessons);
            setOpenLessonDialog(false);
            setSelectedLesson('');
        } catch (err) {
            setError('Failed to add lesson');
        }
    };

    const handleRemoveLesson = async (lessonId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !classroom) {
                setError('You must be logged in');
                return;
            }

            await removeLessonFromClassRoom(classroom.id, lessonId, token);
            const updatedLessons = await getClassRoomLessons(classroom.id, token);
            setClassroomLessons(updatedLessons);
        } catch (err) {
            setError('Failed to remove lesson');
        }
    };

    const handleDeleteClick = (type: 'student' | 'teacher' | 'lesson', id: string, name: string) => {
        setDeleteConfirmation({ type, id, name });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmation.id || !deleteConfirmation.type || !classroom) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in');
                return;
            }

            switch (deleteConfirmation.type) {
                case 'student':
                    await deleteStudent(deleteConfirmation.id, classroom.id, token);
                    setStudents(students.filter(student => student.id !== deleteConfirmation.id));
                    break;
                case 'teacher':
                    await removeTeacherFromClassRoom(classroom.id, deleteConfirmation.id, token);
                    const updatedClassroom = await getClassRoomById(classroom.id, token);
                    setClassroom(updatedClassroom);
                    break;
                case 'lesson':
                    await removeLessonFromClassRoom(classroom.id, deleteConfirmation.id, token);
                    setClassroomLessons(classroomLessons.filter(lesson => lesson.id !== deleteConfirmation.id));
                    break;
            }
        } catch (err) {
            setError(`Failed to delete ${deleteConfirmation.type}`);
        } finally {
            setDeleteConfirmation({ type: null, id: null, name: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteConfirmation({ type: null, id: null, name: null });
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <Container sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                    <CircularProgress />
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar />
                <Container sx={{ mt: 4 }}>
                    <Typography color="error">{error}</Typography>
                </Container>
            </>
        );
    }

    if (!classroom) {
        return (
            <>
                <Navbar />
                <Container sx={{ mt: 4 }}>
                    <Typography>Classroom not found</Typography>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Classroom Details
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Basic Information
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography><strong>Name:</strong> {classroom.name}</Typography>
                                <Typography><strong>Grade:</strong> {classroom.grade}</Typography>
                                <Typography><strong>Section:</strong> {classroom.section}</Typography>
                                <Typography><strong>Capacity:</strong> {classroom.capacity}</Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Students ({students.length})
                                </Typography>
                                <Button variant="contained" color="primary" onClick={handleOpenStudentDialog}>
                                    Add Student
                                </Button>
                            </Box>
                            <Grid container spacing={2}>
                                {students.map((student) => (
                                    <Grid item xs={12} sm={6} md={4} key={student.id}>
                                        <Paper 
                                            sx={{ p: 2, cursor: 'pointer' }}
                                            onClick={() => handleStudentClick(student.id)}
                                        >
                                            <Typography variant="subtitle1">
                                                {student.firstName} {student.lastName}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Student Number: {student.studentNumber}
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteClick('student', student.id, `${student.firstName} ${student.lastName}`);
                                                    }}
                                                >
                                                    Delete
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Teachers ({classroom.teachers.length})
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => setOpenTeacherDialog(true)}>
                                    Add Teacher
                                </Button>
                            </Box>
                            <Grid container spacing={2}>
                                {classroom.teachers.map((teacher) => (
                                    <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="subtitle1">
                                                {teacher.firstName} {teacher.lastName}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Number: {teacher.teacherNumber}
                                            </Typography>
                                            <Typography>
                                                Department: {teacher.department}
                                            </Typography>
                                            <Box sx={{ mt: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeleteClick('teacher', teacher.id, `${teacher.firstName} ${teacher.lastName}`)}
                                                >
                                                    Remove
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Lessons ({classroomLessons.length})
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => setOpenLessonDialog(true)}>
                                    Add Lesson
                                </Button>
                            </Box>
                            <Grid container spacing={2}>
                                {classroomLessons.map((lesson) => (
                                    <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                                        <Paper sx={{ p: 2 }}>
                                            <Typography variant="subtitle1">
                                                {lesson.name}
                                            </Typography>
                                            <Typography color="textSecondary">
                                                Code: {lesson.code}
                                            </Typography>
                                            <Typography>
                                                Department: {lesson.department}
                                            </Typography>
                                            {lesson.teacher && (
                                                <Typography>
                                                    Teacher: {lesson.teacher.firstName} {lesson.teacher.lastName}
                                                </Typography>
                                            )}
                                            <Box sx={{ mt: 2 }}>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleDeleteClick('lesson', lesson.id, lesson.name)}
                                                >
                                                    Remove
                                                </Button>
                                            </Box>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">
                                    Weekly Schedule
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => setOpenScheduleDialog(true)}>
                                    Add Schedule Entry
                                </Button>
                            </Box>
                            <WeeklySchedule 
                                schedules={schedules}
                                onDeleteSchedule={handleDeleteSchedule}
                            />
                        </Paper>
                    </Grid>
                </Grid>

                <AddScheduleDialog
                    open={openScheduleDialog}
                    onClose={() => setOpenScheduleDialog(false)}
                    onSubmit={handleSubmitSchedule}
                    classroomId={classroom?.id || ''}
                />

                <Dialog open={openStudentDialog} onClose={() => setOpenStudentDialog(false)}>
                    <DialogTitle>Add New Student</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="First Name"
                            fullWidth
                            value={newStudent.firstName}
                            onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Last Name"
                            fullWidth
                            value={newStudent.lastName}
                            onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Student Number"
                            fullWidth
                            value={newStudent.studentNumber}
                            disabled
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenStudentDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreateStudent} variant="contained" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openTeacherDialog} onClose={() => setOpenTeacherDialog(false)}>
                    <DialogTitle>Add Teacher to Classroom</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Teacher</InputLabel>
                            <Select
                                value={selectedTeacher}
                                label="Teacher"
                                onChange={(e) => setSelectedTeacher(e.target.value)}
                            >
                                {teachers
                                    .filter(teacher => !classroom?.teachers.some(t => t.id === teacher.id))
                                    .map((teacher) => (
                                        <MenuItem key={teacher.id} value={teacher.id}>
                                            {teacher.firstName} {teacher.lastName} ({teacher.department})
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenTeacherDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddTeacher} variant="contained" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openLessonDialog} onClose={() => setOpenLessonDialog(false)}>
                    <DialogTitle>Add Lesson to Classroom</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Lesson</InputLabel>
                            <Select
                                value={selectedLesson}
                                label="Lesson"
                                onChange={(e) => setSelectedLesson(e.target.value)}
                            >
                                {lessons
                                    .filter(lesson => !classroomLessons.some(cl => cl.id === lesson.id))
                                    .map((lesson) => (
                                        <MenuItem key={lesson.id} value={lesson.id}>
                                            {lesson.name} ({lesson.code})
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenLessonDialog(false)}>Cancel</Button>
                        <Button onClick={handleAddLesson} variant="contained" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={Boolean(deleteConfirmation.type)} onClose={handleCancelDelete}>
                    <DialogTitle>
                        {deleteConfirmation.type === 'student' && 'Delete Student'}
                        {deleteConfirmation.type === 'teacher' && 'Remove Teacher'}
                        {deleteConfirmation.type === 'lesson' && 'Remove Lesson'}
                    </DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to {deleteConfirmation.type === 'student' ? 'delete' : 'remove'} {' '}
                            <strong>{deleteConfirmation.name}</strong>?
                            {deleteConfirmation.type === 'student' && ' This action cannot be undone.'}
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDelete}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} variant="contained" color="error">
                            {deleteConfirmation.type === 'student' ? 'Delete' : 'Remove'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
} 