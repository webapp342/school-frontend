'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Button, Paper, Grid } from '@mui/material';
import { School, getAllSchools } from '../../api/schools';
import Navbar from '../../components/Navbar';

export default function AdminDashboard() {
    const [schools, setSchools] = useState<School[]>([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSchools = async () => {
            try {
                const token = localStorage.getItem('token');
                const fetchedSchools = await getAllSchools(token || '');
                setSchools(fetchedSchools);
            } catch (err) {
                setError('Failed to load schools');
            }
        };

        fetchSchools();
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

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                    <Typography variant="h4" component="h1">
                        Super Admin Dashboard
                    </Typography>
                    <Button variant="contained" color="primary" href="/admin/schools/new">
                        Add New School
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {schools.map((school) => (
                        <Grid item xs={12} md={6} lg={4} key={school.id}>
                            <Paper
                                sx={{
                                    p: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                }}
                            >
                                <Typography variant="h6" gutterBottom>
                                    {school.name}
                                </Typography>
                                <Typography color="text.secondary" paragraph>
                                    Code: {school.code}
                                </Typography>
                                <Typography color="text.secondary" paragraph>
                                    {school.address}
                                </Typography>
                                {school.principal && (
                                    <Typography variant="body2">
                                        Principal: {school.principal.username}
                                    </Typography>
                                )}
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        href={`/admin/schools/${school.id}`}
                                    >
                                        View Details
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </>
    );
} 