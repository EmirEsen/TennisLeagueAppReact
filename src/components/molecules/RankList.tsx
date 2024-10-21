
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, Typography, Box
} from '@mui/material';

// import emirpp from '../../images/emirpp.jpg';
import { IPlayerProfile } from '../../models/IPlayerProfile';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';

function calculateAge(dob: string): number {
    const birthDate = dayjs(dob);
    const currentDate = dayjs();
    return currentDate.diff(birthDate, 'year');
}

const calculateWinLossRatio = (wins: number, losses: number): string => {
    if (!wins && !losses) {
        return 'N/A';
    }
    if (losses === 0) {
        return '100%';
    }
    const ratio = (wins / (wins + losses)) * 100;
    return `${ratio.toFixed(0)}%`;
};


export default function RankList(props: { players: IPlayerProfile[], tournamentId: string }) {
    return (
        <TableContainer component={Paper} >
            <Table >
                <TableHead >
                    <TableRow >
                        <TableCell align='center' sx={{ fontSize: '0.75rem', p: 1 }}>Rank</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', p: 1 }}>Player</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', p: 1, display: { xs: 'none', sm: 'table-cell' } }}>Age</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', p: 1 }}>Official Rating</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', p: 1, display: { xs: 'none', sm: 'table-cell' } }}>Win/Lose</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', p: 1, display: { xs: 'none', sm: 'table-cell' } }}>Match Played</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', p: 1, display: { xs: 'none', sm: 'table-cell' } }}>Win</TableCell>
                        <TableCell sx={{ fontSize: '0.75rem', p: 1, display: { xs: 'none', sm: 'table-cell' } }}>Lose</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.players.map((player, index) => (
                        <TableRow key={player.email} >
                            <TableCell align='center'>{index + 1}</TableCell>
                            <TableCell>
                                <Box display="flex" alignItems="center">
                                    <Avatar src={player.profileImageUrl} alt={player.firstname} sx={{ width: 50, height: 50, objectFit: 'cover', objectPosition: 'top', border: '1px solid' }} />
                                    <Box ml={2}>
                                        <Link to={`/player-view?tournamentId=${props.tournamentId}&playerId=${player.id}`} style={{ textDecoration: 'none', color: 'black' }}>
                                            <Typography sx={{
                                                fontSize: '1rem',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                    color: '#121FFF'
                                                }
                                            }}>
                                                {player.firstname} {player.lastname}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }} >
                                {player.dob ? calculateAge(player.dob) : 'N/A'}
                            </TableCell>
                            <TableCell sx={{
                                fontWeight: 'bold'
                            }}>
                                {player.rating != null ? player.rating : 'N/A'}
                            </TableCell>
                            <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                {calculateWinLossRatio(player.win, player.lose)}
                            </TableCell>
                            <TableCell align='center' sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                {player.matchPlayed != null ? player.matchPlayed : 'N/A'}
                            </TableCell>
                            <TableCell align='center' sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                {player.win != null ? player.win : 'N/A'}
                            </TableCell>
                            <TableCell align='center' sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                                {player.lose != null ? player.lose : 'N/A'}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer >
    );
};
