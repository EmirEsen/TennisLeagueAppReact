import { Button } from '@mui/material';
import { Close } from '@mui/icons-material';

interface RejectMatchButtonProps {
    onReject: () => void;
}

function RejectMatchButton({ onReject }: RejectMatchButtonProps) {
    return (
        <Button
            variant="contained"
            color="error"
            startIcon={<Close />}
            onClick={onReject}
            size="small"
        >
            Reject
        </Button>
    );
}

export default RejectMatchButton;