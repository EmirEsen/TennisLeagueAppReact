import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { SportsTennis } from '@mui/icons-material';
import { AppDispatch } from '../../store';
import { useDispatch } from 'react-redux';
import { fetchRegister } from '../../store/feature/authSlice';
import { Alert, Collapse, Link as MUILink } from '@mui/material'
import toast from 'react-hot-toast';


function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <MUILink
                color="inherit"
                href="https://www.linkedin.com/in/emir-esen-767452148/"
                target="_blank"
                rel="noopener noreferrer"
            >
                Emir Esen
            </MUILink>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}


export default function RegisterCard() {
    const [error, setError] = useState('');
    const [isError, setIsError] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        rePassword: ''
    });

    const [isPasswordMatch, setIsPasswordMatch] = useState(true)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (name === 'password' || name === 'rePassword') {
            setIsPasswordMatch(formData.password === value || formData.rePassword === value);
        }
    };

    const register = () => {
        dispatch(fetchRegister({
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            password: formData.password
        })).then((res) => {
            console.log(res)
            const payload = res.payload;
            if (payload && typeof payload === 'object' && 'code' in payload && payload.code === 200) {
                navigate('/login');
                toast(
                    payload.message,
                    {
                        icon: '🎉',
                        duration: 6000
                    }
                );
            } else if (payload && typeof payload === 'object' && 'code' in payload && payload.code > 1000) {
                setIsError(true);
                setError(payload.message);
            } else {
                setIsError(true);
                setError('An unexpected error occurred, Try again later.');
            }
        });
    }

    useEffect(() => {
        if (isError) {
            const timer = setTimeout(() => {
                setIsError(false);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [isError, setIsError]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isPasswordMatch) {
            return;
        }
        register();
    };

    return (
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#606c38' }}>
                    <SportsTennis />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Register
                </Typography>
                <Collapse sx={{ width: '100%' }} in={isError}>
                    <Box sx={{ width: '100%', mt: 2 }}>
                        <Alert severity="error">
                            {error}
                        </Alert>
                    </Box>
                </Collapse>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                autoComplete="given-name"
                                name="firstname"
                                required
                                fullWidth
                                id="firstname"
                                label="First Name"
                                autoFocus
                                value={formData.firstname}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="lastname"
                                label="Last Name"
                                name="lastname"
                                autoComplete="family-name"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="rePassword"
                        label="Confirm Password"
                        type="password"
                        id="rePassword"
                        autoComplete="current-password"
                        value={formData.rePassword}
                        onChange={handleChange}
                        error={!isPasswordMatch}
                        helperText={!isPasswordMatch ? 'Passwords must match!' : ''}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            {/* <Link href="#" variant="body2">
                                        Forgot password?
                                    </Link> */}
                        </Grid>
                        <Grid item>
                            <Typography variant="body2">
                                <Link to={'/login'}>
                                    {"Already Have an Account, Log In!"}
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Box>
        </Grid>
    );
}