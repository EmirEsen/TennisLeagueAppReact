import { Alert, Box, Button, CircularProgress, Container, Fab, Grid, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "../components/organisms/NavBar";
import { AppDispatch, useAppSelector } from "../store";
import { useDispatch } from "react-redux";
import { fetchPlayerProfile, getPlayerProfileList } from "../store/feature/playerSlice";
import { getMatchList } from "../store/feature/matchSlice";
import ModalAddNewMatch from "../components/molecules/Match/ModalAddNewMatch";
import MatchInfo from "../components/atoms/MatchInfo";
import AddIcon from '@mui/icons-material/Add';
import { fetchSendConfirmationEmail } from "../store/feature/authSlice";
import RankList from "../components/molecules/RankList";
import config from "../store/feature/config";
import { IPlayerProfile } from "../models/IPlayerProfile";


const TournamentPage: React.FC = () => {

    const { playerList, isLoading: isPlayersLoading } = useAppSelector(state => state.player)
    const { matchList, isLoading: isMatchesLoading } = useAppSelector(state => state.match)
    const { loggedInProfile } = useAppSelector(state => state.player)
    const [tournamentPlayers, setTournamentPlayers] = useState<IPlayerProfile[]>([]);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const getInfoText = () => {
        if (!isAuth) {
            return 'Sign In To Start New Match';
        }
        if (isAuth && !isEmailVerified) {
            return 'Verify Email To Add New Match';
        }
        return 'Start New Tournament';
    }

    useEffect(() => {
        dispatch(getPlayerProfileList())
        dispatch(getMatchList())
        if (isAuth) {
            dispatch(fetchPlayerProfile())
        }
    }, [isAuth]);

    const sortedMatchList = useMemo(() => {
        return [...matchList].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [matchList]);

    useEffect(() => {
        dispatch(getPlayerProfileList());
    }, [dispatch, matchList]);

    useEffect(() => {
        if (loggedInProfile) {
            setIsEmailVerified(loggedInProfile.isEmailVerified);
        }
    }, [loggedInProfile]);


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
                // Handle any unexpected errors
                console.error('Error dispatching thunk:', error);
            });
    }

    const { id } = useParams<{ id: string }>(); // Get the id from the URL
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTournament = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(`${config.BASE_URL}/api/v1/tournament-player/${id}/players`);
                const data: IPlayerProfile[] = await response.json();
                setTournamentPlayers(data);

            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };
        if (id) {
            fetchTournament();
        }
    }, [id]);


    const isFeaturesAvailable = () => {
        return isAuth && isEmailVerified;
    }

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">Error: {error}</Typography>
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
                        {isPlayersLoading ? (
                            <Container maxWidth="lg" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Container>
                        ) : (
                            <>
                                {!isMobile ? (
                                    <ModalAddNewMatch
                                        isActive={isFeaturesAvailable()}
                                        infoText={getInfoText()}
                                    />
                                ) : <></>}
                                <RankList players={tournamentPlayers} />
                            </>
                        )}
                    </Grid>
                    <Grid item xs={9} md={3} style={{ margin: 'auto' }} >
                        {isMatchesLoading ? (
                            <div>Loading...</div>
                        ) : (
                            sortedMatchList.map((match, index) => (
                                <MatchInfo key={index} match={match} />
                            ))
                        )}
                    </Grid>
                </Grid>
            </Container>

            {isMobile && (
                <ModalAddNewMatch
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
};

export default TournamentPage;
