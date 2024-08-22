import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchLogin } from '../../store/feature/authSlice';
import { Toaster } from 'react-hot-toast';
import { Alert, Collapse, Link as MUILink } from '@mui/material'


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

export default function LoginCard() {
    const [error, setError] = useState('');
    const [isError, setIsError] = useState(false);

    const dispatch: AppDispatch = useDispatch();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const login = () => {
        dispatch(fetchLogin({
            email: formData.email,
            password: formData.password
        }))
            .then((res) => {
                console.log(res)
                const payload = res.payload;

                if (payload && typeof payload === 'object' && 'code' in payload && payload.code === 200) {
                    navigate('/');
                } else if (payload && typeof payload === 'object' && 'code' in payload && payload.code > 1000) {
                    setIsError(true);
                    setError(payload.message);
                } else {
                    setIsError(true);
                    setError('An unexpected error occurred, Try again later.');
                }
            })
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
        login();
    };

    return (
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Toaster />
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: '#bc6c25' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Log in
                </Typography>
                <Collapse sx={{ width: '100%' }} in={isError}>
                    <Box sx={{ width: '100%', mt: 2 }}>
                        <Alert severity="error">
                            {error}
                        </Alert>
                    </Box>
                </Collapse>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
                        Log In
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            {/* <Link href="#" variant="body2">
                            Forgot password?
                        </Link> */}
                        </Grid>
                        <Grid item>
                            <Typography variant='body2'>
                                <Link to={'/register'}>
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                    <Copyright sx={{ mt: 5 }} />
                </Box>
            </Box>
        </Grid >
    );
}