'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid
} from '@mui/material';
import { Lesson, getAllLessons } from '../api/lessons';
import { CreateScheduleRequest } from '../api/schedules';

interface AddScheduleDialogProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (schedule: CreateScheduleRequest) => void;
    classroomId: string;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const HOURS = Array.from({ length: 8 }, (_, i) => i + 1);
const TIME_SLOTS = [
    '08:00', '08:45', '09:00', '09:45',
    '10:00', '10:45', '11:00', '11:45',
    '12:00', '12:45', '13:00', '13:45',
    '14:00', '14:45', '15:00', '15:45',
    '16:00', '16:45'
];

export default function AddScheduleDialog({ open, onClose, onSubmit, classroomId }: AddScheduleDialogProps) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [selectedLesson, setSelectedLesson] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedHour, setSelectedHour] = useState<number>(1);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const fetchedLessons = await getAllLessons(token);
                setLessons(fetchedLessons);
            } catch (err) {
                setError('Failed to load lessons');
            }
        };

        fetchLessons();
    }, []);

    const handleSubmit = () => {
        if (!selectedLesson || !selectedDay || !startTime || !endTime) {
            setError('Please fill all required fields');
            return;
        }

        const schedule: CreateScheduleRequest = {
            lessonId: selectedLesson,
            classroomId: classroomId,
            dayOfWeek: selectedDay as 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY',
            startTime: startTime + ':00',
            endTime: endTime + ':00',
            lessonOrder: selectedHour
        };

        onSubmit(schedule);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>Add New Schedule Entry</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Lesson</InputLabel>
                            <Select
                                value={selectedLesson}
                                label="Lesson"
                                onChange={(e) => setSelectedLesson(e.target.value)}
                            >
                                {lessons.map((lesson) => (
                                    <MenuItem key={lesson.id} value={lesson.id}>
                                        {lesson.name} ({lesson.code})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Day</InputLabel>
                            <Select
                                value={selectedDay}
                                label="Day"
                                onChange={(e) => setSelectedDay(e.target.value)}
                            >
                                {DAYS.map((day) => (
                                    <MenuItem key={day} value={day}>
                                        {day.charAt(0) + day.slice(1).toLowerCase()}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControl fullWidth>
                            <InputLabel>Hour</InputLabel>
                            <Select
                                value={selectedHour}
                                label="Hour"
                                onChange={(e) => setSelectedHour(Number(e.target.value))}
                            >
                                {HOURS.map((hour) => (
                                    <MenuItem key={hour} value={hour}>
                                        {hour}. Hour
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>Start Time</InputLabel>
                            <Select
                                value={startTime}
                                label="Start Time"
                                onChange={(e) => setStartTime(e.target.value)}
                            >
                                {TIME_SLOTS.map((time) => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel>End Time</InputLabel>
                            <Select
                                value={endTime}
                                label="End Time"
                                onChange={(e) => setEndTime(e.target.value)}
                            >
                                {TIME_SLOTS.map((time) => (
                                    <MenuItem key={time} value={time}>
                                        {time}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} variant="contained" color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
} 