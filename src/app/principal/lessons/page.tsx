'use client';

import React, { useEffect, useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Chip
} from '@mui/material';
import { Lesson, CreateLessonRequest, createLesson, getAllLessons, deleteLesson, assignTeacher, removeTeacher, getNextLessonCode } from '../../api/lessons';
import { Department, getAllDepartments } from '../../api/departments';
import { Teacher, getActiveTeachersByDepartment } from '../../api/teachers';
import Navbar from '../../components/Navbar';

export default function LessonsPage() {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openTeacherDialog, setOpenTeacherDialog] = useState(false);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    const [newLesson, setNewLesson] = useState<CreateLessonRequest>({
        name: '',
        code: '',
        duration: 40,
        department: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to view lessons');
                    return;
                }
                const [fetchedLessons, fetchedDepartments] = await Promise.all([
                    getAllLessons(token),
                    getAllDepartments(token)
                ]);
                setLessons(fetchedLessons);
                setDepartments(fetchedDepartments);
            } catch (err) {
                setError('Failed to load data');
            }
        };

        fetchData();
    }, []);

    const handleOpenDialog = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to create a lesson');
                return;
            }

            console.log('Opening dialog and fetching next lesson code');
            const nextCode = await getNextLessonCode(token);
            console.log('Received next lesson code:', nextCode);

            setNewLesson({
                name: '',
                code: nextCode,
                duration: 40,
                department: ''
            });
            setOpenDialog(true);
        } catch (error) {
            console.error('Error in handleOpenDialog:', error);
            // Hata durumunda varsayılan bir kod ile devam et
            setNewLesson({
                name: '',
                code: 'L100',
                duration: 40,
                department: ''
            });
            setOpenDialog(true);
            setError('Failed to get next lesson code, using default');
        }
    };

    const handleCreateLesson = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to create a lesson');
                return;
            }

            const createdLesson = await createLesson(newLesson, token);
            setLessons([...lessons, createdLesson]);
            setOpenDialog(false);
            setNewLesson({
                name: '',
                code: '',
                duration: 40,
                department: ''
            });
        } catch (err) {
            setError('Failed to create lesson');
        }
    };

    const handleDeleteLesson = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to delete a lesson');
                return;
            }

            await deleteLesson(id, token);
            setLessons(lessons.filter(lesson => lesson.id !== id));
        } catch (err) {
            setError('Failed to delete lesson');
        }
    };

    const handleOpenTeacherDialog = async (lesson: Lesson) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to assign teachers');
                return;
            }

            // The lesson.department already contains the department code (D1, D2)
            // so we can use it directly without searching for the department
            console.log('Fetching teachers for department code:', lesson.department);
            const fetchedTeachers = await getActiveTeachersByDepartment(lesson.department, token);
            setTeachers(fetchedTeachers);
            setSelectedLesson(lesson);
            setOpenTeacherDialog(true);
        } catch (err) {
            console.error('Error loading teachers:', err);
            setError('Failed to load teachers');
        }
    };

    const handleAssignTeacher = async (teacherId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token || !selectedLesson) {
                setError('You must be logged in to assign teachers');
                return;
            }

            const updatedLesson = await assignTeacher(selectedLesson.id, teacherId, token);
            setLessons(lessons.map(lesson => 
                lesson.id === updatedLesson.id ? updatedLesson : lesson
            ));
            setOpenTeacherDialog(false);
        } catch (err) {
            setError('Failed to assign teacher');
        }
    };

    const handleRemoveTeacher = async (lessonId: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to remove teachers');
                return;
            }

            const updatedLesson = await removeTeacher(lessonId, token);
            setLessons(lessons.map(lesson => 
                lesson.id === updatedLesson.id ? updatedLesson : lesson
            ));
        } catch (err) {
            setError('Failed to remove teacher');
        }
    };

    if (error) {
        return (
            <>
                <Navbar />
                <Container>
                    <Typography color="error">{error}</Typography>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        School Lessons
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                        Add New Lesson
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {lessons.map((lesson) => (
                        <Grid item xs={12} sm={6} md={4} key={lesson.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{lesson.name}</Typography>
                                    <Typography color="textSecondary">Code: {lesson.code}</Typography>
                                    <Typography>Duration: {lesson.duration} minutes</Typography>
                                    <Typography>
                                        Department: {departments.find(d => d.code === lesson.department)?.name || lesson.department}
                                    </Typography>
                                    {lesson.teacher ? (
                                        <Box sx={{ mt: 2 }}>
                                            <Typography>
                                                Teacher: {lesson.teacher.firstName} {lesson.teacher.lastName}
                                            </Typography>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="warning"
                                                onClick={() => handleRemoveTeacher(lesson.id)}
                                                sx={{ mt: 1, mr: 1 }}
                                            >
                                                Remove Teacher
                                            </Button>
                                        </Box>
                                    ) : (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleOpenTeacherDialog(lesson)}
                                            sx={{ mt: 2 }}
                                        >
                                            Assign Teacher
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteLesson(lesson.id)}
                                        sx={{ mt: 1 }}
                                        fullWidth
                                    >
                                        Delete
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Add New Lesson</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Lesson Name"
                            fullWidth
                            value={newLesson.name}
                            onChange={(e) => setNewLesson({ ...newLesson, name: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            label="Lesson Code"
                            fullWidth
                            value={newLesson.code}
                            InputProps={{
                                readOnly: true,
                                disabled: true,
                            }}
                            helperText="Lesson code is automatically generated"
                        />
                        <TextField
                            margin="dense"
                            label="Duration (minutes)"
                            type="number"
                            fullWidth
                            value={newLesson.duration}
                            onChange={(e) => setNewLesson({ ...newLesson, duration: parseInt(e.target.value) })}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Department</InputLabel>
                            <Select
                                value={newLesson.department}
                                label="Department"
                                onChange={(e) => setNewLesson({ ...newLesson, department: e.target.value })}
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.code}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreateLesson} variant="contained" color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openTeacherDialog} onClose={() => setOpenTeacherDialog(false)}>
                    <DialogTitle>Assign Teacher</DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            Select a teacher for {selectedLesson?.name}
                        </Typography>
                        {teachers.length === 0 ? (
                            <Typography color="error">
                                No active teachers found in this department
                            </Typography>
                        ) : (
                            <FormControl fullWidth margin="dense">
                                <InputLabel>Teacher</InputLabel>
                                <Select
                                    label="Teacher"
                                    onChange={(e) => handleAssignTeacher(e.target.value as string)}
                                >
                                    {teachers.map((teacher) => (
                                        <MenuItem key={teacher.id} value={teacher.id}>
                                            {teacher.firstName} {teacher.lastName} ({teacher.teacherNumber})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenTeacherDialog(false)}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
} 