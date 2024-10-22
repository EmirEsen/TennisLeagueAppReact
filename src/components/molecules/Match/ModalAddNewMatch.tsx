import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AddNewMatch from './AddNewMatchForm';
import { Chip, IconButton } from '@mui/material';
import { Add, Close } from '@mui/icons-material';
import { IGetTournamentPlayer } from '../../../models/get/IGetTournamentPlayer';

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

export default function ModalAddNewMatch({
    isActive,
    infoText,
    customButton,
    tournamentId = '',
    tournamentPlayerList,
    onMatchAdded
}: {
    isActive?: boolean,
    infoText?: string,
    customButton?: React.ReactNode,
    tournamentId?: string
    tournamentPlayerList: IGetTournamentPlayer[],
    onMatchAdded?: () => void
}) {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleMatchAdded = () => {
        handleClose();
        if (onMatchAdded) {
            onMatchAdded();
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
                    <AddNewMatch
                        tournamentId={tournamentId}
                        tournamentPlayerList={tournamentPlayerList}
                        onClose={handleMatchAdded} />
                </Box>
            </Modal>
        </>
    );
}