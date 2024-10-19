import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Typography, Card, FormControl } from '@mui/material';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../store';
import { IPostTournament } from '../../../models/IPostTournament';
import { addNewTournament } from '../../../store/feature/tournamentSlice';
import MultipleSelectCheckmarks from '../../atoms/MultipleSelectCheckmarks';


const AddNewTournament = ({ onClose }: { onClose: () => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const loggedInProfile = useAppSelector(state => state.player.loggedInProfile);

    const [formState, setFormState] = useState<IPostTournament>({
        title: '',
        info: '',
        isDateDesignated: false,
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        createdById: loggedInProfile?.id || '',
        participantIds: [],
        managerIds: [],
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formState.title) newErrors.title = 'Title is required.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleParticipantChange = (selectedIds: string[]) => {
        setFormState({
            ...formState,
            participantIds: selectedIds
        });
    };

    const handleManagerChange = (selectedIds: string[]) => {
        setFormState({
            ...formState,
            managerIds: selectedIds
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await dispatch(addNewTournament(formState));
            onClose();
        } catch (error) {
            console.error('Failed to add tournament:', error);
        }
    };

    return (
        <>
            <Card sx={{ width: '100%', marginTop: 0, maxWidth: 950, padding: 4, borderRadius: '16px' }}>
                <Container maxWidth="sm">
                    <Typography variant="h4" gutterBottom align="center">
                        Add New Tournament
                    </Typography>
                    <FormControl component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Tournament Title */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Title"
                                    name="title"
                                    value={formState.title}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.title}
                                    helperText={errors.title}
                                />
                            </Grid>

                            {/* Tournament Info */}
                            <Grid item xs={12}>
                                <TextField
                                    label="Info"
                                    name="info"
                                    value={formState.info}
                                    onChange={handleChange}
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>

                            {/* Start Date */}
                            <Grid item xs={6}>
                                <TextField
                                    label="Start Date"
                                    name="startDate"
                                    type="date"
                                    value={formState.startDate}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* End Date */}
                            <Grid item xs={6}>
                                <TextField
                                    label="End Date"
                                    name="endDate"
                                    type="date"
                                    value={formState.endDate}
                                    onChange={handleChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            {/* Participants */}
                            <Grid item xs={12}>
                                <MultipleSelectCheckmarks
                                    selectedItems={formState.participantIds}
                                    label="Select Participants"
                                    onChange={handleParticipantChange}
                                />
                            </Grid>

                            {/* Managers */}
                            <Grid item xs={12}>
                                <MultipleSelectCheckmarks
                                    selectedItems={formState.managerIds}
                                    label="Select Managers"
                                    onChange={handleManagerChange}
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Publish New Tournament
                                </Button>
                            </Grid>
                        </Grid>
                    </FormControl>
                </Container>
            </Card>
        </>
    );
};

export default AddNewTournament;
