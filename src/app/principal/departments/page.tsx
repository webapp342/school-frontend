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
    IconButton
} from '@mui/material';
import { Department, CreateDepartmentRequest, createDepartment, getAllDepartments, deleteDepartment, updateDepartment, getNextDepartmentCode } from '../../api/departments';
import Navbar from '../../components/Navbar';

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
    const [formData, setFormData] = useState<CreateDepartmentRequest>({
        name: '',
        code: '',
        description: ''
    });

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to view departments');
                    return;
                }
                const fetchedDepartments = await getAllDepartments(token);
                setDepartments(fetchedDepartments);
            } catch (err) {
                setError('Failed to load departments');
            }
        };

        fetchDepartments();
    }, []);

    const handleOpenDialog = async (department?: Department) => {
        try {
            if (department) {
                setEditingDepartment(department);
                setFormData({
                    name: department.name,
                    code: department.code,
                    description: department.description || ''
                });
                setOpenDialog(true);
            } else {
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('You must be logged in to manage departments');
                    return;
                }
                
                console.log('Getting next department code...');
                try {
                    const nextCode = await getNextDepartmentCode(token);
                    console.log('Received next code:', nextCode);
                    
                    setEditingDepartment(null);
                    setFormData({
                        name: '',
                        code: nextCode,
                        description: ''
                    });
                    setOpenDialog(true);
                } catch (codeError) {
                    console.error('Error getting next code:', codeError);
                    // Hata durumunda varsayılan bir kod ile devam et
                    setEditingDepartment(null);
                    setFormData({
                        name: '',
                        code: 'D1',
                        description: ''
                    });
                    setOpenDialog(true);
                }
            }
        } catch (err) {
            console.error('Error in handleOpenDialog:', err);
            setError('Failed to prepare department form. Please try again.');
        }
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to manage departments');
                return;
            }

            if (editingDepartment) {
                const updatedDepartment = await updateDepartment(editingDepartment.id, formData, token);
                setDepartments(departments.map(dept => 
                    dept.id === editingDepartment.id ? updatedDepartment : dept
                ));
            } else {
                const createdDepartment = await createDepartment(formData, token);
                setDepartments([...departments, createdDepartment]);
            }
            
            setOpenDialog(false);
            setFormData({
                name: '',
                code: '',
                description: ''
            });
        } catch (err) {
            setError(`Failed to ${editingDepartment ? 'update' : 'create'} department`);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('You must be logged in to delete departments');
                return;
            }

            await deleteDepartment(id, token);
            setDepartments(departments.filter(dept => dept.id !== id));
        } catch (err) {
            setError('Failed to delete department');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
                        School Departments
                    </Typography>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                        Add New Department
                    </Button>
                </Box>

                <Grid container spacing={3}>
                    {departments.map((department) => (
                        <Grid item xs={12} sm={6} md={4} key={department.id}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{department.name}</Typography>
                                    <Typography color="textSecondary">Code: {department.code}</Typography>
                                    {department.description && (
                                        <Typography sx={{ mt: 1 }}>{department.description}</Typography>
                                    )}
                                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleOpenDialog(department)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            color="error"
                                            size="small"
                                            onClick={() => handleDelete(department.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>
                        {editingDepartment ? 'Edit Department' : 'Add New Department'}
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Department Name"
                            fullWidth
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                        <TextField
                            margin="dense"
                            id="code"
                            label="Code"
                            type="text"
                            fullWidth
                            variant="outlined"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            InputProps={{
                                readOnly: !editingDepartment,
                                disabled: !editingDepartment,
                            }}
                        />
                        <TextField
                            margin="dense"
                            label="Description"
                            fullWidth
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {editingDepartment ? 'Update' : 'Create'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
} 