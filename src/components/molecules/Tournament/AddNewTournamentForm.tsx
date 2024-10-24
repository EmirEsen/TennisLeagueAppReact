import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Typography, Card, FormControl } from '@mui/material';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../store';
import { IPostTournament } from '../../../models/post/IPostTournament';
import { addNewTournament } from '../../../store/feature/tournamentSlice';
import MultipleSelectCheckmarks from '../../atoms/MultipleSelectCheckmarks';
import { logout } from '../../../store/feature/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import TournamentPrivacyRadioButton from '../../atoms/TournamentPrivacyRadioButton';
import { TournamentPrivacy } from '../../../models/enums/TournamentPrivacy';
import TournamentDurationSwitch from '../../atoms/TournamentDurationSwitch';


const AddNewTournament = ({ onClose }: { onClose: () => void }) => {
    const dispatch = useDispatch<AppDispatch>();
    const loggedInProfile = useAppSelector(state => state.player.loggedInProfile);

    const navigate = useNavigate()

    const [formState, setFormState] = useState<IPostTournament>({
        title: '',
        info: '',
        privacy: TournamentPrivacy.PUBLIC,
        isDurationFinite: true,
        startDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        createdById: loggedInProfile?.id || '',
        participantIds: [],
        updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss')
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const today = dayjs().format('YYYY-MM-DD');
    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formState.title) newErrors.title = 'Title is required.';
        if (dayjs(formState.startDate).isBefore(today)) {
            newErrors.startDate = 'Start date cannot be before today.';
        }
        if (dayjs(formState.startDate).isAfter(dayjs(formState.endDate))) {
            newErrors.endDate = 'End date cannot be before start date.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value as TournamentPrivacy;
        setFormState({
            ...formState,
            privacy: value
        });
    };

    const handleDurationSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const isFinite = event.target.checked;
        setFormState({
            ...formState,
            isDurationFinite: isFinite,
            startDate: isFinite ? formState.startDate : null,  // set to null if infinite duration
            endDate: isFinite ? formState.endDate : null,      // set to null if infinite duration
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleParticipantChange = (selectedIds: string[]) => {
        const updatedIds = loggedInProfile?.id
            ? [...new Set([loggedInProfile.id, ...selectedIds])]
            : selectedIds;
        setFormState({
            ...formState,
            participantIds: updatedIds,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await dispatch(addNewTournament(formState))
                .then((response) => {
                    if (addNewTournament.fulfilled.match(response)) {
                        toast.success('Tournament Added Successfully!');
                    }
                });
            onClose();
        } catch (error) {
            dispatch(logout());
            toast.error('Failed to Add Tournament!');
            navigate('/login');
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
                                    value={formState.startDate || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    inputProps={{ min: dayjs().format('YYYY-MM-DD') }}
                                    InputLabelProps={{ shrink: true }}
                                    disabled={!formState.isDurationFinite}
                                />
                            </Grid>

                            {/* End Date */}
                            <Grid item xs={6}>
                                <TextField
                                    label="End Date"
                                    name="endDate"
                                    type="date"
                                    value={formState.endDate || ''}
                                    onChange={handleChange}
                                    fullWidth
                                    inputProps={{ min: dayjs().format('YYYY-MM-DD') }}
                                    InputLabelProps={{ shrink: true }}
                                    helperText={errors.endDate}
                                    disabled={!formState.isDurationFinite}
                                />
                            </Grid>

                            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', margin: 1, my: -2 }}>
                                <TournamentDurationSwitch
                                    isFiniteDuration={formState.isDurationFinite}
                                    handleSwitchChange={handleDurationSwitchChange}
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
                            <Grid item xs={12}>
                                <TournamentPrivacyRadioButton
                                    value={formState.privacy}
                                    onChange={handlePrivacyChange} />
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
