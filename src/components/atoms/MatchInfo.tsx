import { Box, Divider, Grid, Paper, Typography } from '@mui/material'
import { IGetMatch } from '../../models/IGetMatch'
import { useAppSelector } from '../../store'

function excludeSeconds(timeString: string): string {
    const parts = timeString.split(':');

    if (parts.length >= 3) {
        return `${parts[0]}:${parts[1]}`;
    }

    return timeString;
}

function MatchInfo({ match }: { match: IGetMatch }) {
    const { court, date, time, score, player1Id, player2Id, winnerId } = match;
    const players = useAppSelector((state) => state.player.playerList);
    const player1 = players.find((player) => player.id === player1Id);
    const player2 = players.find((player) => player.id === player2Id);

    if (!player1 || !player2) {
        return <div>mathes not found</div>;
    }

    const winner = winnerId === player1.id ? player1 : player2;

    return (
        <Paper elevation={2} sx={{ padding: 2, mb: 2, borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">{court}</Typography>
                <Typography variant="body2" color="text.secondary" align="right">
                    {date} | {time ? excludeSeconds(time) : ''}
                </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight="bold" color="primary" sx={{ flexGrow: 1 }}>
                        {player1.firstname[0]}. {player1.lastname}
                        {winner === player1 && <span style={{ color: 'green' }}> ✔</span>}
                    </Typography>
                    <Typography variant="body1" sx={{ marginRight: 2 }}>
                        {score && Array.isArray(score) ? score.map(s => s.player1Score).join(' ') : 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" fontWeight="bold" color="primary" sx={{ flexGrow: 1 }}>
                        {player2.firstname[0]}. {player2.lastname}
                        {winner === player2 && <span style={{ color: 'green' }}> ✔</span>}
                    </Typography>
                    <Typography variant="body1" sx={{ marginRight: 2 }}>
                        {score && Array.isArray(score) ? score.map(s => s.player2Score).join(' ') : 'N/A'}
                    </Typography>
                </Grid>
            </Grid>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                Game Set and Match {winner.firstname} {winner.lastname}.<br /> {winner.firstname[0]}. {winner.lastname} wins the match {' '}
                {winnerId === player1Id ? score.map((score) => score.player1Score).join('-') : score.map((score) => score.player2Score).join('-')}.
            </Typography>
        </Paper>


    )
}

export default MatchInfo

