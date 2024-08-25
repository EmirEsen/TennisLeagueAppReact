import { Avatar, Badge, Box, Button, Card, Container, FormControl, Grid, Modal, styled, TextField, Typography } from '@mui/material';
import React, { useState } from 'react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AddAPhoto, Close, CloudUploadOutlined } from '@mui/icons-material';
import { IUpdatePlayerProfile } from '../../models/IUpdatePlayerProfile';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchUpdatePlayerProfile, uploadPlayerProfileImage } from '../../store/feature/playerSlice';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/feature/authSlice';
import { IPlayerProfile } from '../../models/IPlayerProfile';
import toast from 'react-hot-toast';
import { blue } from '@mui/material/colors';
import { IconButton } from '@mui/joy';

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
            setOpen(false);
        } catch (error) {
            console.error('Failed to update profile:', error);
            toast.error('Failed to update profile.');
            localStorage.removeItem('token');
            dispatch(logout())
            navigate('/login');
        }
    };

    const handleModalOpen = () => setOpen(true);
    const handleModalClose = () => setOpen(false);

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
                <Grid item xs={12}>
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
                        <Badge
                            badgeContent={
                                <AddAPhoto sx={{ fontSize: 20, color: blue[500] }} />
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
                <Grid sx={{ justifyContent: 'center', marginY: 3, marginLeft: 0.8 }} container spacing={2}>
                    <Grid item>
                        {error && (
                            <Typography color="error">{error}</Typography>
                        )}
                        <Button
                            component="label"
                            variant="contained"
                            tabIndex={-1}
                            startIcon={<CloudUploadOutlined />}
                            onClick={handleSubmit}
                            disabled={isUploading || !isSelected}
                        >
                            {isUploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                    </Grid>
                </Grid>
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
                                    value={dob}
                                    onChange={handleDateChange}
                                />
                            </LocalizationProvider>
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
                    <Avatar
                        src={isSelected ? URL.createObjectURL(formState.avatar!) : playerProfile.profileImageUrl}
                        alt={playerProfile.firstname + ' ' + playerProfile.lastname}
                        sx={{
                            width: 150,
                            height: 150,
                            objectFit: 'cover',
                            objectPosition: 'bottom',
                            border: '1px solid',
                            marginBottom: 2
                        }}
                    />
                    <Button component="label" variant="contained">
                        Add Photo
                        <VisuallyHiddenInput
                            accept=".jpg,.jpeg,.png,.heic"
                            type="file"
                            onChange={handleFileChange}
                        />
                    </Button>
                    <Button disabled={!isSelected} component="label" variant="contained">
                        Save
                    </Button>

                </Box>
            </Modal>
        </Card>
    );
};

export default EditPlayerProfile
