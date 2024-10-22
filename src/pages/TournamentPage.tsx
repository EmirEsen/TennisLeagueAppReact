import { Alert, Box, Button, CircularProgress, Container, Fab, Grid, LinearProgress, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import NavBar from "../components/organisms/NavBar";
import { AppDispatch, useAppSelector } from "../store";
import { useDispatch } from "react-redux";
import { getTournamentMatchList } from "../store/feature/matchSlice";
import ModalAddNewMatch from "../components/molecules/Match/ModalAddNewMatch";
import MatchInfo from "../components/atoms/MatchInfo";
import AddIcon from '@mui/icons-material/Add';
import { fetchSendConfirmationEmail } from "../store/feature/authSlice";
import RankList from "../components/molecules/RankList";
import { getPlayersOfTournament } from "../store/feature/tournamentPlayerSlice";
import { IGetMatch } from "../models/get/IGetMatch";
import { IGetTournamentPlayer } from "../models/get/IGetTournamentPlayer";
import { ITournament } from "../models/ITournament";
import { getTournamentById } from "../store/feature/tournamentSlice";


const TournamentPage: React.FC = () => {

    const { loggedInProfile } = useAppSelector(state => state.player);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const isAuth = useAppSelector(state => state.auth.isAuth);
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery('(max-width: 600px)');

    const { tournamentId } = useParams<{ tournamentId: string | undefined }>();

    if (!tournamentId) {
        return <div>Error: Tournament ID is not defined.</div>;
    }

    const [tournamentMatchList, setTournamentMatchList] = useState<IGetMatch[]>([]);
    const [tournamentPlayerList, setTournamentPlayerList] = useState<IGetTournamentPlayer[]>([]);
    const [tournament, setTournament] = useState<ITournament | null>(null);

    const [loadingPlayers, setLoadingPlayers] = useState<boolean>(true);
    const [loadingMatches, setLoadingMatches] = useState<boolean>(true);

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTournamentData = async () => {
            try {
                if (tournamentId) {
                    setLoadingPlayers(true);
                    setError(null);

                    const tournament = await dispatch(getTournamentById(tournamentId)).unwrap();
                    setTournament(tournament)

                    const players = await dispatch(getPlayersOfTournament(tournamentId)).unwrap();
                    setTournamentPlayerList(players);

                    setLoadingMatches(true)
                    const matches = await dispatch(getTournamentMatchList({ tournamentId })).unwrap();
                    console.log(matches)
                    setTournamentMatchList(matches);
                }
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoadingPlayers(false)
                setLoadingMatches(false)
            }
        };

        fetchTournamentData();
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

    const sortedMatchList = useMemo(() => {
        return [...tournamentMatchList].sort((a, b) => {
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [tournamentMatchList]);

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

    const refreshRankListAndMatchList = () => {
        dispatch(getTournamentMatchList({ tournamentId }))
            .then((action) => {
                if (getTournamentMatchList.fulfilled.match(action)) {
                    // Set the match list from the action's payload
                    setTournamentMatchList(action.payload);
                } else {
                    // Handle the case where the action is not fulfilled
                    console.error('Failed to fetch match list:', action.payload);
                }
            });

        dispatch(getPlayersOfTournament(tournamentId))
            .then((action) => {
                if (getPlayersOfTournament.fulfilled.match(action)) {
                    // Set the player list from the action's payload
                    setTournamentPlayerList(action.payload);
                } else {
                    // Handle the case where the action is not fulfilled
                    console.error('Failed to fetch player list:', action.payload);
                }
            });
    };

    const isFeaturesAvailable = () => {
        return isAuth && isEmailVerified;
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
                        {loadingPlayers ? (
                            <Container maxWidth="lg" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <LinearProgress />
                            </Container>
                        ) : (
                            <>
                                {!isMobile ? (
                                    <ModalAddNewMatch
                                        isActive={isFeaturesAvailable()}
                                        infoText={getInfoText()}
                                        tournamentId={tournamentId}
                                        tournamentPlayerList={tournamentPlayerList}
                                        onMatchAdded={refreshRankListAndMatchList}
                                    />
                                ) : <></>}
                                {tournament &&
                                    <RankList players={tournamentPlayerList}
                                        tournamentId={tournamentId}
                                        tournament={tournament} />}

                            </>
                        )}
                    </Grid>
                    <Grid item xs={9} md={3} style={{ margin: 'auto' }} >
                        {loadingMatches ? (
                            <CircularProgress />
                        ) : (
                            sortedMatchList.map((match, index) => (
                                <MatchInfo key={index} match={match} tournamentPlayerList={tournamentPlayerList} />
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
                    onMatchAdded={refreshRankListAndMatchList}
                />
            )}
        </>

    );
};

export default TournamentPage;
