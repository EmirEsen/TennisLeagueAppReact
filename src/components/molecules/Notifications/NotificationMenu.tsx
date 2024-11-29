import React from 'react';
import { Box, IconButton, Badge, Tooltip, Menu, MenuItem } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../store';
import { fetchNotification, markNotificationAsRead } from '../../../store/feature/notificationSlice';
import MatchApproveNotification from '../../atoms/MatchApproveNotification';
import { useMatchActions } from '../../atoms/actions/useMatchActions';
import toast from 'react-hot-toast';

const NotificationMenu = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    
    const notifications = useAppSelector(state => state.Notification.notificationList) || [];
    const unreadCount = notifications.filter(notif => !notif.isRead).length;

    // Get match action handlers with a custom refresh callback
    const { handleApproveMatch, handleRejectMatch } = useMatchActions(async () => {        
        setAnchorEl(null);
    });

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleNotificationAction = async (
        notificationId: string, 
        actionHandler: (matchId: string, tournamentId: string) => Promise<void>
    ) => {
        try {
            const notification = await dispatch(fetchNotification(notificationId)).unwrap();
            if (!notification || !notification.tournamentId || !notification.matchId) {
                toast.error('Invalid notification data');
                return;
            }
            
            // Execute the action (approve or reject)
            await actionHandler(notification.matchId, notification.tournamentId);
            
            // Mark notification as read
            await dispatch(markNotificationAsRead(notificationId));
        } catch (error) {
            toast.error('Error handling notification action');
            console.error('Notification action error:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 0, mr: 3 }}>
            <Tooltip title="Notifications">
                <IconButton onClick={handleOpenMenu} color="inherit" size='small'>
                    <Badge badgeContent={unreadCount} color="error">
                        <Notifications />
                    </Badge>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleCloseMenu}
                sx={{                                                                           
                    mt: 4,
                    '& .MuiMenu-paper': {
                        borderRadius: '16px',
                    },
                }}
            >
                {notifications.length === 0 ? (
                    <MenuItem onClick={handleCloseMenu}>No new notification</MenuItem>
                ) : (
                    notifications.map((notification) => (
                        <MatchApproveNotification
                            key={notification.id}                                                
                            notification={notification}
                            onApprove={() => handleNotificationAction(notification.id, handleApproveMatch)}
                            onReject={() => handleNotificationAction(notification.id, handleRejectMatch)}
                        />
                    ))
                )}
            </Menu>
        </Box>
    );
};

export default NotificationMenu;