import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import { Avatar, Button, Container, ThemeProvider, createTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/feature/authSlice';
import { fetchPlayerNotifications } from '../../store/feature/notificationSlice';
import NotificationMenu from '../molecules/Notifications/NotificationMenu';

const tennis = createTheme({
    palette: {
        primary: {
            main: '#081223'
        }
    },
    typography: {
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        h6: {
            fontWeight: 800,
            letterSpacing: '0.02em'
        },
        h5: {
            fontWeight: 800,
            letterSpacing: '0.02em'
        },
        button: {
            fontWeight: 600,
            letterSpacing: '0.01em'
        }
    }
})

const pages = [
    // 'Clubs',
    'My Tournaments', 
    'Community'    
];

const settings = {
    signedIn: ['Profile', 'Logout'],
    signedOut: ['Sign In']
};

export default function NavBar() {    
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);    
    const [selectedPage, setSelectedPage] = React.useState<string>('Community');
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const loggedInPlayer = useAppSelector(state => state.player.loggedInProfile);

    const notifications = useAppSelector(state => state.Notification.notificationList) || [];

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    React.useEffect(() => {
        if (location.pathname === '/my-tournaments') {
            setSelectedPage('My Tournaments');
        } else if (location.pathname === '/') {
            setSelectedPage('Community');
        } else {
            setSelectedPage('');
        }
    }, [location.pathname]);

    React.useEffect(() => {
        if (isAuth && loggedInPlayer) {
            dispatch(fetchPlayerNotifications(loggedInPlayer.id));
            console.log('here is notifications', notifications);
        }
    }, [isAuth, loggedInPlayer, dispatch]);

    const handleCloseNavMenu = (page?: string) => {
        setAnchorElNav(null);
        if (page) {
            setSelectedPage(page);
            if (selectedPage !== page) {
                navigate(page === 'Community' ? '/' : '/my-tournaments');
            }
        }
    };

    const handleCloseUserMenu = (setting: string) => {
        setAnchorElUser(null);
        if (setting === 'Logout') {
            localStorage.removeItem('token');
            dispatch(logout());
            navigate('/');
        } else if (setting === 'Profile') {
            navigate('/profile');
        }
    };

    return (
        <ThemeProvider theme={tennis}>
            <AppBar position="sticky">
                <Container maxWidth="xl">
                    <Toolbar>
                        <Typography
                            variant="h6"
                            noWrap
                            component="h1"
                            onClick={() => navigate('/')}
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'inherit',
                                fontWeight: 800,
                                letterSpacing: '0.02em',
                                color: 'inherit',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                '& span.emoji': {
                                    marginLeft: '4px',
                                    marginRight: '4px',
                                    fontSize: '0.5em',                                    
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    verticalAlign: 'middle',
                                },
                            }}
                        >
                            GAME<span className="emoji">🎾</span>SET<span className="emoji">🎾</span>MATCH
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleOpenNavMenu}
                                color="inherit"
                            >
                                <MenuIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorElNav}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                                open={Boolean(anchorElNav)}
                                onClose={() => handleCloseNavMenu()}
                                sx={{
                                    display: { xs: 'block', md: 'none' },
                                }}
                            >
                                {pages.map((page) => (
                                    <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                                        <Typography textAlign="center">{page}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            onClick={() => navigate('/')}
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'inherit',
                                fontWeight: 800,
                                letterSpacing: '0.02em',
                                fontSize: '1.2rem',
                                color: 'inherit',
                                textDecoration: 'none',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                '& span.emoji': {
                                    marginLeft: '2px',
                                    marginRight: '2px',
                                    fontSize: '0.5em',                                    
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    verticalAlign: 'middle',
                                },
                            }}
                        >
                            G<span className="emoji">🎾</span>S<span className="emoji">🎾</span>M
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => handleCloseNavMenu(page)}
                                    sx={{
                                        my: 2,
                                        color: selectedPage === page ? 'white' : 'grey',
                                        display: 'block',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: selectedPage === page ? '100%' : 0,
                                            height: 2,
                                            backgroundColor: selectedPage === page ? 'blue' : 'transparent',
                                            transition: 'width 0.3s ease-in-out',
                                        },
                                        '&:hover::after': {
                                            width: '100%',
                                            backgroundColor: 'blue',
                                        },
                                    }}
                                >
                                    {page}
                                </Button>
                            ))}
                        </Box>

                        {isAuth && <NotificationMenu />}

                        <Box sx={{ flexGrow: 0 }}>
                            {isAuth ? (
                                <>
                                    <Tooltip title="Open settings">
                                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                            <Avatar alt={loggedInPlayer?.firstname[0]} src={loggedInPlayer?.profileImageUrl} />
                                        </IconButton>
                                    </Tooltip>
                                    <Menu
                                        sx={{ mt: '45px' }}
                                        id="menu-appbar"
                                        anchorEl={anchorElUser}
                                        anchorOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        keepMounted
                                        transformOrigin={{
                                            vertical: 'top',
                                            horizontal: 'right',
                                        }}
                                        open={Boolean(anchorElUser)}
                                        onClose={handleCloseUserMenu}
                                    >
                                        {settings.signedIn.map((setting) => (
                                            <MenuItem
                                                key={setting}
                                                onClick={() => handleCloseUserMenu(setting)}
                                            >
                                                <Typography textAlign="center">{setting}</Typography>
                                            </MenuItem>
                                        ))}
                                    </Menu>
                                </>
                            ) : (
                                <Button
                                    onClick={() => navigate('/login')}
                                    sx={{
                                        my: 2,
                                        color: 'grey',
                                        display: 'block',
                                        position: 'relative',
                                        '&::after': {
                                            content: '""',
                                            position: 'absolute',
                                            bottom: 0,
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 0,
                                            height: 2,
                                            backgroundColor: 'transparent',
                                            transition: 'width 0.3s ease-in-out',
                                        },
                                        '&:hover::after': {
                                            width: '100%',
                                            backgroundColor: 'blue',
                                        },
                                    }}
                                >
                                    Sign In
                                </Button>
                            )}
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </ThemeProvider>
    );
}
