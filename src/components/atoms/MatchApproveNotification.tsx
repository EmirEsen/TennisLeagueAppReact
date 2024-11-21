import React, { useEffect, useState } from 'react';
import { Box, Button, MenuItem, Typography, LinearProgress } from '@mui/material';
import { useDispatch } from 'react-redux';
import { markNotificationAsRead } from '../../store/feature/notificationSlice';
import { AppDispatch } from '../../store';
import { IMatchNotification } from '../../models/IMatchNotification';
import MatchInfo from './MatchInfo';
import { IGetMatch } from '../../models/get/IGetMatch';
import { IGetTournamentPlayer } from '../../models/get/IGetTournamentPlayer';
import { fetchMatchByTournamentIdAndMatchId } from '../../store/feature/matchSlice';
import { getPlayersOfTournament } from '../../store/feature/tournamentPlayerSlice';
import { logout } from '../../store/feature/authSlice';

// Add styles object for better organization
const styles = {
    menuItem: (isRead: boolean) => ({
        backgroundColor: isRead ? '#ffffff' : 'rgba(0, 0, 0, 0.04)', // White for read, grey for unread
        '&:hover': {
            backgroundColor: isRead ? 'rgba(0, 0, 0, 0.04)' : 'rgba(0, 0, 0, 0.08)',
        },
        width: '100%',        
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)', // Add subtle separator
    }),
    notificationBox: {
        display: 'flex', 
        flexDirection: 'column', 
        width: '100%',        
    },
    divider: {
        my: 1, 
        borderColor: 'rgba(0, 0, 0, 0.12)'
    },
    message: {
        whiteSpace: 'normal',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordBreak: 'break-word',
        mb: 1,
        maxWidth: '380px',
        fontWeight: (props: { isRead: boolean }) => props.isRead ? 'normal' : 'bold',
    },
    buttonContainer: {
        display: 'flex', 
        justifyContent: 'space-evenly',        
        mb: 1,
    }
};

interface NotificationItemProps {
    notification: IMatchNotification;    
    onApprove: (id: string) => void;
    onRevoke: (id: string) => void;
}

const MatchApproveNotification: React.FC<NotificationItemProps> = ({
    notification,    
    onApprove,
    onRevoke,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [match, setMatch] = useState<IGetMatch | null>(null);
    const [playerTournaments, setPlayerTournaments] = useState<IGetTournamentPlayer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const getMatchData = async () => {
            try {
                const matchData = await dispatch(fetchMatchByTournamentIdAndMatchId({
                    tournamentId: notification.tournamentId,
                    matchId: notification.matchId
                })).unwrap();
                setMatch(matchData);
            } catch (error) {
                console.error("Error fetching match data:", error);
                dispatch(logout());
            } finally {
                setLoading(false);
            }
        };
        getMatchData();
    }, [notification.matchId]);

    useEffect(() => {
        const getPlayerTournaments = async () => {
            try {
                const tournaments = await dispatch(getPlayersOfTournament(notification.tournamentId)).unwrap();
                setPlayerTournaments(tournaments);
            } catch (error) {
                console.error("Error fetching player tournaments:", error);
            }
        };
        getPlayerTournaments();
    }, [notification.tournamentId]);

    const handleMarkAsRead = () => {
        if (!notification.isRead) {
            dispatch(markNotificationAsRead(notification.id));
        }
    };

    return (
        <MenuItem 
            onClick={handleMarkAsRead}
            sx={styles.menuItem(notification.isRead)}
        >
            <Box sx={styles.notificationBox}>
                <Typography sx={{ ...styles.message, fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                    {notification.message}
                </Typography>

                {loading ? (
                    <LinearProgress sx={{ width: '100%', my: 2 }} />
                ) : (
                    match && <MatchInfo match={match} tournamentPlayerList={playerTournaments} />
                )}

                <Box sx={styles.buttonContainer}>
                    <Button 
                        variant="contained" 
                        color="success" 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent MenuItem onClick
                            onApprove(notification.id);
                        }}
                    >
                        Approve
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent MenuItem onClick
                            onRevoke(notification.id);
                        }}
                    >
                        Revoke
                    </Button>
                </Box>
            </Box>
        </MenuItem>
    );
};

export default MatchApproveNotification;