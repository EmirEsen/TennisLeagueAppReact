import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { TournamentPrivacy } from '../../models/enums/TournamentPrivacy';

interface TournamentPrivacyRadioButtonProps {
    value: TournamentPrivacy;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function TournamentPrivacyRadioButton({ value, onChange }: TournamentPrivacyRadioButtonProps) {
    return (
        <FormControl >
            <FormLabel id="privacy-radio-buttons-group-label">Privacy</FormLabel>
            <RadioGroup
                row
                aria-labelledby="privacy-radio-buttons-group-label"
                name="privacy"
                value={value}
                onChange={onChange}
            >
                <FormControlLabel
                    value={TournamentPrivacy.PUBLIC}
                    control={<Radio />}
                    label="Public"
                />
                <FormControlLabel
                    value={TournamentPrivacy.MEMBERS_PRIVATE}
                    control={<Radio />}
                    label="All Tennis Club Members"
                />
                <FormControlLabel
                    value={TournamentPrivacy.PRIVATE}
                    control={<Radio />}
                    label="Private"
                />
                <FormControlLabel
                    value={TournamentPrivacy.USER_NETWORK}
                    control={<Radio />}
                    label="Your Network"
                />
            </RadioGroup>
        </FormControl>
    );
}