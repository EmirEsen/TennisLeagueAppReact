import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Typography, Card, Box, FormControl, Autocomplete, Alert } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../store';
import { addNewMatch, getMatchList } from '../../../store/feature/matchSlice';
import { useNavigate } from 'react-router-dom';
import { IPostMatch, score } from '../../../models/post/IPostMatch';
import SelectPlayerInput from '../../atoms/SelectPlayerInput';
import { logout } from '../../../store/feature/authSlice';
import toast from 'react-hot-toast';
import { fetchPlayerProfile } from '../../../store/feature/playerSlice';
import { IPlayerProfile } from '../../../models/IPlayerProfile';


const AddNewMatch = ({ onClose, tournamentId, tournamentPlayerList }:
    {
        onClose: () => void,
        tournamentId: string,
        tournamentPlayerList: IPlayerProfile[];
    }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const loggedInProfile = useAppSelector(state => state.player.loggedInProfile)

    const [formState, setFormState] = useState<IPostMatch>({
        tournamentId: tournamentId || '',
        court: '',
        date: dayjs().format('YYYY-MM-DD'),
        time: 'N/A',
        player1Id: loggedInProfile?.id || '',
        player2Id: '',
        score: [{
            player1Id: loggedInProfile?.id || '',
            player1Score: 0,
            player2Id: '',
            player2Score: 0
        }]
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formState.court) newErrors.court = 'Court is required.';
        if (!formState.date) newErrors.date = 'Date is required.';
        if (!formState.player2Id) newErrors.player2Id = 'Select Opponent!';
        if (formState.score.length === 0 || formState.score[0].player1Score === 0 && formState.score[0].player2Score === 0) {
            newErrors.score = 'All sets must have valid scores';
        }
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

    const handleDateChange = (date: Dayjs | null) => {
        setFormState({
            ...formState,
            date: date ? date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD')
        });
    };

    const handleTimeChange = (_: any, value: string | null) => {
        setFormState({
            ...formState,
            time: value || 'N/A'
            // time: time ? time.format('HH:mm') : 'N/A'
        });
    };

    const handlePlayer2Change = (player2Id: string) => {
        const newScores = formState.score.map(score => ({
            ...score,
            player2Id
        }));
        setFormState({
            ...formState,
            player2Id,
            score: newScores
        });
    };

    const handleScoreChange = (index: number, field: keyof score, value: string | number) => {
        const newScores = [...formState.score];
        newScores[index] = {
            ...newScores[index],
            [field]: value,
        };
        setFormState({
            ...formState,
            score: newScores,
        });
    };

    const addNewSet = () => {
        setFormState({
            ...formState,
            score: [...formState.score, {
                player1Id: formState.player1Id,
                player1Score: 0,
                player2Id: formState.player2Id,
                player2Score: 0
            }]
        });
    };

    const removeLastSet = () => {
        if (formState.score.length > 1) {
            setFormState({
                ...formState,
                score: formState.score.slice(0, -1)
            });
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            await dispatch(addNewMatch(formState))
                .then((response) => {
                    if (addNewMatch.fulfilled.match(response)) {
                        toast.success('Match Added Successfully!');
                    }
                })
                .catch((error) => {
                    toast.error('Error adding match!');
                    console.log(error);
                });

            await dispatch(getMatchList());

            onClose();

            const updatedProfile = await dispatch(fetchPlayerProfile()).unwrap();

            if (updatedProfile.matchPlayed < 3) {
                toast((t) => (
                    <Grid container justifyContent={'space-between'}>
                        <Grid item>
                            Congrats! 📣, {updatedProfile?.firstname}. After {3 - updatedProfile.matchPlayed} more matches, your Rating will be set!
                            <Button onClick={() => toast.dismiss(t.id)}>
                                Dismiss
                            </Button>
                        </Grid>
                    </Grid>
                ), {
                    duration: 6000
                });
            } else if (updatedProfile.matchPlayed === 3) {
                toast(`Your rating has been revealed, ${updatedProfile?.rating}`, {
                    icon: '✨',
                });
            }
        } catch (error) {
            console.error('Failed to add match:', error);
            dispatch(logout());
            toast.error('Failed to Add Match!');
            navigate('/login');
        }
    };

    // const timeParts = formState.time !== 'N/A' && formState.time !== undefined ? formState.time.split(':') : ['00', '00'];
    // const timeValue = formState.time !== 'N/A'
    //     ? dayjs().set('hour', parseInt(timeParts[0])).set('minute', parseInt(timeParts[1]))
    //     : null;

    const timeSlots = Array.from(new Array(24 * 2)).map(
        (_, index) =>
            `${index < 20 ? '0' : ''}${Math.floor(index / 2)}:${index % 2 === 0 ? '00' : '30'
            }`,
    );

    return (
        <>
            <Card sx={{ width: '100%', marginTop: 0, maxWidth: 950, padding: 4, borderRadius: '16px' }}>
                <Container maxWidth="sm">
                    <Typography variant="h4" gutterBottom align='center'>
                        Add New Match
                    </Typography>
                    <FormControl component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Court"
                                    name="court"
                                    value={formState.court}
                                    onChange={handleChange}
                                    fullWidth
                                    error={!!errors.court}
                                    helperText={errors.court}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        label="Date"
                                        value={dayjs(formState.date)}
                                        onChange={handleDateChange}
                                        maxDate={dayjs()}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={6}>
                                <Autocomplete
                                    options={timeSlots}
                                    value={formState.time === 'N/A' ? null : formState.time}
                                    onChange={(_, value) => handleTimeChange(null, value)}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Play Time"
                                            error={!!errors.time}
                                            helperText={errors.time}
                                        />
                                    )}
                                    freeSolo
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <SelectPlayerInput
                                    selectedPlayer={formState.player2Id}
                                    onChange={handlePlayer2Change}
                                    tournamentId={tournamentId}
                                    tournamentPlayerList={tournamentPlayerList}
                                />
                                {errors.player2Id && (
                                    <Typography color="error" variant="caption">
                                        {errors.player2Id}
                                    </Typography>
                                )}
                            </Grid>
                            <Grid item xs={6}>
                                <Button variant="outlined" color="primary" fullWidth onClick={addNewSet}>
                                    Add Set
                                </Button>
                            </Grid>
                            {formState.score.length > 1 && (
                                <Grid item xs={6}>
                                    <Button variant="outlined" color="secondary" fullWidth onClick={removeLastSet}>
                                        Remove Set
                                    </Button>
                                </Grid>
                            )}
                            {errors.score && (
                                <Grid item xs={12} mt={-3}>
                                    <Box sx={{ width: '100%', mt: 2 }}>
                                        <Alert severity="error">
                                            {errors.score}
                                        </Alert>
                                    </Box>
                                </Grid>
                            )}
                            <Grid item xs={12} mt={-3}>
                                {formState.score.map((set, index) => (
                                    <Box key={index} sx={{ border: '1px solid #ccc', padding: 2, marginTop: 2 }}>
                                        <Typography variant="h6" gutterBottom>
                                            Set {index + 1}
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label={`Your Score`}
                                                    name="player1Score"
                                                    type="number"
                                                    value={set.player1Score}
                                                    inputProps={{ min: 0 }}
                                                    onChange={(e) => handleScoreChange(index, 'player1Score', parseInt(e.target.value, 10))}
                                                    fullWidth
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label={`Opponent`}
                                                    name="player2Score"
                                                    type="number"
                                                    value={set.player2Score}
                                                    inputProps={{ min: 0 }}
                                                    onChange={(e) => handleScoreChange(index, 'player2Score', parseInt(e.target.value, 10))}
                                                    fullWidth
                                                    required
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" fullWidth>
                                    Add Match
                                </Button>
                            </Grid>
                        </Grid>
                    </FormControl>
                </Container>
            </Card>
        </>
    );
};

export default AddNewMatch;
