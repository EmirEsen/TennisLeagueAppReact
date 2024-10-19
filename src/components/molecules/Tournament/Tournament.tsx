import { Avatar, AvatarGroup, Box, Button, Card, Stack, Typography, useMediaQuery } from "@mui/material"
import { ITournament } from "../../../models/ITournament"
import { useNavigate } from "react-router-dom";

function excludeSeconds(timeString: string): string {
    const parts = timeString.split(':');

    if (parts.length >= 3) {
        return `${parts[0]}:${parts[1]}`;
    }

    return timeString;
}

interface TournamentProps {
    tournament: ITournament; // Expecting tournament as a prop
}

function formatTournamentDate(start: string, end: string): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const formattedStart = new Date(start).toLocaleDateString('en-GB', options);
    const formattedEnd = new Date(end).toLocaleDateString('en-GB', options);
    return `${formattedStart} - ${formattedEnd}`;
}

const Tournament: React.FC<TournamentProps> = ({ tournament }) => {

    const isMobile = useMediaQuery('(max-width: 600px)');
    const navigate = useNavigate();
    // const { playersOfTournament, isLoading: isplayersOfTournamentLoading } = useAppSelector(state => state.tournament)
    const handleResultsClick = () => {
        navigate(`/tournament/${tournament.id}`);
    };

    const formattedDates = formatTournamentDate(tournament.start, tournament.end);

    return (
        <>
            {isMobile ? (
                <Card sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: 2,
                    marginBottom: 2,
                    borderRadius: 2,
                    border: '1px solid #E0E0E0'
                }}>
                    {/* Left side: Logo and Tournament Info */}
                    <Stack direction="row" alignItems="center" spacing={2}>
                        {/* Tournament Logo */}
                        <Avatar
                            variant="square"
                            src={'someimage'}
                            sx={{ width: 56, height: 56 }}
                            alt="Tournament Logo"
                        />
                        {/* Tournament Info */}
                        <Box>
                            <Typography variant="h6">
                                {tournament.title}
                            </Typography>
                            {/* Start and End Dates */}
                            <Typography variant="body2" color="textSecondary">
                                {formattedDates}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                                {tournament.info}
                            </Typography>
                        </Box>
                        {/* {date} | {time ? excludeSeconds(time) : ''} */}
                    </Stack>

                    <Stack direction="row"
                        spacing={2}
                        sx={{
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginTop: 2
                        }}>
                        {/* AvatarGroup aligned to the right */}
                        <AvatarGroup max={6} spacing={14} sx={{ marginTop: 2 }}>
                            {tournament.players?.map((participant) => (
                                <Avatar
                                    key={participant.id}
                                    alt={participant.firstname}
                                    src={participant.profileImageUrl} // Use participant's avatar URL
                                />
                            ))}
                        </AvatarGroup>

                        {/* Right side: Results Button */}
                        <Button variant="outlined" sx={{ color: 'blue', borderColor: 'blue', textTransform: 'none', marginTop: 1 }}
                            onClick={handleResultsClick}>
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
                    border: '1px solid #E0E0E0'
                }}>

                    {/* Left side: Logo */}
                    <Stack direction="row" alignItems="center" spacing={2}
                        sx={{ flexDirection: isMobile ? 'column' : 'row', width: '100%' }}
                    >

                        {/* Tournament Logo */}
                        <Avatar
                            variant="square"
                            src={'someimage'}
                            sx={{ width: 56, height: 56 }}
                            alt="Tournament Logo"
                        />

                        {/* Tournament Info */}
                        <Box>
                            <Typography variant="h6">
                                {tournament.title}
                            </Typography>
                            {/* Start and End Dates */}
                            <Typography variant="body2" color="textSecondary">
                                {formattedDates}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
                                {tournament.info}
                            </Typography>
                        </Box>
                    </Stack>

                    <AvatarGroup max={4} spacing={14} sx={{ marginLeft: 'auto' }}>
                        {tournament.players?.map((participant) => (
                            <Avatar
                                key={participant.id}
                                alt={participant.firstname}
                                src={participant.profileImageUrl} // Use participant's avatar URL
                            />
                        ))}
                    </AvatarGroup>


                    <Button variant="outlined" sx={{ color: 'blue', borderColor: 'blue', textTransform: 'none', marginLeft: 2 }}
                        onClick={handleResultsClick}>
                        Results
                    </Button>
                </Card>
            )}
        </>
    )
}

export default Tournament
