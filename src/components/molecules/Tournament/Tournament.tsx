import { Avatar, AvatarGroup, Box, Button, Card, Stack, Typography, useMediaQuery } from "@mui/material"
import { ITournament } from "../../../models/ITournament"
import { useNavigate } from "react-router-dom";
import StatusDot from "../../atoms/StatusDot";
import { IPlayerProfile } from "../../../models/IPlayerProfile";

function formatTournamentDate(start: string, end: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedStart = new Date(start).toLocaleDateString('en-GB', options);
    const formattedEnd = new Date(end).toLocaleDateString('en-GB', options);
    return `${formattedStart} - ${formattedEnd}`;
}

interface TournamentProps {
    tournament: ITournament;
    tournamentPlayers: IPlayerProfile[];  // New prop for players
}

const Tournament: React.FC<TournamentProps> = ({ tournament, tournamentPlayers }) => {

    const isMobile = useMediaQuery('(max-width: 600px)');
    const navigate = useNavigate();
    const formattedDates = formatTournamentDate(tournament.start, tournament.end);

    const handleResultsClick = () => {
        navigate(`/tournament/${tournament.id}`);
    };

    return (
        <>
            {isMobile ? (
                <Card sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 2,
                    marginBottom: 2,
                    borderRadius: 2,
                    border: '1px solid #E0E0E0',
                    position: 'relative'
                }}>
                    <StatusDot status={tournament.status} />
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar
                            variant="square"
                            src={'someimage'}
                            sx={{ width: 56, height: 56 }}
                            alt={tournament.title}
                        />
                        <Box>
                            <Typography variant="h6">
                                {tournament.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {formattedDates}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                                {tournament.info}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ justifyContent: "space-between", alignItems: "center", marginTop: 2 }}>
                        <AvatarGroup max={6} spacing={14} sx={{ marginTop: 2 }}>
                            {tournamentPlayers.map((participant) => (
                                <Avatar
                                    key={participant.id}
                                    alt={participant.firstname}
                                    src={participant.profileImageUrl}
                                />
                            ))}
                        </AvatarGroup>
                        <Button variant="outlined" sx={{ color: 'blue', borderColor: 'blue', textTransform: 'none', marginTop: 1 }} onClick={handleResultsClick}>
                            Results
                        </Button>
                    </Stack>
                </Card>
            ) : (
                <Card sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 2,
                    marginBottom: 2,
                    borderRadius: 2,
                    border: '1px solid #E0E0E0',
                    position: 'relative',
                    minHeight: '110px'
                }}>
                    <StatusDot status={tournament.status} />
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ flexDirection: isMobile ? 'column' : 'row', width: '100%' }}>
                        <Avatar
                            variant="square"
                            src={'someimage'}
                            sx={{ width: 56, height: 56 }}
                            alt={tournament.title}
                        />
                        <Box>
                            <Typography variant="h6">
                                {tournament.title}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                {formattedDates}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                                {tournament.info}
                            </Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" alignItems="center" spacing={2} sx={{ justifyContent: 'flex-end', flexShrink: 0 }}>
                        <AvatarGroup max={6} spacing={14} sx={{ marginTop: 2 }}>
                            {tournamentPlayers.map((participant) => (
                                <Avatar
                                    key={participant.id}
                                    alt={participant.firstname}
                                    src={participant.profileImageUrl}
                                />
                            ))}
                        </AvatarGroup>
                        <Button variant="outlined" sx={{ color: 'blue', borderColor: 'blue', textTransform: 'none', marginTop: 1 }} onClick={handleResultsClick}>
                            Results
                        </Button>
                    </Stack>
                </Card>
            )}
        </>
    );
};

export default Tournament;
