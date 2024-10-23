import FormControl from '@mui/material/FormControl';
import Checkbox from '@mui/material/Checkbox';
import { useAppSelector } from '../../store';  // Adjust the path as per your project structure
import { Autocomplete, Avatar, TextField } from '@mui/material';
import { CheckBox, CheckBoxOutlineBlank } from '@mui/icons-material';

interface MultipleSelectProps {
    selectedItems: string[];
    label: string;
    onChange: (selectedIds: string[]) => void;
}

export default function MultipleSelectCheckmarks({
    onChange,
}: MultipleSelectProps) {

    const players = useAppSelector(state => state.player.playerList);
    const loggedInProfile = useAppSelector(state => state.player.loggedInProfile);

    const availablePlayers = players.filter(player => player.id !== loggedInProfile?.id);

    const icon = <CheckBoxOutlineBlank fontSize="small" />;
    const checkedIcon = <CheckBox fontSize="small" />;

    return (
        <FormControl sx={{ width: '100%' }} fullWidth>
            <Autocomplete
                multiple
                id="checkboxes-tags-demo"
                options={availablePlayers}
                disableCloseOnSelect
                getOptionLabel={(option) => `${option.firstname} ${option.lastname}`}
                onChange={(event, value) => onChange(value.map((player) => player.id))}
                renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    return (
                        <li key={key} {...optionProps}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                            />
                            <Avatar
                                src={option.profileImageUrl}
                                alt={option.firstname}
                                sx={{ width: 35, height: 35, marginRight: 1 }}
                            />
                            {`${option.firstname} ${option.lastname}`}
                        </li>
                    );
                }}
                style={{ width: '100%' }}
                renderInput={(params) => (
                    <TextField {...params} label="Select Players" placeholder="Players" />
                )}
            />
        </FormControl>
    );
}
