import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { getMatchListByPlayerAndTournament } from "../store/feature/matchSlice";
import MatchInfo from "../components/atoms/MatchInfo";
import { IGetMatch } from "../models/get/IGetMatch";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../store";
import { Box, CircularProgress, Container, Grid, Pagination, Stack, Alert } from "@mui/material";
import { IPageDto } from "../models/IPageDto";
import { getPlayersOfTournament } from "../store/feature/tournamentPlayerSlice";

function PlayerView() {
    const [searchParams] = useSearchParams();
    const playerId = searchParams.get('playerId');
    const tournamentId = searchParams.get('tournamentId');

    const [matchList, setMatchList] = useState<IGetMatch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalMatches, setTotalMatches] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(0);

    const dispatch = useDispatch<AppDispatch>();

    // Fetch players of the tournament from Redux store
    const tournamentPlayerList = useSelector((state: any) => state.tournamentPlayer.tournamentPlayerList);
    const pageSize = 6;

    const fetchMatches = useCallback(async () => {
        if (!playerId || !tournamentId) return;

        try {
            setLoading(true);
            // Fetch match list
            const data: IPageDto<IGetMatch> = await dispatch(getMatchListByPlayerAndTournament({
                tournamentId, playerId, page: currentPage, size: pageSize
            })).unwrap();

            setMatchList(data.content);
            setTotalMatches(data.totalElements);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setLoading(false);
        }
    }, [dispatch, playerId, tournamentId, currentPage]);

    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]); // Trigger on mount and whenever dependencies change

    useEffect(() => {
        if (tournamentId) {
            dispatch(getPlayersOfTournament(tournamentId)); // Fetch players when tournamentId changes
        }
    }, [dispatch, tournamentId]);

    const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value - 1); // Update page state
    };

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
                <Alert severity="error">Error: {error}</Alert>
            </Box>
        );
    }

    const totalPages = Math.ceil(totalMatches / pageSize);
    const paginationCount = totalPages > 0 ? totalPages : 1;

    return (
        <>
            <Container style={{ marginTop: '40px', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <Grid
                    container
                    direction="column"
                    spacing={1}
                    sx={{
                        justifyContent: "flex-start",
                        alignItems: "center",
                        flexGrow: 1
                    }}>
                    {matchList.length > 0 ? (
                        matchList.map((match) => (
                            <Grid item key={match.id}>
                                <MatchInfo match={match} tournamentPlayerList={tournamentPlayerList} />
                            </Grid>
                        ))
                    ) : (
                        <Box>No Match Found</Box>
                    )}
                </Grid>

                <Box sx={{ marginTop: 'auto', marginBottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Stack spacing={2}>
                        <Pagination
                            count={paginationCount}
                            shape="rounded"
                            page={currentPage + 1}
                            onChange={handlePageChange}
                        />
                    </Stack>
                </Box>
            </Container>
        </>
    );
}

export default PlayerView;
