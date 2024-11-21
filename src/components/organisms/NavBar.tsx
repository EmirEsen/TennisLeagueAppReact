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
import { Avatar, Badge, Button, Container, ThemeProvider, createTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../store';
import { logout } from '../../store/feature/authSlice';
import { Notifications } from '@mui/icons-material';
import { fetchNotification, fetchPlayerNotifications, markNotificationAsRead } from '../../store/feature/notificationSlice';
import MatchApproveNotification from '../atoms/MatchApproveNotification';
import { approveMatch, revokeMatch } from '../../store/feature/matchSlice';
import toast from 'react-hot-toast';

const tennis = createTheme({
    palette: {
        primary: {
            main: '#081223'
        }
    }
})

const pages = ['Clubs', 'Community', 'My Tournaments'];
const settings = {
    signedIn: ['Profile', 'Logout'],
    signedOut: ['Sign In']
};

export default function NavBar() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElNotification, setAnchorElNotification] = React.useState<null | HTMLElement>(null);
    const [selectedPage, setSelectedPage] = React.useState<string>('Community');
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const loggedInPlayer = useAppSelector(state => state.player.loggedInProfile);

    const notifications = useAppSelector(state => state.Notification.notificationList) || [];
    const unreadCount = notifications.filter(notif => !notif.isRead).length;


    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleApproveMatch = async (notificationId: string) => {
        try {
            const notification = await dispatch(fetchNotification(notificationId)).unwrap();

            if (!notification) {
                console.error("Notification not found");
                toast.error('Notification not found');
                return;
            }

            const { tournamentId, matchId } = notification;

            if (!tournamentId || !matchId) {
                console.error("Invalid notification data");
                toast.error('Invalid notification data');
                return;
            }

            const approveResponse = await dispatch(approveMatch({ tournamentId, matchId })).unwrap();
            
            if (approveResponse.code === 200) {
                await dispatch(markNotificationAsRead(notificationId));
                if (loggedInPlayer) {
                    await dispatch(fetchPlayerNotifications(loggedInPlayer.id));
                }
                toast.success('Match approved successfully');
            } else {
                toast.error(approveResponse.message || 'Error approving match');
            }
        } catch (error) {
            toast.error('Error handling approve notification');
        }
    };

    const handleRevokeMatch = async(notificationId: string) => {
        try {
            const notification = await dispatch(fetchNotification(notificationId)).unwrap();

            if (!notification) {
                console.error("Notification not found");
                toast.error('Notification not found');
                return;
            }

            const { tournamentId, matchId } = notification;

            if (!tournamentId || !matchId) {
                console.error("Invalid notification data");
                toast.error('Invalid notification data');
                return;
            }

            const revokeResponse = await dispatch(revokeMatch({ tournamentId, matchId })).unwrap();
            console.log('revokeResponse', revokeResponse);
            if (revokeResponse.code === 200) {
                await dispatch(markNotificationAsRead(notificationId));
                if (loggedInPlayer) {
                    await dispatch(fetchPlayerNotifications(loggedInPlayer.id));
                }
                toast.error('Match Revoked!');
            } else {
                toast.error(revokeResponse.message || 'Error revoking match');
            }
        } catch (error) {
            toast.error('Error handling revoke notification');
        }
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

    const handleOpenNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNotification(event.currentTarget);
    };

    const handleCloseNotificationMenu = () => {
        setAnchorElNotification(null);
    };

    const handleCloseNavMenu = (page: string) => {
        setAnchorElNav(null);
        setSelectedPage(page);
        if (selectedPage !== page) {
            navigate(page === 'Community' ? '/' : '/my-tournaments');
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
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 600,
                                letterSpacing: '.2rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            Tennis Club
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
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 600,
                                letterSpacing: '.2rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            TENNIS CLUB
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

                        {isAuth && (
                            <Box sx={{ flexGrow: 0, mr: 3 }}>
                                <Tooltip title="Notifications">
                                    <IconButton onClick={handleOpenNotificationMenu} color="inherit" size='small'>
                                        <Badge badgeContent={unreadCount} color="error">
                                            <Notifications />
                                        </Badge>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    anchorEl={anchorElNotification}
                                    open={Boolean(anchorElNotification)}
                                    onClose={handleCloseNotificationMenu}
                                    sx={{                                                                           
                                        mt: 4,
                                        '& .MuiMenu-paper': { // Ensure paper element also has the styling
                                            borderRadius: '16px',
                                        },
                                    }}
                                >
                                    {notifications.length === 0 ? (
                                        <MenuItem onClick={handleCloseNotificationMenu}>No new notification</MenuItem>
                                    ) : (
                                        notifications.map((notification) => (
                                            <MatchApproveNotification
                                                key={notification.id}                                                
                                                notification={notification}
                                                onApprove={handleApproveMatch}
                                                onRevoke={handleRevokeMatch}
                                            />
                                        ))
                                    )}
                                </Menu>
                            </Box>
                        )}

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
