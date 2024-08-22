
import { CircularProgress, Container, Grid, LinearProgress } from '@mui/material'
import NavBar from '../components/organisms/NavBar'
import RankList from '../components/molecules/RankList'
import MatchInfo from '../components/atoms/MatchInfo'
import { AppDispatch, useAppSelector } from '../store';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchPlayerProfile, getPlayerProfileList } from '../store/feature/playerSlice';
import { getMatchList } from '../store/feature/matchSlice';
import PlayerCard from '../components/molecules/PlayerCard';
import ModalAddNewMatch from '../components/molecules/ModalAddNewMatch';
import { Toaster } from 'react-hot-toast';

export default function Home() {

    const { playerList, isLoading: isPlayersLoading } = useAppSelector(state => state.player)
    const { matchList, isLoading: isMatchesLoading } = useAppSelector(state => state.match)
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getPlayerProfileList())
        dispatch(getMatchList())
        if (isAuth) {
            dispatch(fetchPlayerProfile());
        }
    }, [isAuth]);

    const sortedMatchList = [...matchList].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    useEffect(() => {
        dispatch(getPlayerProfileList());
    }, [dispatch, matchList]);


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
                    <Grid item xs={12} md={9}>
                        {isPlayersLoading ? (
                            <Container maxWidth="lg" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Container>
                        ) : (
                            <>
                                {isAuth ? <ModalAddNewMatch isActive={true} infoText='Add New Match' /> : <ModalAddNewMatch isActive={false} infoText='Sign In Required to Adding Match Record' />}
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

        </>
    )
}


