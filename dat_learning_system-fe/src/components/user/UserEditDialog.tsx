import React, { useEffect, useState, useRef } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  TextField, MenuItem, Box, CircularProgress 
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { POSITIONS } from "../../utils/positions";
import { getDepartments, getDivisions, getSections, getTeams } from "../../api/org.api";
import { normalizeOrgData } from "../../utils/orgHelpers";
import type { UserListItem, UserUpdateFields } from "../../types/user";

const schema = yup.object({
  fullName: yup.string().required("Full Name is required"),
  position: yup.number().required("Position is required"),
  orgUnitId: yup.number().required("Unit is required"),
  updatedReason: yup.string().required("Reason for update is required for auditing").min(5),
});

interface Props {
  user: UserListItem | null;
  open: boolean;
  onClose: () => void;
  onConfirm: (id: string, data: UserUpdateFields) => Promise<void>;
  loading: boolean;
}

const UserEditDialog: React.FC<Props> = ({ user, open, onClose, onConfirm, loading }) => {
  const [orgUnits, setOrgUnits] = useState<{ id: number; name: string }[]>([]);
  const [fetchingUnits, setFetchingUnits] = useState(false);
  
  // Use a ref to track if the current "reset" is coming from a fresh dialog open
  const isInitialLoad = useRef(true);

  const { control, handleSubmit, watch, reset, setValue, formState: { errors } } = useForm<UserUpdateFields>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      position: "" as any,
      orgUnitId: "" as any,
      updatedReason: ""
    }
  });

  const selectedPosition = watch("position");

  // 1. Initial Data Load
  useEffect(() => {
    if (user && open) {
      isInitialLoad.current = true; // Mark that we are loading the user data
      reset({
        fullName: user.fullName,
        position: user.position,
        orgUnitId: user.orgUnitId,
        updatedReason: ""
      });
    }
  }, [user, open, reset]);

  // 2. Position Change Reset Logic & Fetching
  useEffect(() => {
    if (!selectedPosition) {
      setOrgUnits([]);
      return;
    }

    // --- CRITICAL FIX START ---
    // If the position changed and it's NOT the initial dialog open, 
    // we must clear the orgUnitId to avoid the "out-of-range" warning.
    if (!isInitialLoad.current) {
      setValue("orgUnitId", "" as any); 
    }
    // After the first check, any further position changes are user-driven
    isInitialLoad.current = false;
    // --- CRITICAL FIX END ---

    const fetchUnits = async () => {
      setFetchingUnits(true);
      try {
        let data = [];
        const posId = Number(selectedPosition);
        if (posId === 1) data = await getDivisions();
        else if (posId === 2) data = await getDepartments();
        else if (posId === 3) data = await getSections();
        else data = await getTeams();
        setOrgUnits(normalizeOrgData(data));
      } finally { setFetchingUnits(false); }
    };
    fetchUnits();
  }, [selectedPosition, setValue]);

  const handleFormSubmit = (data: UserUpdateFields) => {
    if (user) onConfirm(user.id, data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>Edit User: {user?.fullName}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            
            <Controller name="fullName" control={control} render={({ field }) => (
              <TextField {...field} label="Full Name" fullWidth error={!!errors.fullName} helperText={errors.fullName?.message} />
            )} />

            <Controller name="position" control={control} render={({ field }) => (
              <TextField 
                {...field} 
                select 
                label="Position" 
                fullWidth
                value={field.value ?? ""} 
                error={!!errors.position}
                helperText={errors.position?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {POSITIONS.map((p) => (
                  <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                ))}
              </TextField>
            )} />

            <Controller name="orgUnitId" control={control} render={({ field }) => (
              <TextField 
                {...field} 
                select 
                label="Organization Unit" 
                fullWidth 
                disabled={fetchingUnits}
                value={field.value ?? ""} 
                error={!!errors.orgUnitId}
                helperText={errors.orgUnitId?.message}
                InputProps={{
                  endAdornment: fetchingUnits ? <CircularProgress size={20} sx={{ mr: 4 }} /> : null
                }}
                onChange={(e) => field.onChange(Number(e.target.value))}
              >
                {/* Fix: We check if the current value exists in the loaded units. 
                   If not, and we have a value, we show a placeholder to stop the MUI warning.
                */}
                {orgUnits.length > 0 ? (
                  orgUnits.map((u) => (
                    <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
                  ))
                ) : field.value ? (
                   <MenuItem value={field.value}>Loading units...</MenuItem>
                ) : (
                   <MenuItem disabled value="">Select a unit</MenuItem>
                )}
              </TextField>
            )} />

            <Controller name="updatedReason" control={control} render={({ field }) => (
              <TextField 
                {...field} 
                label="Change Reason (Audit)" 
                multiline 
                rows={2} 
                fullWidth 
                placeholder="Why are these changes being made?"
                error={!!errors.updatedReason} 
                helperText={errors.updatedReason?.message} 
              />
            )} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={onClose} color="inherit">Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading || fetchingUnits}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserEditDialog;