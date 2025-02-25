'use client';

import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Paper, Grid, Card, CardContent, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert, FormControl, Select, MenuItem, InputLabel, Snackbar } from '@mui/material';
import { useParams } from 'next/navigation';
import { Student, getStudentById } from '../../../api/students';
import { ClassRoom, getClassRoomById } from '../../../api/classrooms';
import Navbar from '../../../components/Navbar';
import { Grade, CreateGradeRequest, getStudentGrades, createGrade, createOrUpdateGrade } from '../../../api/grades';
import { Lesson } from '../../../api/lessons';
import { useAuth } from '../../../auth/AuthContext';

// Sınav türleri için sabit değerler
const EXAM_TYPES = [
    { value: 1, label: 'Yazılı Sınav 1' },
    { value: 2, label: 'Yazılı Sınav 2' },
    { value: 3, label: 'Sözlü Sınav' },
    { value: 4, label: 'Proje' },
    { value: 5, label: 'Performans Ödevi' }
];

export default function StudentDetailsPage() {
    const { id } = useParams();
    const { token } = useAuth();
    const [student, setStudent] = useState<Student | null>(null);
    const [classroom, setClassroom] = useState<ClassRoom | null>(null);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);

    // Not girişi için state'ler
    const [gradeInputs, setGradeInputs] = useState<{
        [lessonId: string]: {
            [examType: number]: {
                score: string;
            }
        }
    }>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (!token) {
                    setError('You must be logged in to view student details');
                    return;
                }

                // Fetch student details, classroom details, and grades concurrently
                const studentData = await getStudentById(id as string, token);
                setStudent(studentData);

                // Fetch classroom details if student data has classroom id
                let classroomData = null;
                if (studentData.classroom?.id) {
                    classroomData = await getClassRoomById(studentData.classroom.id, token);
                    setClassroom(classroomData);
                }

                // Fetch student grades
                const gradesData = await getStudentGrades(id as string, token);
                setGrades(gradesData);
                
                // Not giriş state'ini hazırla
                if (classroomData && classroomData.lessons) {
                    initializeGradeInputs(classroomData.lessons, gradesData);
                }
                
                setError(null);
            } catch (err) {
                setError('Failed to load student data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, token]);

    // Not giriş state'ini hazırlayan fonksiyon
    const initializeGradeInputs = (lessons: Lesson[], grades: Grade[]) => {
        const inputs: any = {};
        
        // Tüm dersler için boş giriş alanları oluştur
        lessons.forEach(lesson => {
            inputs[lesson.id] = {};
            EXAM_TYPES.forEach(examType => {
                inputs[lesson.id][examType.value] = {
                    score: ''
                };
            });
        });
        
        // Mevcut notları yerleştir
        grades.forEach(grade => {
            if (inputs[grade.lesson.id] && inputs[grade.lesson.id][grade.examNumber]) {
                inputs[grade.lesson.id][grade.examNumber] = {
                    score: grade.score.toString()
                };
            }
        });
        
        setGradeInputs(inputs);
    };

    // Not değişikliğini izleyen fonksiyon
    const handleGradeChange = (lessonId: string, examType: number, value: string) => {
        setGradeInputs(prev => ({
            ...prev,
            [lessonId]: {
                ...prev[lessonId],
                [examType]: {
                    score: value
                }
            }
        }));
    };

    // Tek bir not kaydetme fonksiyonu
    const handleSaveGrade = async (lessonId: string, examType: number) => {
        try {
            if (!token) {
                setError('You must be logged in to save grades');
                setOpenSnackbar(true);
                return;
            }

            const input = gradeInputs[lessonId][examType];
            
            // Validasyon
            if (!input.score) {
                setError('Not değeri girilmelidir');
                setOpenSnackbar(true);
                return;
            }
            
            const score = parseFloat(input.score);
            if (isNaN(score) || score < 0 || score > 100) {
                setError('Not değeri 0-100 arasında olmalıdır');
                setOpenSnackbar(true);
                return;
            }

            // Not oluştur veya güncelle
            await createOrUpdateGrade({
                studentId: student?.id as string,
                lessonId,
                examNumber: examType,
                score,
                notes: ''
            }, token);

            // Başarı mesajı göster
            setSuccessMessage('Not başarıyla kaydedildi');
            setOpenSnackbar(true);
            
            // Notları yeniden yükle
            const gradesData = await getStudentGrades(id as string, token);
            setGrades(gradesData);
        } catch (err) {
            setError('Not kaydedilirken bir hata oluştu');
            setOpenSnackbar(true);
            console.error(err);
        }
    };

    // Tüm notları kaydetme fonksiyonu
    const handleSaveAllGrades = async () => {
        try {
            if (!token) {
                setError('You must be logged in to save all grades');
                setOpenSnackbar(true);
                return;
            }

            let savedCount = 0;
            let errorCount = 0;

            // Her ders ve sınav türü için dolu olan notları kaydet
            for (const lessonId in gradeInputs) {
                for (const examType in gradeInputs[lessonId]) {
                    const input = gradeInputs[lessonId][examType];
                    
                    // Boş notları atla
                    if (!input.score) continue;
                    
                    const score = parseFloat(input.score);
                    if (isNaN(score) || score < 0 || score > 100) {
                        errorCount++;
                        continue;
                    }

                    try {
                        // Yeni API'yi kullanarak notu güncelle veya oluştur
                        await createOrUpdateGrade({
                            studentId: student?.id as string,
                            lessonId,
                            examNumber: parseInt(examType),
                            score,
                            notes: ''
                        }, token);
                        savedCount++;
                    } catch (err) {
                        errorCount++;
                        console.error(err);
                    }
                }
            }

            // Sonuç mesajı göster
            if (savedCount > 0) {
                setSuccessMessage(`${savedCount} not başarıyla kaydedildi${errorCount > 0 ? `, ${errorCount} not kaydedilemedi` : ''}`);
            } else if (errorCount > 0) {
                setError(`${errorCount} not kaydedilemedi`);
            } else {
                setError('Kaydedilecek not bulunamadı');
            }
            setOpenSnackbar(true);
            
            // Notları yeniden yükle
            const gradesData = await getStudentGrades(id as string, token);
            setGrades(gradesData);
        } catch (err) {
            setError('Notlar kaydedilirken bir hata oluştu');
            setOpenSnackbar(true);
            console.error(err);
        }
    };

    // Mevcut notu bul
    const findGrade = (lessonId: string, examType: number) => {
        return grades.find(g => g.lesson.id === lessonId && g.examNumber === examType);
    };

    // Snackbar kapatma
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <Container>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                        <CircularProgress />
                    </Box>
                </Container>
            </>
        );
    }

    if (error || !student) {
        return (
            <>
                <Navbar />
                <Container>
                    <Typography color="error">{error || 'Student not found'}</Typography>
                </Container>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Student Details
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">Personal Information</Typography>
                            <Box sx={{ mt: 2 }}>
                                <Typography><strong>First Name:</strong> {student.firstName}</Typography>
                                <Typography><strong>Last Name:</strong> {student.lastName}</Typography>
                                <Typography><strong>Student Number:</strong> {student.studentNumber}</Typography>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6">Classroom Information</Typography>
                            <Box sx={{ mt: 2 }}>
                                {classroom ? (
                                    <>
                                        <Typography><strong>Classroom:</strong> {classroom.name}</Typography>
                                        <Typography><strong>Grade:</strong> {classroom.grade}</Typography>
                                        <Typography><strong>Section:</strong> {classroom.section}</Typography>
                                    </>
                                ) : (
                                    <Typography>No classroom assigned</Typography>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>

                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} mt={4}>
                    <Typography variant="h5">Grades</Typography>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Lesson</TableCell>
                                {EXAM_TYPES.map(type => (
                                    <TableCell key={type.value} align="center">{type.label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {classroom && classroom.lessons && classroom.lessons.length > 0 ? (
                                classroom.lessons.map((lesson: Lesson) => {
                                    // Find grades for this lesson
                                    const lessonGrades = grades.filter(g => g.lesson.id === lesson.id);
                                    const hasGrade = lessonGrades.length > 0;
                                    
                                    return (
                                        <TableRow key={`lesson-${lesson.id}`}>
                                            <TableCell>{lesson.name}</TableCell>
                                            {EXAM_TYPES.map(type => {
                                                const grade = findGrade(lesson.id, type.value);
                                                return (
                                                    <TableCell key={type.value} align="center">
                                                        <TextField
                                                            label="Score"
                                                            type="number"
                                                            size="small"
                                                            InputProps={{ inputProps: { min: 0, max: 100 } }}
                                                            value={gradeInputs[lesson.id]?.[type.value]?.score || ''}
                                                            onChange={(e) => handleGradeChange(lesson.id, type.value, e.target.value)}
                                                        />
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={EXAM_TYPES.length} align="center">
                                        No lessons available
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={handleSaveAllGrades}
                    >
                        Notları Kaydet
                    </Button>
                </Box>
            </Container>

            {/* Bildirim Snackbar */}
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseSnackbar} 
                    severity={error ? "error" : "success"} 
                    sx={{ width: '100%' }}
                >
                    {error || successMessage}
                </Alert>
            </Snackbar>
        </>
    );
} 