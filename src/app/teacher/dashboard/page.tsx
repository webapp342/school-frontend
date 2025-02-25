'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent, Button } from '@mui/material';
import { School } from '../../api/schools';
import { ClassRoom, getMySchoolClassRooms } from '../../api/classrooms';
import Navbar from '../../components/Navbar';

export default function TeacherDashboard() {
    const [school, setSchool] = useState<School | null>(null);
    const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
    const [error, setError] = useState('');

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
                    Teacher Dashboard
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
                                    My Classrooms
                                </Typography>
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
                                                        href={`/teacher/classrooms/${room.id}`}
                                                    >
                                                        View Details
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
                                            <Typography variant="h6">My Classes</Typography>
                                            <Typography variant="h4">{classRooms.length}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6} md={4}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="h6">Total Assignments</Typography>
                                            <Typography variant="h4">Coming Soon</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </>
    );
} 