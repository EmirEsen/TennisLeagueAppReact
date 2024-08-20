import { Button, Card, Container, FormControl, Grid, styled, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { CloudUpload } from '@mui/icons-material';
import { IUpdatePlayerProfile } from '../../models/IUpdatePlayerProfile';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchUpdatePlayerProfile, uploadPlayerProfileImage } from '../../store/feature/playerSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/feature/authSlice';
import { IPlayerProfile } from '../../models/IPlayerProfile';
import toast from 'react-hot-toast';

interface EditPlayerProfileProps {
    playerProfile: IPlayerProfile;
}

const EditPlayerProfile = ({ playerProfile }: EditPlayerProfileProps) => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const defaultDate = dayjs('1996-07-27');

    const initialDob = playerProfile.dob ? dayjs(playerProfile.dob) : defaultDate;
    const [dob, setDob] = useState<Dayjs | null>(initialDob);

    const [formState, setFormState] = useState<IUpdatePlayerProfile>({
        firstname: playerProfile.firstname,
        lastname: playerProfile.lastname,
        dob: initialDob.toISOString(),
        heightInCm: playerProfile.heightInCm,
        weightInKg: playerProfile.weightInKg,
        avatar: null
    });

    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/heic']
    const maxImageSize = 3073272
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {

            const file = e.target.files[0];
            console.log(file);
            if (!validImageTypes.find(fileType => fileType === file.type) || file.size > maxImageSize) {
                setError('File must be in [jpg, png, heic] format. Max size 3.1 Mb!');
                return;
            }
            console.log('not reachable')
            setFormState({
                ...formState,
                avatar: e.target.files[0]
            });
        }
    };

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
            // Upload image first
            if (formState.avatar) {
                const formData = new FormData();
                formData.append('file', formState.avatar);
                console.log(formData)
                await dispatch(uploadPlayerProfileImage(formData)).unwrap();
            }
            await dispatch(fetchUpdatePlayerProfile(formState)).unwrap();

            toast.success('Profile Updated!')
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile.');
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
        <Card sx={{ width: '100%', marginTop: 2, maxWidth: 950, padding: 4, borderRadius: '16px' }} elevation={2}>
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom align='center'>
                    Update Player Profile
                </Typography>
                <FormControl component="form" onSubmit={handleSubmit}>
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
                                <VisuallyHiddenInput type="file" onChange={handleFileChange} />
                            </Button>
                            {error && (
                                <Typography color="error">{error}</Typography>
                            )}
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
                </FormControl>
            </Container>
        </Card >
    );
};

export default EditPlayerProfile
