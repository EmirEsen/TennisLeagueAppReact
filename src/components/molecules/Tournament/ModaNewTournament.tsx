import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { Chip, IconButton } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import AddNewTournament from './AddNewTournamentForm';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: {
        xs: '90%',  // 90% width on extra-small screens
        sm: 500,    // 500px width on small screens and above
    },
    maxHeight: '90vh',
    bgcolor: 'background',
    boxShadow: 24,
    p: 0.5,
    borderRadius: '16px',
    overflowY: 'auto',
};

const closeButtonStyle = {
    position: 'absolute',
    top: 8,
    right: 8,
};

export default function ModalAddNewTournament({
    isActive,
    infoText,
    customButton,
    onTournamentAdded
}: {
    isActive?: boolean,
    infoText?: string,
    customButton?: React.ReactNode,
    onTournamentAdded?: () => void  // Add the prop
}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleTournamentAdded = () => {
        handleClose();
        if (onTournamentAdded) {
            onTournamentAdded();
        }
    };

    return (
        <>
            {customButton ? (
                React.cloneElement(customButton as React.ReactElement, { onClick: handleOpen })
            ) : (
                <Chip disabled={!isActive} label={infoText} color="info"
                    icon={<Add />} variant="outlined" onClick={handleOpen} sx={{ mb: 2 }} />
            )}

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-new-match"
                aria-describedby="adding-new-match-record"
            >
                <Box sx={style}>
                    <IconButton onClick={handleClose} sx={closeButtonStyle}>
                        <Close />
                    </IconButton>
                    <AddNewTournament onClose={handleTournamentAdded} />
                </Box>
            </Modal>
        </>
    );
}