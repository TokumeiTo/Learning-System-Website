import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import type { UserListItem, UserDeleteFields } from "../../types/user";

interface Props {
  user: UserListItem | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string, data: UserDeleteFields) => Promise<void>;
  loading: boolean;
}

const UserDeleteDialog: React.FC<Props> = ({ user, open, onClose, onConfirm, loading }) => {
  const { control, handleSubmit, reset, formState: { errors } } = useForm<UserDeleteFields>({
    defaultValues: { deletedReason: "" }
  });

  const onSubmit = (data: UserDeleteFields) => {
    if (user) onConfirm(user.id, data);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ color: 'error.main', fontWeight: 700 }}>Confirm Deletion</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Are you sure you want to delete <strong>{user?.fullName}</strong>? This action is permanent and will be logged in the audit trail.
          </DialogContentText>
          <Controller name="deletedReason" control={control} rules={{ required: "Reason is required" }} render={({ field }) => (
            <TextField {...field} label="Reason for deletion" fullWidth multiline rows={2} 
              error={!!errors.deletedReason} helperText={errors.deletedReason?.message}
            />
          )} />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" color="error" variant="contained" disabled={loading}>
            {loading ? "Deleting..." : "Delete User"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserDeleteDialog;