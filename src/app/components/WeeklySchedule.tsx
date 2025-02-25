'use client';

import React from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Schedule } from '../api/schedules';

interface WeeklyScheduleProps {
    schedules: Schedule[];
    onDeleteSchedule?: (scheduleId: string) => void;
}

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
const HOURS = Array.from({ length: 8 }, (_, i) => i + 1); // 8 ders saati

export default function WeeklySchedule({ schedules, onDeleteSchedule }: WeeklyScheduleProps) {
    const getScheduleForTimeSlot = (day: string, hour: number) => {
        return schedules.find(s => s.dayOfWeek === day && s.lessonOrder === hour);
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Hour</TableCell>
                        {DAYS.map(day => (
                            <TableCell key={day} align="center">
                                {day.charAt(0) + day.slice(1).toLowerCase()}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {HOURS.map(hour => (
                        <TableRow key={hour}>
                            <TableCell>{hour}. Hour</TableCell>
                            {DAYS.map(day => {
                                const schedule = getScheduleForTimeSlot(day, hour);
                                return (
                                    <TableCell key={day} align="center" sx={{ minWidth: 150 }}>
                                        {schedule ? (
                                            <Box sx={{ position: 'relative' }}>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {schedule.lessonName || ''}
                                                </Typography>
                                                {schedule.teacherName && (
                                                    <Typography variant="caption" display="block" color="textSecondary">
                                                        {schedule.teacherName}
                                                    </Typography>
                                                )}
                                                <Typography variant="caption" display="block" color="primary">
                                                    {schedule.lessonCode || ''}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    {schedule.startTime.substring(0, 5)} - {schedule.endTime.substring(0, 5)}
                                                </Typography>
                                                {onDeleteSchedule && (
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => onDeleteSchedule(schedule.id)}
                                                        sx={{ position: 'absolute', top: 0, right: 0 }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                )}
                                            </Box>
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
} 