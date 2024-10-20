import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getPlayerMatchList } from "../store/feature/matchSlice";
import MatchInfo from "../components/atoms/MatchInfo";
import { IGetMatch } from "../models/get/IGetMatch";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import NavBar from "../components/organisms/NavBar";
import { Box, Container, Grid, Pagination, Stack } from "@mui/material";


function PlayerView() {
    const [searchParams] = useSearchParams();
    const playerId = searchParams.get('playerId');
    const [matchList, setMatchList] = useState<IGetMatch[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10; // Example page size

    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const fetchMatches = async () => {
            if (playerId) {
                try {
                    setLoading(true);
                    const data = await dispatch(getPlayerMatchList({ playerId, page: currentPage, size: pageSize })).unwrap();
                    setMatchList(data);
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
        };

        fetchMatches();
    }, [playerId, currentPage, dispatch]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setCurrentPage(value);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                            count={Math.ceil(matchList.length / pageSize)}
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

export default PlayerView
