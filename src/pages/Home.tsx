
import { CircularProgress, Container, Grid } from '@mui/material'
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

export default function Home() {

    const { playerList, isLoading: isPlayersLoading } = useAppSelector(state => state.player)
    const { matchList, isLoading: isMatchesLoading } = useAppSelector(state => state.match)
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getPlayerProfileList())
        dispatch(getMatchList())
        dispatch(fetchPlayerProfile())
    }, [isAuth]);

    useEffect(() => {
        dispatch(getPlayerProfileList());
    }, [dispatch, matchList]);


    if (isPlayersLoading || isMatchesLoading) {
        return (
            <Container maxWidth="lg" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <>
            <NavBar />

            <Container maxWidth="lg" style={{ marginTop: '20px' }}>
                <Grid container spacing={2}>
                    <Grid item xs={9}>
                        {isPlayersLoading ? (
                            <Container maxWidth="lg" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                                <CircularProgress />
                            </Container>
                        ) : (
                            <>
                                {isAuth ? <ModalAddNewMatch /> : <></>}
                                <RankList players={playerList} />
                            </>
                        )}

                    </Grid>
                    <Grid item xs={3} >
                        {isMatchesLoading ? (
                            <div>Loading...</div>
                        ) : (
                            matchList.map((match, index) => (
                                <MatchInfo key={index} match={match} />
                            ))
                        )}
                        {playerList.length > 2 && (
                            <PlayerCard player={playerList[2]} />
                        )}
                    </Grid>
                </Grid>
            </Container>



        </>
    )
}


