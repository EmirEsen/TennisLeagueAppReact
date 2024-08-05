import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Box, Paper, Typography, Divider, Grid } from '@mui/material';

interface Player {
    firstname: string;
    lastname: string;
    sets: string[];
    totalPoints: number;
}

interface Match {
    date: string;
    time?: string;
    player1: Player;
    player2: Player;
}

function MatchInfo({ match }: { match: Match }) {
    return (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">Round of 32 - Grandstand</Typography>
                <Typography variant="body2" color="text.secondary">
                    {match.date} | {match.time}
                </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight="bold" color="primary" sx={{ flexGrow: 1 }}>
                        {match.player1.firstname[0]}.{match.player1.lastname}
                    </Typography>
                    <Typography variant="body1" sx={{ marginRight: 2 }}>
                        {match.player1.sets.join(' ')}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight="bold" color="primary" sx={{ flexGrow: 1 }}>
                        {match.player2.firstname[0]}.{match.player2.lastname} <span style={{ color: 'green' }}>✔</span>
                    </Typography>
                    <Typography variant="body1" sx={{ marginRight: 2 }}>
                        {match.player2.sets.join(' ')}
                    </Typography>
                </Grid>
            </Grid>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                Game Set and Match {match.player2.firstname} {match.player2.lastname}. {match.player2.firstname} {match.player2.lastname} wins the match {match.player2.sets.join('-')}.
            </Typography>
        </Paper>
    );
}

function MatchList({ matches }: { matches: Match[] }) {
    const [hasMore, setHasMore] = useState(true);
    const [items, setItems] = useState<Match[]>(matches);

    // Simulate fetching more items
    const fetchMoreData = () => {
        if (items.length >= matches.length) {
            setHasMore(false);
            return;
        }
        setItems(items.concat(matches.slice(items.length, items.length + 10)));
    };

    return (
        <InfiniteScroll
            dataLength={items.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>}
            endMessage={<p>No more matches</p>}
        >
            {items.map((match, index) => (
                <MatchInfo key={index} match={match} />
            ))}
        </InfiniteScroll>
    );
}

export default MatchList;
