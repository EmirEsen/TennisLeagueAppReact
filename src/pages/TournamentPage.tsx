import { Alert, Box, Button, CircularProgress, Container, Fab, Grid, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "../components/organisms/NavBar";
import { AppDispatch, useAppSelector } from "../store";
import { useDispatch } from "react-redux";
import { fetchPlayerProfile, getPlayerProfileList } from "../store/feature/playerSlice";
import { getTournamentMatchList } from "../store/feature/matchSlice";
import ModalAddNewMatch from "../components/molecules/Match/ModalAddNewMatch";
import MatchInfo from "../components/atoms/MatchInfo";
import AddIcon from '@mui/icons-material/Add';
import { fetchSendConfirmationEmail } from "../store/feature/authSlice";
import RankList from "../components/molecules/RankList";
import { getPlayersOfTournament } from "../store/feature/tournamentPlayerSlice";
import { IPlayerProfile } from "../models/IPlayerProfile";
import { IGetMatch } from "../models/get/IGetMatch";


const TournamentPage: React.FC = () => {

    const { loggedInProfile } = useAppSelector(state => state.player)
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const { tournamentId } = useParams<{ tournamentId: string }>(); // Get the id from the URL
    console.log(tournamentId)

    const [tournamentMatchList, setTournamentMatchList] = useState<IGetMatch[]>([]); // Local state for tournament matches
    const [tournamentPlayerList, setTournamentPlayerList] = useState<IPlayerProfile[]>([]);

    const [isTournamentLoading, setIsTournamentLoading] = useState<boolean>(true);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        dispatch(getPlayerProfileList());
        const fetchTournamentPlayers = async () => {
            try {
                if (tournamentId) {
                    setLoading(true);
                    setError(null);
                    const players = await dispatch(getPlayersOfTournament(tournamentId)).unwrap();
                    setTournamentPlayerList(players); // Update local state with fetched players
                }
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchTournamentPlayers();
    }, [tournamentId, dispatch]);

    // Fetch tournament matches
    useEffect(() => {
        const fetchTournamentMatches = async () => {
            try {
                if (tournamentId) {
                    setIsTournamentLoading(true);
                    const matches = await dispatch(getTournamentMatchList({ tournamentId })).unwrap();
                    setTournamentMatchList(matches); // Update local state with fetched matches
                }
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setIsTournamentLoading(false);
            }
        };

        fetchTournamentMatches();
    }, [tournamentId, dispatch]);
    const getInfoText = () => {
        if (!isAuth) {
            return 'Sign In To Start New Match';
        }
        if (isAuth && !isEmailVerified) {
            return 'Verify Email To Add New Match';
        }
        return 'Add New Match';
    }

    useEffect(() => {
        dispatch(getPlayerProfileList())
        if (tournamentId) {
            dispatch(getTournamentMatchList({ tournamentId }));
        } else {
            console.error("Tournament ID is undefined");
        }
        if (isAuth) {
            dispatch(fetchPlayerProfile())
        }
    }, [isAuth]);

    const sortedMatchList = useMemo(() => {
        return [...tournamentMatchList].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [tournamentMatchList]);

    useEffect(() => {
        dispatch(getPlayerProfileList());
    }, [dispatch, tournamentMatchList]);

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
                        {isTournamentLoading ? (
                            <Container maxWidth="lg" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Container>
                        ) : (
                            <>
                                {!isMobile ? (
                                    <ModalAddNewMatch
                                        isActive={isFeaturesAvailable()}
                                        infoText={getInfoText()}
                                        tournamentId={tournamentId}
                                        tournamentPlayerList={tournamentPlayerList}
                                    />
                                ) : <></>}
                                <RankList players={tournamentPlayerList} />
                            </>
                        )}
                    </Grid>
                    <Grid item xs={9} md={3} style={{ margin: 'auto' }} >
                        {isTournamentLoading ? (
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
                    tournamentId={tournamentId}
                    tournamentPlayerList={tournamentPlayerList}
                />
            )}
        </>

    );
};

export default TournamentPage;
