import { Button } from '@mui/material';
import { Check } from '@mui/icons-material';

interface ApproveMatchButtonProps {
    onApprove: () => void;
}

function ApproveMatchButton({ onApprove }: ApproveMatchButtonProps) {
    return (
        <Button
            variant="contained"
            color="success"
            endIcon={<Check />}
            onClick={onApprove}
            size="small"
        >
            Approve
        </Button>
    );
}

export default ApproveMatchButton;