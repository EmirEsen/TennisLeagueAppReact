import { Button, Card, Container, Grid, styled, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CloudUpload } from '@mui/icons-material';
import { IUpdatePlayerProfile } from '../../models/IUpdatePlayerProfile';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchUpdatePlayerProfile } from '../../store/feature/playerSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/feature/authSlice';



interface EditPlayerProfileProps {
    playerProfile: IUpdatePlayerProfile;
}


const EditPlayerProfile = ({ playerProfile }: EditPlayerProfileProps) => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const defaultDate = dayjs('1996-07-27');

    // Initialize dob state. Use defaultDate if playerProfile.dob is empty or invalid.
    const initialDob = playerProfile.dob ? dayjs(playerProfile.dob) : defaultDate;
    const [dob, setDob] = useState<Dayjs | null>(initialDob);

    const [formState, setFormState] = useState<IUpdatePlayerProfile>({
        firstname: playerProfile.firstname,
        lastname: playerProfile.lastname,
        dob: initialDob.toISOString(),
        heightInCm: playerProfile.heightInCm,
        weightInKg: playerProfile.weightInKg
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleDateChange = (date: Dayjs | null) => {
        setDob(date);
        setFormState({
            ...formState,
            dob: date ? date.toISOString() : 'N/A'
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(fetchUpdatePlayerProfile(formState)).unwrap();
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile.');
            localStorage.removeItem('token');
            dispatch(logout())
            navigate('/login');
        }
    };

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    return (
        <Card sx={{ width: '100%', marginTop: 2, maxWidth: 950, padding: 4 }} elevation={2}>
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom align='center'>
                    Update Player Profile
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <TextField
                                label="First Name"
                                name="firstname"
                                value={formState.firstname}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                label="Last Name"
                                name="lastname"
                                value={formState.lastname}
                                onChange={handleChange}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                startIcon={<CloudUpload />}
                            >
                                Upload Image
                                <VisuallyHiddenInput type="file" />
                            </Button>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Height (cm)"
                                name="heightInCm"
                                type="number"
                                value={formState.heightInCm}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                label="Weight (kg)"
                                name="weightInKg"
                                type="number"
                                value={formState.weightInKg}
                                onChange={handleChange}
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={dayjs(dob)}
                                    onChange={handleDateChange}
                                />
                            </LocalizationProvider >
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Update Profile
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        </Card>
    );
};

export default EditPlayerProfile
