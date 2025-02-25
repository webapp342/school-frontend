'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid } from '@mui/material';
import { School, getSchoolById } from '../../../api/schools';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';

export default function SchoolDetails() {
    const params = useParams();
    const [school, setSchool] = useState<School | null>(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchSchool = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to view school details');
                    return;
                }
                const schoolData = await getSchoolById(params.id as string, token);
                setSchool(schoolData);
            } catch (err) {
                setError('Failed to load school details');
            }
        };

        fetchSchool();
    }, [params.id]);

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
                    School Details
                </Typography>
                <Paper sx={{ p: 4, mt: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h6">School Information</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography><strong>ID:</strong> {school.id}</Typography>
                                <Typography><strong>Name:</strong> {school.name}</Typography>
                                <Typography><strong>Code:</strong> {school.code}</Typography>
                                <Typography><strong>Address:</strong> {school.address}</Typography>
                            </Box>
                        </Grid>
                        {school.principal && (
                            <Grid item xs={12}>
                                <Typography variant="h6">Principal Information</Typography>
                                <Box sx={{ mt: 2 }}>
                                    <Typography><strong>Username:</strong> {school.principal.username}</Typography>
                                    <Typography><strong>Code:</strong> {school.principal.code}</Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Paper>
            </Container>
        </>
    );
} 