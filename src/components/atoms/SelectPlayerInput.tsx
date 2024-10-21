import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useAppSelector } from '../../store';  //
import { IGetTournamentPlayer } from '../../models/get/IGetTournamentPlayer';

interface SelectAvatarInputProps {
    selectedPlayer: string;
    tournamentId: string;
    tournamentPlayerList: IGetTournamentPlayer[];
    onChange: (playerId: string) => void;
}

export default function SelectPlayerInput({ selectedPlayer, tournamentPlayerList, onChange }: SelectAvatarInputProps) {
    const loggedInPlayerId = useAppSelector(state => state.player.loggedInProfile?.id)

    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value);
    };

    return (
        <>
            <FormControl sx={{ minWidth: '100%' }}>
                <InputLabel id="demo-simple-select-autowidth-label">Select Opponent</InputLabel>
                <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    value={selectedPlayer}
                    onChange={handleChange}
                    autoWidth
                    label="Select Opponent"
                >
                    <MenuItem value="" disabled> <em>Select Player</em></MenuItem>
                    {tournamentPlayerList.filter(player => player.playerId !== loggedInPlayerId)
                        .map((player: IGetTournamentPlayer) => (
                            <MenuItem key={player.playerId} value={player.playerId}>
                                {player.firstname} {player.lastname}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>

        </>

    );
}