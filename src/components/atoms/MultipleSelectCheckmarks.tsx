import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { useAppSelector } from '../../store';  // Adjust the path as per your project structure
import { IPlayerProfile } from '../../models/IPlayerProfile';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

interface MultipleSelectProps {
    selectedItems: string[];
    label: string;
    onChange: (selectedIds: string[]) => void;
}

export default function MultipleSelectCheckmarks({
    selectedItems,
    label,
    onChange,
}: MultipleSelectProps) {

    const players = useAppSelector(state => state.player.playerList);

    // Handle change event when a user selects or deselects players/managers
    const handleChange = (event: SelectChangeEvent<typeof selectedItems>) => {
        const {
            target: { value },
        } = event;
        onChange(typeof value === 'string' ? value.split(',') : value);
    };

    // Render the full names of selected players or managers
    const renderSelectedNames = (selectedIds: string[]) => {
        const selectedPlayers = players.filter(player => selectedIds.includes(player.id));
        return selectedPlayers.map(player => `${player.firstname} ${player.lastname}`).join(', ');
    };

    return (
        <FormControl sx={{ width: '100%' }} fullWidth>
            <InputLabel id="multiple-checkbox-label">{label}</InputLabel>
            <Select
                labelId="multiple-checkbox-label"
                id="multiple-checkbox"
                multiple
                value={selectedItems}
                onChange={handleChange}
                input={<OutlinedInput label={label} />}
                renderValue={renderSelectedNames}
                MenuProps={MenuProps}
                fullWidth
            >
                {players.map((player: IPlayerProfile) => (
                    <MenuItem key={player.id} value={player.id}>
                        <Checkbox checked={selectedItems.includes(player.id)} />
                        <ListItemText primary={`${player.firstname} ${player.lastname}`} />
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}
