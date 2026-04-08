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
import type { UserListItem, UserUpdateFields } from "../../types_interfaces/user";

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

  // 1. Reset form when user/open changes
  useEffect(() => {
    if (user && open) {
      isInitialLoad.current = true;
      reset({
        fullName: user.fullName,
        position: user.position,
        orgUnitId: user.orgUnitId,
        updatedReason: ""
      });
    }
  }, [user, open, reset]);

  // 2. Fetching Logic (Unified for all positions)
  useEffect(() => {
    if (!selectedPosition) return;

    const posId = Number(selectedPosition);

    // Clear unit ONLY if the user manually changed the position after initial load
    if (!isInitialLoad.current) {
      setValue("orgUnitId", "" as any);
    }

    const fetchUnits = async () => {
      setFetchingUnits(true);
      try {
        let data = [];
        // Admin (1) and Division Head (usually 2 or based on your POSITIONS util) 
        // both need to fetch from getDivisions()
        if (posId === 1 || posId === 6) {
          data = await getDivisions();
        }
        else if (posId === 2) data = await getDepartments();
        else if (posId === 3) data = await getSections();
        else data = await getTeams();

        const normalized = normalizeOrgData(data);
        setOrgUnits(normalized);

        // AUTO-SELECT for Admin: If position is Admin and we have units, 
        // force select Management (ID 1)
        if (posId === 1) {
          setValue("orgUnitId", 1);
        }
      } catch (err) {
        console.error("Failed to fetch units", err);
      } finally {
        setFetchingUnits(false);
        isInitialLoad.current = false; // Mark initial load complete after first fetch
      }
    };

    fetchUnits();
  }, [selectedPosition, setValue]);

  const handleFormSubmit = (data: UserUpdateFields) => {
    if (user) onConfirm(user.id, data);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800, fontSize: "30px" }}>Edit User: {user?.fullName}</DialogTitle>
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

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

            <Controller
              name="orgUnitId"
              control={control}
              render={({ field }) => {
                // Logic to check if the current value exists in the loaded list
                const valueExists = orgUnits.some((u) => u.id === Number(field.value));
                const isLoading = fetchingUnits;

                return (
                  <TextField
                    {...field}
                    select
                    label={Number(selectedPosition) === 1 ? "Assigned Unit (Fixed)" : "Organization Unit"}
                    fullWidth
                    disabled={isLoading || Number(selectedPosition) === 1}
                    value={field.value ?? ""}
                    error={!!errors.orgUnitId}
                    helperText={errors.orgUnitId?.message}
                    InputProps={{
                      endAdornment: isLoading ? <CircularProgress size={20} sx={{ mr: 4 }} /> : null
                    }}
                  >
                    {/* FIX: If the value isn't in the list (loading or mismatch), render a hidden item */}
                    {(!valueExists && field.value) && (
                      <MenuItem value={field.value} sx={{ display: 'none' }}>
                        {field.value}
                      </MenuItem>
                    )}

                    {!isLoading && orgUnits.map((u) => (
                      <MenuItem key={u.id} value={u.id}>
                        {u.name}
                      </MenuItem>
                    ))}

                    {!isLoading && orgUnits.length === 0 && (
                      <MenuItem disabled value="">No units available</MenuItem>
                    )}
                  </TextField>
                );
              }}
            />

            {/* DateTime Fix Applied Here if needed for other fields */}
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