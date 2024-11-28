import { useDispatch } from 'react-redux';
import { AppDispatch, useAppSelector } from '../../../store';
import { approveMatch, rejectMatch, autoRejectMatch, getTournamentMatchList } from '../../../store/feature/matchSlice';
import { getPlayersOfTournament } from '../../../store/feature/tournamentPlayerSlice';
import { Grid, Button } from '@mui/material';
import toast from 'react-hot-toast';
import { IGetTournamentPlayer } from '../../../models/get/IGetTournamentPlayer';
import { IPlayerProfile } from '../../../models/IPlayerProfile';
import { fetchPlayerNotifications } from '../../../store/feature/notificationSlice';

export const useMatchActions = (onRefresh?: () => void) => {
    const dispatch = useDispatch<AppDispatch>();
    const loggedInPlayer: IPlayerProfile | null = useAppSelector(state => state.player.loggedInProfile);

    const refreshAllData = async (tournamentId: string) => {
        try {
            // Refresh all data concurrently
            await Promise.all([
                // Refresh tournament data (matches and rankings)
                dispatch(getTournamentMatchList({ tournamentId })),
                dispatch(getPlayersOfTournament(tournamentId)),
                // Refresh notifications if user is logged in
                loggedInPlayer?.id ? dispatch(fetchPlayerNotifications(loggedInPlayer.id)) : Promise.resolve(),
                // Call additional refresh if provided
                onRefresh ? Promise.resolve(onRefresh()) : Promise.resolve()
            ]);
        } catch (error) {
            console.error('Error refreshing data:', error);
            toast.error('Error refreshing data');
        }
    };

    const handleRatingToast = (updatedProfile: IGetTournamentPlayer) => {
        if (updatedProfile.matchPlayed < 3) {
            toast((t) => (
                <Grid container justifyContent={'space-between'}>
                    <Grid item xs>
                        Congrats! 📣, {updatedProfile?.firstname}. After {3 - updatedProfile.matchPlayed} more matches, your Rating will be set!
                        <Button onClick={() => toast.dismiss(t.id)}>
                            Dismiss
                        </Button>
                    </Grid>
                </Grid>
            ), {
                duration: 6000
            });
        } else if (updatedProfile.matchPlayed === 3) {
            toast(`Your rating has been revealed, ${updatedProfile?.rating}`, {
                icon: '✨',
            });
        }
    };

    const handleApproveMatch = async (matchId: string, tournamentId: string): Promise<void> => {
        try {
            const approveResponse = await dispatch(approveMatch({ tournamentId, matchId })).unwrap();

            if (approveResponse.code === 200) {
                // Refresh all data
                await refreshAllData(tournamentId);

                // Check for rating updates
                const tournamentPlayers = await dispatch(getPlayersOfTournament(tournamentId)).unwrap();
                const updatedProfile = tournamentPlayers.find(player => player.playerId === loggedInPlayer?.id);

                if (updatedProfile) {
                    handleRatingToast(updatedProfile);
                }
                
                toast.success('Match approved successfully');
            } else {
                toast.error(approveResponse.message || 'Error approving match');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error handling approve match');
        }
    };

    const handleRejectMatch = async (matchId: string, tournamentId: string): Promise<void> => {
        try {
            const revokeResponse = await dispatch(rejectMatch({ tournamentId, matchId })).unwrap();
            if (revokeResponse.code === 200) {
                // Refresh all data
                await refreshAllData(tournamentId);
                
                toast.error('Match Rejected!');
            } else {
                toast.error(revokeResponse.message || 'Error rejecting match');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error handling reject match');
        }
    };

    const handleAutoRejectMatch = async (matchId: string, tournamentId: string): Promise<void> => {
        try {
            const revokeResponse = await dispatch(autoRejectMatch({ tournamentId, matchId })).unwrap();
            if (revokeResponse.code === 200) {
                // Refresh all data
                await refreshAllData(tournamentId);
                
                toast.error('Match Auto-Rejected');
            } else {
                toast.error(revokeResponse.message || 'Error auto-rejecting match');
            }
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error handling auto-reject match');
        }
    };

    return {
        handleApproveMatch,
        handleRejectMatch,
        handleAutoRejectMatch
    };
};