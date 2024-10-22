import { Alert, Box, Button, CircularProgress, Container, Fab, Grid, useMediaQuery } from '@mui/material';
import NavBar from '../components/organisms/NavBar';
import { AppDispatch, useAppSelector } from '../store';
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchPlayerProfile, getPlayerProfileList } from '../store/feature/playerSlice';
import { getMatchList } from '../store/feature/matchSlice';
import { Toaster } from 'react-hot-toast';
import { fetchSendConfirmationEmail } from '../store/feature/authSlice';
import AddIcon from '@mui/icons-material/Add';
import Tournament from '../components/molecules/Tournament/Tournament';
import { getTournamentList } from '../store/feature/tournamentSlice';
import ModalAddNewTournament from '../components/molecules/Tournament/ModaNewTournament';
import config from '../store/feature/config';
import { IPlayerProfile } from '../models/IPlayerProfile';

export default function Home() {

    const { tournamentList, isLoading: isTournamentLoading } = useAppSelector(state => state.tournament);
    const { loggedInProfile } = useAppSelector(state => state.player);
    const isAuth = useAppSelector(state => state.auth.isAuth);
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery('(max-width: 600px)');
    const [tournamentPlayers, setTournamentPlayers] = useState<{ [key: string]: IPlayerProfile[] }>({});

    useEffect(() => {
        dispatch(getPlayerProfileList());
        dispatch(getMatchList());
        dispatch(getTournamentList());
        if (isAuth) {
            dispatch(fetchPlayerProfile());
        }
    }, [isAuth]);

    const [isEmailVerified, setIsEmailVerified] = useState(false);

    useEffect(() => {
        if (loggedInProfile) {
            setIsEmailVerified(loggedInProfile.isEmailVerified);
        }
    }, [loggedInProfile]);

    useEffect(() => {
        // Fetch players for each tournament
        const fetchTournamentPlayers = async (tournamentId: string) => {
            try {
                const response = await fetch(`${config.BASE_URL}/api/v1/tournament-player/${tournamentId}/players`);
                const players: IPlayerProfile[] = await response.json();
                setTournamentPlayers((prevPlayers) => ({
                    ...prevPlayers,
                    [tournamentId]: players
                }));
            } catch (error) {
                console.error("Failed to fetch tournament players:", error);
            }
        };

        tournamentList.forEach(tournament => {
            if (!tournamentPlayers[tournament.id]) {
                fetchTournamentPlayers(tournament.id);
            }
        });
    }, [tournamentList]);

    const reSendConfirmationEmail = () => {
        dispatch(fetchSendConfirmationEmail(loggedInProfile?.email || ''))
            .then((res) => {
                if (fetchSendConfirmationEmail.fulfilled.match(res)) {
                    // Handle success
                    console.log('Confirmation email sent:', res.payload);
                } else {
                    // Handle failure
                    console.error('Failed to send confirmation email:', res.payload);
                }
            })
            .catch((error) => {
                console.error('Error dispatching thunk:', error);
            });
    }

    const isFeaturesAvailable = () => {
        return isAuth && isEmailVerified;
    }

    const getInfoText = () => {
        if (!isAuth) {
            return 'Sign In To Start New Tournament';
        }
        if (isAuth && !isEmailVerified) {
            return 'Verify Email To Start New Tournament';
        }
        return 'Add New Tournament';
    }

    const refreshTournamentList = () => {
        dispatch(getTournamentList());
    };

    if (isTournamentLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Toaster />
            <NavBar />
            <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                <Grid container spacing={2} flexDirection={{ md: 'row', xs: 'column' }}>
                    {isAuth && !isEmailVerified && (
                        <Grid item xs={12} md={9}>
                            <Alert severity="warning" action={
                                <Button color="inherit" size="small" onClick={reSendConfirmationEmail}>
                                    Resend Email
                                </Button>
                            }>
                                Your email is not verified. Please verify your email to use all features.
                            </Alert>
                        </Grid>
                    )}
                    <Grid item xs={12} md={9}>
                        {!isMobile && (
                            <ModalAddNewTournament
                                isActive={isFeaturesAvailable()}
                                infoText={getInfoText()}
                                onTournamentAdded={refreshTournamentList}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} md={9} sx={{ mt: -2 }}>
                        {tournamentList.map((tournament) => (
                            <Tournament
                                key={tournament.id}
                                tournament={tournament}
                                tournamentPlayers={tournamentPlayers[tournament.id] || []}
                            />
                        ))}
                    </Grid>
                </Grid>
            </Container>
            {isMobile && (
                <ModalAddNewTournament
                    isActive={isFeaturesAvailable()}
                    customButton={
                        <Fab color="primary"
                            aria-label="add"
                            disabled={!isFeaturesAvailable()}
                            style={{ position: 'fixed', bottom: 16, right: 16 }}>
                            <AddIcon />
                        </Fab>
                    }
                />
            )}
        </>
    );
}
