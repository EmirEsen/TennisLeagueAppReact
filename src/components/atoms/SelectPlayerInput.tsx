import { Select, MenuItem, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import { useAppSelector } from '../../store';  //
import { IPlayerProfile } from '../../models/IPlayerProfile';

interface SelectAvatarInputProps {
    selectedPlayer: string;
    tournamentId: string;
    tournamentPlayerList: IPlayerProfile[];
    onChange: (playerId: string) => void;
}

export default function SelectPlayerInput({ selectedPlayer, tournamentPlayerList, onChange }: SelectAvatarInputProps) {
    const loggedInPlayer = useAppSelector(state => state.player.loggedInProfile?.id)

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
                    {tournamentPlayerList.filter(player => player.id !== loggedInPlayer)
                        .map((player: IPlayerProfile) => (
                            <MenuItem key={player.id} value={player.id}>
                                {player.firstname} {player.lastname}
                            </MenuItem>
                        ))}
                </Select>
            </FormControl>

        </>

    );
}