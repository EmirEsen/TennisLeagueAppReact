import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getMatchListByPlayerAndTournament } from "../store/feature/matchSlice";
import MatchInfo from "../components/atoms/MatchInfo";
import { IGetMatch } from "../models/get/IGetMatch";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import NavBar from "../components/organisms/NavBar";
import { Box, CircularProgress, Container, Grid, Pagination, Stack } from "@mui/material";

function PlayerView() {
    const [searchParams] = useSearchParams();
    const playerId = searchParams.get('playerId');
    const tournamentId = searchParams.get('tournamentId');
    const [matchList, setMatchList] = useState<IGetMatch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10; // Example page size

    const dispatch = useDispatch<AppDispatch>();

    // Function to get matches from local storage
    const getCachedMatches = () => {
        const cacheKey = `${tournamentId}-${playerId}`;
        const cachedMatches = localStorage.getItem(cacheKey);
        return cachedMatches ? JSON.parse(cachedMatches) : null;
    };

    // Function to store matches in local storage
    const storeMatchesInLocalStorage = (matches: IGetMatch[]) => {
        const cacheKey = `${tournamentId}-${playerId}`;
        localStorage.setItem(cacheKey, JSON.stringify(matches));
    };

    useEffect(() => {
        const fetchMatches = async () => {
            if (playerId && tournamentId) {
                const cachedMatches = getCachedMatches();

                if (cachedMatches) {
                    // Load matches from local storage if available
                    setMatchList(cachedMatches);
                    setLoading(false);
                } else {
                    // Fetch matches from API if not in local storage
                    try {
                        setLoading(true);
                        console.log('player view', tournamentId)
                        console.log('player view', playerId)
                        const data = await dispatch(getMatchListByPlayerAndTournament({ tournamentId, playerId, page: currentPage, size: pageSize })).unwrap();
                        setMatchList(data);
                        storeMatchesInLocalStorage(data); // Store fetched data in local storage
                    } catch (err) {
                        if (err instanceof Error) {
                            setError(err.message);
                        } else {
                            setError('An unknown error occurred');
                        }
                    } finally {
                        setLoading(false);
                    }
                }
            }
        };

        fetchMatches();
    }, [playerId, tournamentId, currentPage, dispatch]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const totalPages = Math.ceil(matchList.length / pageSize);
    const paginationCount = totalPages > 0 ? totalPages : 1;

    return (
        <>
            <NavBar />
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
                            <Grid item key={match.id} sx={{ minWidth: '400px' }}>
                                <MatchInfo match={match} />
                            </Grid>
                        ))
                    ) : (
                        <div>No matches found</div>
                    )}
                </Grid>

                <Box sx={{ marginTop: 'auto', marginBottom: '20px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Stack spacing={2}>
                        <Pagination
                            count={paginationCount}
                            shape="rounded"
                            page={currentPage}
                            onChange={handlePageChange}
                        />
                    </Stack>
                </Box>
            </Container>
        </>
    );
}

export default PlayerView;
