import { Box, Divider, Grid, Paper, Typography } from '@mui/material'
import { IGetMatch } from '../../models/get/IGetMatch'
import { ArrowDropDown, ArrowDropUp, ArrowRight } from '@mui/icons-material';
import { IGetTournamentPlayer } from '../../models/get/IGetTournamentPlayer';

function excludeSeconds(timeString: string): string {
    const parts = timeString.split(':');

    if (parts.length >= 3) {
        return `${parts[0]}:${parts[1]}`;
    }

    return timeString;
}

function formatMatchDate(start: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedStart = new Date(start).toLocaleDateString('en-GB', options);
    return `${formattedStart}`;
}

function getRatingChangeDisplay(ratingChange: number) {
    if (ratingChange > 0) {
        return (
            <Typography variant="body2" color="green" sx={{ display: 'flex', alignItems: 'center', marginRight: 0.7 }}>
                <ArrowDropUp fontSize="small" />
                {ratingChange}
            </Typography>
        );
    } else if (ratingChange < 0) {
        return (
            <Typography variant="body2" color="red" sx={{ display: 'flex', alignItems: 'center', marginRight: 0.7 }}>
                <ArrowDropDown fontSize="small" />
                {Math.abs(ratingChange)}
            </Typography>
        );
    } else {
        return (
            <Typography variant="body2" color="grey" sx={{ display: 'flex', alignItems: 'center', marginRight: 0.7 }}>
                <ArrowRight fontSize="small" />
                {Math.abs(ratingChange)}
            </Typography>
        );
    }
}

function MatchInfo({ match, tournamentPlayerList }: { match: IGetMatch; tournamentPlayerList?: IGetTournamentPlayer[] }) {
    const { court, date, time, score, player1Id, player2Id, winnerId } = match;

    const player1 = tournamentPlayerList?.find((player) => player.playerId === player1Id);
    const player2 = tournamentPlayerList?.find((player) => player.playerId === player2Id);

    if (!player1 || !player2) {
        return <div>mathes not found</div>;
    }

    const isDraw = winnerId === 'draw';
    const winner = isDraw ? null : winnerId === player1.playerId ? player1 : player2;

    return (
        <Paper elevation={2} sx={{ padding: 2, mb: 2, borderRadius: '16px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">{court}</Typography>
                <Typography variant="body2" color="text.secondary" align="right">
                    {formatMatchDate(date)} | {time ? excludeSeconds(time) : ''}
                </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    {getRatingChangeDisplay(match.player1RatingChange)}
                    <Typography variant="body1" fontWeight="bold" color="primary" sx={{ flexGrow: 1 }}>
                        {player1.firstname[0]}. {player1.lastname}
                        {!isDraw && winner === player1 && <span style={{ color: 'green' }}> ✔</span>}
                    </Typography>
                    <Typography variant="body1" sx={{ marginRight: 2 }}>
                        {score && Array.isArray(score) ? score.map(s => s.player1Score).join(' ') : 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    {getRatingChangeDisplay(match.player2RatingChange)}
                    <Typography variant="body1" fontWeight="bold" color="primary" sx={{ flexGrow: 1 }}>
                        {player2.firstname[0]}. {player2.lastname}
                        {!isDraw && winner === player2 && <span style={{ color: 'green' }}> ✔</span>}
                    </Typography>
                    <Typography variant="body1" sx={{ marginRight: 2 }}>
                        {score && Array.isArray(score) ? score.map(s => s.player2Score).join(' ') : 'N/A'}
                    </Typography>
                </Grid>
            </Grid>
            <Divider sx={{ marginY: 1 }} />
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                {isDraw ? 'The match ended in a draw.' : `Game Set and Match ${winner?.firstname} ${winner?.lastname}.`}<br />
                {!isDraw ? `${winner?.firstname[0]}. ${winner?.lastname} wins the match ` : ''}
                {isDraw ? '' : winnerId === player1Id ? score.map((score) => score.player1Score).join('-') : score.map((score) => score.player2Score).join('-')}
            </Typography>
        </Paper>

    )
}

export default MatchInfo

