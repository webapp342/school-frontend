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
import { Teacher, CreateTeacherRequest, createTeacher, getAllTeachers, deleteTeacher, updateTeacherStatus, getNextTeacherNumber } from '../../api/teachers';
import { Department, getAllDepartments } from '../../api/departments';
import Navbar from '../../components/Navbar';

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [newTeacher, setNewTeacher] = useState<CreateTeacherRequest>({
        firstName: '',
        lastName: '',
        teacherNumber: '',
        department: '',
        username: '',
        password: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to view teachers');
                    return;
                }
                const [fetchedTeachers, fetchedDepartments] = await Promise.all([
                    getAllTeachers(token),
                    getAllDepartments(token)
                ]);
                setTeachers(fetchedTeachers);
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
                setError('You must be logged in to create a teacher');
                return;
            }

            console.log('Opening dialog and fetching next teacher number');
            const nextNumber = await getNextTeacherNumber(token);
            console.log('Received next teacher number:', nextNumber);

            setNewTeacher({
                firstName: '',
                lastName: '',
                teacherNumber: nextNumber,
                department: '',
                username: '',
                password: ''
            });
            setOpenDialog(true);
        } catch (error) {
            console.error('Error in handleOpenDialog:', error);
            // Hata durumunda varsayılan bir numara ile devam et
            setNewTeacher({
                firstName: '',
                lastName: '',
                teacherNumber: 'T1000',
                department: '',
                username: '',
                password: ''
            });
            setOpenDialog(true);
            setError('Failed to get next teacher number, using default');
        }
    };

    const handleCreateTeacher = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to create a teacher');
                return;
            }

            const createdTeacher = await createTeacher(newTeacher, token);
            setTeachers([...teachers, createdTeacher]);
            setOpenDialog(false);
            setNewTeacher({
                firstName: '',
                lastName: '',
                teacherNumber: '',
                department: '',
                username: '',
                password: ''
            });
        } catch (err) {
            setError('Failed to create teacher');
        }
    };

    const handleDeleteTeacher = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to delete a teacher');
                return;
            }

            await deleteTeacher(id, token);
            setTeachers(teachers.filter(teacher => teacher.id !== id));
        } catch (err) {
            setError('Failed to delete teacher');
        }
    };

    const handleStatusChange = async (id: string, status: Teacher['status']) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to update teacher status');
                return;
            }

            const updatedTeacher = await updateTeacherStatus(id, status, token);
            setTeachers(teachers.map(teacher => 
                teacher.id === id ? updatedTeacher : teacher
            ));
        } catch (err) {
            setError('Failed to update teacher status');
        }
    };

    const getStatusColor = (status: Teacher['status']) => {
        switch (status) {
            case 'ACTIVE':
                return 'success';
            case 'ON_LEAVE':
                return 'warning';
            case 'RETIRED':
                return 'error';
            case 'TRANSFERRED':
                return 'info';
            default:
                return 'default';
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
                        School Teachers
                    </Typography>
                    <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                        Add New Teacher
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {teachers.map((teacher) => (
                        <Grid item xs={12} sm={6} md={4} key={teacher.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">
                                        {teacher.firstName} {teacher.lastName}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Number: {teacher.teacherNumber}
                                    </Typography>
                                    <Typography>
                                        Department: {departments.find(d => d.code === teacher.department)?.name || teacher.department}
                                    </Typography>
                                    <Box sx={{ mt: 2, mb: 2 }}>
                                        <FormControl size="small" fullWidth>
                                            <InputLabel>Status</InputLabel>
                                            <Select
                                                value={teacher.status}
                                                label="Status"
                                                onChange={(e) => handleStatusChange(teacher.id, e.target.value as Teacher['status'])}
                                            >
                                                <MenuItem value="ACTIVE">Active</MenuItem>
                                                <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                                                <MenuItem value="RETIRED">Retired</MenuItem>
                                                <MenuItem value="TRANSFERRED">Transferred</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                    <Chip 
                                        label={teacher.status.toLowerCase().replace('_', ' ')}
                                        color={getStatusColor(teacher.status)}
                                        size="small"
                                        sx={{ mb: 2 }}
                                    />
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDeleteTeacher(teacher.id)}
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
                    <DialogTitle>Add New Teacher</DialogTitle>
                    <DialogContent>
                        <Box component="form" sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="First Name"
                                value={newTeacher.firstName}
                                onChange={(e) => setNewTeacher({ ...newTeacher, firstName: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Last Name"
                                value={newTeacher.lastName}
                                onChange={(e) => setNewTeacher({ ...newTeacher, lastName: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Teacher Number"
                                value={newTeacher.teacherNumber}
                                InputProps={{ readOnly: true }}
                                helperText="Automatically generated"
                            />
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Department</InputLabel>
                                <Select
                                    value={newTeacher.department}
                                    label="Department"
                                    onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
                                >
                                    {departments.map((dept) => (
                                        <MenuItem key={dept.id} value={dept.code}>
                                            {dept.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Username"
                                value={newTeacher.username}
                                onChange={(e) => setNewTeacher({ ...newTeacher, username: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                margin="normal"
                                label="Password"
                                type="password"
                                value={newTeacher.password}
                                onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreateTeacher} variant="contained">Create</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
} 