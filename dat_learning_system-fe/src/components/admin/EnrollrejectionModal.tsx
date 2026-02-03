import React, { useState } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, TextField, Typography 
} from '@mui/material';

interface Props {
    open: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    studentName: string;
}

const RejectionModal: React.FC<Props> = ({ open, onClose, onConfirm, studentName }) => {
    const [reason, setReason] = useState('');

    const handleConfirm = () => {
        onConfirm(reason || "None"); // Default to "None" if empty
        setReason(''); // Reset for next use
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle sx={{ fontWeight: 800 }}>Reject Enrollment</DialogTitle>
            <DialogContent>
                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Please provide a reason for rejecting <strong>{studentName}</strong>'s request.
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Reason for Rejection"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="e.g. Prerequisites not met"
                />
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button 
                    onClick={handleConfirm} 
                    variant="contained" 
                    color="error"
                    disabled={!reason.trim()}
                >
                    Confirm Rejection
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RejectionModal;