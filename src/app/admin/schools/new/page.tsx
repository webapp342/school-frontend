'use client';

import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Paper } from '@mui/material';
import { createSchool } from '../../../api/schools';
import { useRouter } from 'next/navigation';
import Navbar from '../../../components/Navbar';

export default function NewSchool() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        code: '',
        principalUsername: '',
        principalPassword: ''
    });
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to create a school');
                return;
            }
            await createSchool(formData, token);
            router.push('/admin/dashboard');
        } catch {
            setError('Failed to create school');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <>
            <Navbar />
            <Container component="main" maxWidth="sm">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Paper sx={{ p: 4 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                            Add New School
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="School Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="School Code"
                                name="code"
                                value={formData.code}
                                onChange={handleChange}
                                helperText="Unique code for the school"
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="School Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Principal Username"
                                name="principalUsername"
                                value={formData.principalUsername}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                label="Principal Password"
                                name="principalPassword"
                                type="password"
                                value={formData.principalPassword}
                                onChange={handleChange}
                            />
                            {error && (
                                <Typography color="error" sx={{ mt: 2 }}>
                                    {error}
                                </Typography>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Create School
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </>
    );
} 