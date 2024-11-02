import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

interface TournamentDurationSwitchProps {
    isFiniteDuration: boolean;
    handleSwitchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TournamentDurationSwitch({
    isFiniteDuration,
    handleSwitchChange,
}: TournamentDurationSwitchProps) {
    return (
        <FormGroup>
            <FormControlLabel
                control={<Switch checked={isFiniteDuration} onChange={handleSwitchChange} />}
                label="Duration"
                labelPlacement="start"
            />
        </FormGroup>
    );
}
