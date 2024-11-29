import { Alert, Box, Button, Container, Fab, Grid, Skeleton, Typography, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
import { ITournament } from "../models/ITournament";
import { getTournamentById } from "../store/feature/tournamentSlice";
import { MatchStatus } from "../models/enums/MatchStatus";
import ApproveMatchButton from "../components/atoms/buttons/ApproveMatchButton";
import RejectMatchButton from "../components/atoms/buttons/RejectMatchButton";
import { useMatchActions } from "../components/atoms/actions/useMatchActions";

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

    const [tournament, setTournament] = useState<ITournament | null>(null);
    const tournamentMatchList = useAppSelector(state => state.match.matchList);
    const tournamentPlayerList = useAppSelector(state => state.tournamentPlayer.tournamentPlayerList);

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

                    await dispatch(getPlayersOfTournament(tournamentId)).unwrap();
                    
                    setLoadingMatches(true)
                    await dispatch(getTournamentMatchList({ tournamentId })).unwrap();
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
            return 'Sign In To Add New Match';
        }
        if (isAuth && !isEmailVerified) {
            return 'Verify Email To Add New Match';
        }
        return 'Add New Match';
    }

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
        dispatch(getTournamentMatchList({ tournamentId }));
        dispatch(getPlayersOfTournament(tournamentId));
    };

    const { handleApproveMatch, handleRejectMatch } = useMatchActions(refreshRankListAndMatchList);

    const isFeaturesAvailable = () => {
        return isAuth && isEmailVerified;
    }

    const isReviewer = (match: IGetMatch) => {
        if (!isAuth || match.status !== MatchStatus.PENDING || !loggedInProfile?.id) {
            return false;
        }

        // Since player2 is always the opponent/reviewer, they should be the only one able to review
        return loggedInProfile.id === match.player2Id;
    };


    const isPlayerInTournament = tournamentPlayerList.some(player => player.playerId === loggedInProfile?.id);


    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography color="error">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <>
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
                            <Box >
                                <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: '16px' }} />
                            </Box>
                        ) : (
                            <>
                                {!isMobile && isPlayerInTournament && (
                                    <ModalAddNewMatch
                                        isActive={isFeaturesAvailable()}
                                        infoText={getInfoText()}
                                        tournamentId={tournamentId}
                                        tournamentPlayerList={tournamentPlayerList}
                                        onMatchAdded={refreshRankListAndMatchList}
                                    />
                                )}
                                {tournament &&
                                    <RankList players={tournamentPlayerList}
                                        tournamentId={tournamentId}
                                        tournament={tournament} />}
                            </>
                        )}
                    </Grid>
                    <Grid item xs={9} md={3} style={{ margin: 'auto' }} >
                        {loadingMatches ? (
                            (new Array(3)).fill(null).map((_, index) => (
                                <Box key={index} marginBottom={2}>
                                    <Skeleton variant="rectangular" width="100%" height={198} sx={{ borderRadius: '16px' }} />
                                </Box>
                            ))
                        ) : (
                            <Box sx={{ mt: !isMobile && isPlayerInTournament ? 6 : 0 }}>
                                {tournamentMatchList.map((match, index) => (
                                    <MatchInfo key={index}
                                        match={match}
                                        tournamentPlayerList={tournamentPlayerList}
                                        actionButtons={
                                            isReviewer(match) && (
                                                <>
                                                    <RejectMatchButton
                                                        onReject={() => handleRejectMatch(match.id, match.tournamentId)}
                                                    />
                                                    <ApproveMatchButton
                                                        onApprove={() => handleApproveMatch(match.id, match.tournamentId)}
                                                    />
                                                </>
                                            )
                                        } />
                                ))}
                            </Box>
                        )}
                    </Grid>
                </Grid>
            </Container>

            {isMobile && isPlayerInTournament && (
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
