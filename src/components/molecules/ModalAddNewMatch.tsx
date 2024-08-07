import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import AddNewMatch from './AddNewMatchForm';
import { Chip } from '@mui/material';
import { Add } from '@mui/icons-material';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background',
    boxShadow: 24,
    p: 0.5,
    borderRadius: '16px'
};

export default function ModalAddNewMatch() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <div>

            <Chip label="Add New Match" color="info" icon={<Add />} variant="outlined" onClick={handleOpen} sx={{ mb: 2 }} />

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-new-match"
                aria-describedby="adding-new-match-record"
            >
                <Box sx={style}>
                    <AddNewMatch />
                </Box>
            </Modal>
        </div>
    );
}