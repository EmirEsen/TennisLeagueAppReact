
import { Alert, Button, CircularProgress, Container, Fab, Grid, LinearProgress, useMediaQuery } from '@mui/material'
import NavBar from '../components/organisms/NavBar'
import RankList from '../components/molecules/RankList'
import MatchInfo from '../components/atoms/MatchInfo'
import { AppDispatch, useAppSelector } from '../store';
import { useDispatch } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import { fetchPlayerProfile, getPlayerProfileList } from '../store/feature/playerSlice';
import { getMatchList } from '../store/feature/matchSlice';
import PlayerCard from '../components/molecules/PlayerCard';
import ModalAddNewMatch from '../components/molecules/ModalAddNewMatch';
import { Toaster } from 'react-hot-toast';
import { fetchSendConfirmationEmail } from '../store/feature/authSlice';
import AddIcon from '@mui/icons-material/Add';

export default function Home() {

    const { playerList, isLoading: isPlayersLoading } = useAppSelector(state => state.player)
    const { matchList, isLoading: isMatchesLoading } = useAppSelector(state => state.match)
    const { loggedInProfile } = useAppSelector(state => state.player)
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const dispatch = useDispatch<AppDispatch>();
    const isMobile = useMediaQuery('(max-width: 600px)');


    useEffect(() => {
        dispatch(getPlayerProfileList())
        dispatch(getMatchList())
        if (isAuth) {
            dispatch(fetchPlayerProfile())
        }
    }, [isAuth]);

    // const sortedMatchList = [...matchList].sort((a, b) => {
    //     return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    // });

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



    const isFeaturesAvailable = () => {
        return isAuth && isEmailVerified;
    }

    if (isPlayersLoading || isMatchesLoading) {
        return (
            <Container maxWidth="lg" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <LinearProgress />
            </Container>
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
                                        infoText={isFeaturesAvailable() ? 'Add New Match' : 'Sign in to add new match'}
                                    />
                                ) : <></>}
                                <RankList players={playerList} />
                            </>
                        )}
                        {playerList.length > 2 && (
                            <PlayerCard player={playerList[0]} />
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
    )
}


