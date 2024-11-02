import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface GenderRadioButtonProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function GenderRadioButton({ value, onChange }: GenderRadioButtonProps) {
    return (
        <FormControl >
            <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
            <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="gender"
                value={value}
                onChange={onChange}
            >
                <FormControlLabel value="MALE" control={<Radio />} label="Male" />
                <FormControlLabel value="FEMALE" control={<Radio />} label="Female" />
            </RadioGroup>
        </FormControl>
    );
}