'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { School } from '../../api/schools';
import { ClassRoom, CreateClassRoomRequest, createClassRoom, getMySchoolClassRooms, deleteClassRoom } from '../../api/classrooms';
import Navbar from '../../components/Navbar';

export default function PrincipalDashboard() {
    const [school, setSchool] = useState<School | null>(null);
    const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [classRoomToDelete, setClassRoomToDelete] = useState<string | null>(null);
    const [newClassRoom, setNewClassRoom] = useState<CreateClassRoomRequest>({
        name: '',
        grade: 1,
        section: '',
        capacity: 30
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to view school details');
                    return;
                }

                const response = await fetch('http://localhost:8080/api/schools/my-school', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch school data');
                }

                const schoolData = await response.json();
                setSchool(schoolData);

                // Fetch classrooms
                const classRoomsData = await getMySchoolClassRooms(token);
                setClassRooms(classRoomsData);
            } catch (err) {
                setError('Failed to load data');
            }
        };

        fetchData();
    }, []);

    const handleCreateClassRoom = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to create a classroom');
                return;
            }

            const createdClassRoom = await createClassRoom(newClassRoom, token);
            setClassRooms([...classRooms, createdClassRoom]);
            setOpenDialog(false);
            setNewClassRoom({
                name: '',
                grade: 1,
                section: '',
                capacity: 30
            });
        } catch (err) {
            setError('Failed to create classroom');
        }
    };

    const handleDeleteClick = (id: string) => {
        setClassRoomToDelete(id);
        setOpenDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (!classRoomToDelete) return;

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to delete a classroom');
                return;
            }

            await deleteClassRoom(classRoomToDelete, token);
            setClassRooms(classRooms.filter(room => room.id !== classRoomToDelete));
            setOpenDeleteDialog(false);
            setClassRoomToDelete(null);
        } catch (err) {
            setError('Failed to delete classroom');
        }
    };

    const handleCancelDelete = () => {
        setOpenDeleteDialog(false);
        setClassRoomToDelete(null);
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

    if (!school) {
        return (
            <>
                <Navbar />
                <Container>
                    <Typography>Loading...</Typography>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Principal Dashboard
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                School Information
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography><strong>School Name:</strong> {school.name}</Typography>
                                <Typography><strong>School Code:</strong> {school.code}</Typography>
                                <Typography><strong>Address:</strong> {school.address}</Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                                <Typography variant="h5">
                                    Classrooms
                                </Typography>
                                <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>
                                    Add New Classroom
                                </Button>
                            </Box>
                            <Grid container spacing={2}>
                                {classRooms.map((room) => (
                                    <Grid item xs={12} sm={6} md={4} key={room.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6">{room.name}</Typography>
                                                <Typography>Grade: {room.grade}</Typography>
                                                <Typography>Section: {room.section}</Typography>
                                                <Typography>Capacity: {room.capacity}</Typography>
                                                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                                                    <Button
                                                        variant="outlined"
                                                        color="primary"
                                                        size="small"
                                                        href={`/principal/classrooms/${room.id}`}
                                                    >
                                                        View Details
                                                    </Button>
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        onClick={() => handleDeleteClick(room.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12}>
                        <Paper sx={{ p: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                Quick Stats
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Total Students</Typography>
                                            <Typography variant="h4">Coming Soon</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Total Teachers</Typography>
                                            <Typography variant="h4">Coming Soon</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Total Classes</Typography>
                                            <Typography variant="h4">{classRooms.length}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Add New Classroom</DialogTitle>
                    <DialogContent>
                        <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="Name"
                                value={newClassRoom.name}
                                onChange={(e) => setNewClassRoom({ ...newClassRoom, name: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Grade"
                                type="number"
                                value={newClassRoom.grade}
                                onChange={(e) => setNewClassRoom({ ...newClassRoom, grade: parseInt(e.target.value) })}
                                fullWidth
                            />
                            <TextField
                                label="Section"
                                value={newClassRoom.section}
                                onChange={(e) => setNewClassRoom({ ...newClassRoom, section: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Capacity"
                                type="number"
                                value={newClassRoom.capacity}
                                onChange={(e) => setNewClassRoom({ ...newClassRoom, capacity: parseInt(e.target.value) })}
                                fullWidth
                            />
                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleCreateClassRoom} variant="contained" color="primary">
                            Create
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
                    <DialogTitle>Delete Classroom</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Are you sure you want to delete this classroom? This action cannot be undone.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCancelDelete}>Cancel</Button>
                        <Button onClick={handleConfirmDelete} variant="contained" color="error">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
} 