import { Avatar, Badge, Box, Button, Card, CircularProgress, Container, FormControl, Grid, IconButton, Modal, styled, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Add, Close } from '@mui/icons-material';
import { IUpdatePlayerProfile } from '../../models/IUpdatePlayerProfile';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchPlayerProfile, fetchUpdatePlayerProfile, uploadPlayerProfileImage } from '../../store/feature/playerSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/feature/authSlice';
import { IPlayerProfile } from '../../models/IPlayerProfile';
import toast from 'react-hot-toast';
import GenderRadioButton from '../atoms/GenderRadioButton';

interface EditPlayerProfileProps {
    playerProfile: IPlayerProfile;
}

const EditPlayerProfile = ({ playerProfile }: EditPlayerProfileProps) => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const defaultDate = dayjs('1996-07-27');

    const initialDob = playerProfile.dob ? dayjs(playerProfile.dob) : defaultDate;
    const [dob, setDob] = useState<Dayjs | null>(initialDob);
    const [isUploading, setIsUploading] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [open, setOpen] = useState(false);

    const [formState, setFormState] = useState<IUpdatePlayerProfile>({
        firstname: playerProfile.firstname,
        lastname: playerProfile.lastname,
        gender: playerProfile.gender,
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
            setFormState({
                ...formState,
                avatar: e.target.files[0]
            });
            setIsSelected(true)
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

    const handleGenderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormState({
            ...formState,
            gender: event.target.value  // Update gender when selected
        });
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(fetchUpdatePlayerProfile(formState)).unwrap();
            toast.success('Profile Updated!');
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile.');
            localStorage.removeItem('token');
            dispatch(logout());
            navigate('/login');
        }
    };

    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);

    const handlePhotoUpdate = async () => {
        if (!formState.avatar) {
            return;
        }
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', formState.avatar);

            console.log("Uploading photo:", formState.avatar);

            await dispatch(uploadPlayerProfileImage(formData))
                .unwrap()
                .then(() => dispatch(fetchPlayerProfile()))
                .finally(() => {
                    setIsUploading(false);
                    setIsSelected(false);
                    toast.success('Profile Photo Updated!');
                    handleModalClose();
                });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
            toast.error(errorMessage);
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
        <Card sx={{ width: '100%', marginTop: 2, maxWidth: 750, padding: 4, borderRadius: '16px' }} elevation={2}>
            <Container maxWidth="sm">
                <Typography variant="h4" gutterBottom align='center'>
                    Update Profile
                </Typography>
                <Grid item xs={12} mb={4}>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: 700,
                            margin: 'auto',
                            alignItems: 'center',
                        }}
                    >
                        <Badge
                            badgeContent={
                                <Add sx={{ fontSize: 10 }} />
                            }
                            color="primary"
                            overlap="circular"
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                        >
                            <Avatar
                                src={isSelected ? URL.createObjectURL(formState.avatar!) : playerProfile.profileImageUrl}
                                alt={playerProfile.firstname + ' ' + playerProfile.lastname}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    objectFit: 'cover',
                                    objectPosition: 'top',
                                    border: '1px solid',
                                    cursor: 'pointer',
                                }}
                                onClick={handleModalOpen}
                            />
                        </Badge>
                    </Box>
                </Grid>
                <FormControl component="form" onSubmit={handleUpdate}>
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
                        <Grid item xs={6}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Date of Birth"
                                    value={dob}
                                    onChange={handleDateChange}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={5} mt={-1} ml={1}>
                            <GenderRadioButton
                                value={formState.gender}
                                onChange={handleGenderChange} />
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
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" fullWidth>
                                Update Profile
                            </Button>
                        </Grid>
                    </Grid>
                </FormControl>
            </Container>

            <Modal open={open}
                onClose={handleModalClose}
                aria-labelledby="edit-photo-modal"
                aria-describedby="edit-photo-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 300,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <IconButton
                        sx={{ position: 'absolute', top: 10, right: 10 }}
                        onClick={handleModalClose}
                    >
                        <Close />
                    </IconButton>
                    <Typography variant="h6" id="edit-photo-modal" sx={{ mb: 2 }}>
                        Profile Photo
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            maxWidth: 800,
                            margin: 'auto',
                            alignItems: 'center',
                        }}
                    >
                        <label htmlFor="upload-photo">
                            <Avatar
                                src={isSelected ? URL.createObjectURL(formState.avatar!) : playerProfile.profileImageUrl}
                                alt={playerProfile.firstname + ' ' + playerProfile.lastname}
                                sx={{
                                    width: 150,
                                    height: 150,
                                    objectFit: 'cover',
                                    objectPosition: 'bottom',
                                    border: '1px solid',
                                    marginBottom: 2,
                                    cursor: 'pointer'
                                }}
                            />
                        </label>
                        <VisuallyHiddenInput
                            id="upload-photo"
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Box>

                    <Grid container justifyContent={'space-evenly'} >
                        <Grid item>
                            <Button component="label" variant="contained">
                                Add Photo
                                <VisuallyHiddenInput
                                    accept=".jpg,.jpeg,.png,.heic"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </Button>

                        </Grid>

                        <Grid item>
                            <Button
                                variant="contained"
                                color="warning"
                                onClick={handlePhotoUpdate}
                                disabled={!isSelected}
                            >
                                {isUploading ? <CircularProgress size={24} /> : 'Save'}
                            </Button>

                            {error && (
                                <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                    {error}
                                </Typography>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </Modal>
        </Card>
    );
};

export default EditPlayerProfile
