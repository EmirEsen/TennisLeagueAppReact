import { Box, Divider, Grid, Paper, Typography, Theme, alpha } from '@mui/material'
import { IGetMatch } from '../../models/get/IGetMatch'
import { AccessTime, ArrowDropDown, ArrowDropUp, ArrowRight } from '@mui/icons-material';
import { IGetTournamentPlayer } from '../../models/get/IGetTournamentPlayer';
import { MatchStatus } from '../../models/enums/MatchStatus';
import { useEffect, useState } from 'react';
import { useMatchActions } from './actions/useMatchActions';

function excludeSeconds(timeString: string): string {
    const parts = timeString.split(':');

    if (parts.length >= 3) {
        return `${parts[0]}:${parts[1]}`;
    }

    return timeString;
}

const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return "0:00";
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

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

function MatchInfo({ match, tournamentPlayerList, actionButtons }: { match: IGetMatch; tournamentPlayerList?: IGetTournamentPlayer[]; actionButtons?: React.ReactNode; }) {
    const { handleAutoRejectMatch } = useMatchActions();
    const { status, court, date, time, score, player1Id, player2Id, winnerId } = match;
    const [timeRemaining, setTimeRemaining] = useState<string>("");

    const player1 = tournamentPlayerList?.find((player) => player.playerId === player1Id);
    const player2 = tournamentPlayerList?.find((player) => player.playerId === player2Id);

    useEffect(() => {
        if (match.status === MatchStatus.PENDING && match.createdAt) {
            // Calculate end time (15 minutes from creation)
            const endTime = new Date(new Date(match.createdAt).getTime() + 15 * 60000);
            
            const timer = setInterval(() => {
                const remaining = formatTimeRemaining(endTime);
                setTimeRemaining(remaining);
                
                // If time is up, you might want to trigger the auto-approval
                if (remaining === "0:00") {
                    clearInterval(timer);
                    handleAutoRejectMatch(match.id, match.tournamentId);
                }
            }, 1000);
            
            return () => clearInterval(timer);
        }
    }, [match]);

    if (!player1 || !player2) {
        return <div>Players not found</div>;
    }

    const isDraw = winnerId === 'draw';
    const winner = isDraw ? null : winnerId === player1.playerId ? player1 : player2;

    const getPaperStyles = () => {
        if (status === MatchStatus.PENDING) {
            return {
                padding: 2,
                mb: 2,
                borderRadius: '16px',
                opacity: 0.6,
                backgroundColor: (theme: Theme) => alpha(theme.palette.grey[200], 0.5),
                border: (theme: Theme) => `1px solid ${theme.palette.warning.main}`
            };
        }
        return { padding: 2, mb: 2, borderRadius: '16px' };
    };

    return (
        <Paper elevation={2} sx={getPaperStyles()}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="subtitle1">{court}</Typography>
                <Typography variant="body2" color="text.secondary" align="right">
                    {formatMatchDate(date)} | {time ? excludeSeconds(time) : ''}
                </Typography>
            </Box>
            <Divider sx={{ marginY: 1 }} />
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    {status === MatchStatus.APPROVED && getRatingChangeDisplay(match.player1RatingChange)}
                    <Typography variant="body1" fontWeight="bold" color="primary" sx={{ flexGrow: 1 }}>
                        {player1.firstname[0]}. {player1.lastname}
                        {!isDraw && winner === player1 && <span style={{ color: 'green' }}> ✔</span>}
                    </Typography>
                    <Typography variant="body1" sx={{ marginRight: 2 }}>
                        {score && Array.isArray(score) ? score.map(s => s.player1Score).join(' ') : 'N/A'}
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                    {status === MatchStatus.APPROVED && getRatingChangeDisplay(match.player2RatingChange)}
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
            {status === MatchStatus.PENDING && (
                <Typography variant="body2" color="warning.main" sx={{ mt: 1, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                Match under review by {player2.firstname}
                {timeRemaining && (
                    <Box component="span" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime fontSize="small" />
                        {timeRemaining}
                    </Box>
                )}
            </Typography>
            )}
            <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                {isDraw ? 'The match ended in a draw.' : `Game Set and Match ${winner?.firstname} ${winner?.lastname}.`}<br />
                {!isDraw && (
                    <>
                        {`${winner?.firstname[0]}. ${winner?.lastname} wins `}
                        {score.map((set, index) => {
                            const winnerScore = winnerId === player1Id ? set.player1Score : set.player2Score;
                            const loserScore = winnerId === player1Id ? set.player2Score : set.player1Score;
                            return (
                                <span key={index}>
                                    {winnerScore}-{loserScore}
                                    {index < score.length - 1 ? ' ' : ''}
                                </span>
                            );
                        })}
                    </>
                )}
            </Typography>
            {actionButtons && (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    mt: 2 
                }}>
                    {actionButtons}
                </Box>
            )}
        </Paper>

    )
}

export default MatchInfo

