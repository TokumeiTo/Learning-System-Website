import React, { useEffect, useState } from "react";
import {
    Box, Button, TextField, MenuItem, Paper, Typography, Stack, CircularProgress
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { POSITIONS } from "../../utils/positions";
import { getDepartments, getDivisions, getSections, getTeams } from "../../api/org.api";
import { normalizeOrgData } from "../../utils/orgHelpers";
import type { RegisterRequest } from "../../types/auth";

// Validation Schema
const schema = yup.object({
    fullName: yup.string().required("Full Name is required"),
    email: yup.string().required("Email is required").email("Invalid email"),
    password: yup.string().required("Password is required").min(6),
    companyCode: yup.string().required("Company Code is required"),
    position: yup.number().required("Position is required"),
    orgUnitId: yup.number().required("Organization unit is required"),
});

interface UserAddFormProps {
    onSuccess: (data: RegisterRequest) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
}

const UserAddForm: React.FC<UserAddFormProps> = ({ onSuccess, onCancel, loading }) => {
    const [orgUnits, setOrgUnits] = useState<{ id: number; name: string }[]>([]);
    const [fetchingUnits, setFetchingUnits] = useState(false);

    const { control, handleSubmit, watch, formState: { errors } } = useForm<RegisterRequest>({
        resolver: yupResolver(schema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            companyCode: "",
            // Initializing with empty strings prevents the MUI "out-of-range" warning
            position: "" as any,
            orgUnitId: "" as any
        }
    });

    const selectedPosition = watch("position");

    // Dynamic Unit Fetching
    useEffect(() => {
        if (!selectedPosition) {
            setOrgUnits([]);
            return;
        }

        const fetchUnits = async () => {
            setFetchingUnits(true);
            try {
                let data = [];
                if (selectedPosition === 1) data = await getDivisions();
                else if (selectedPosition === 2) data = await getDepartments();
                else if (selectedPosition === 3) data = await getSections();
                else data = await getTeams();

                setOrgUnits(normalizeOrgData(data));
            } finally {
                setFetchingUnits(false);
            }
        };
        fetchUnits();
    }, [selectedPosition]);

    return (
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid', borderColor: 'divider', maxWidth: 800, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Registration Details</Typography>

            <form onSubmit={handleSubmit(onSuccess)} noValidate>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>

                    <Controller name="fullName" control={control} render={({ field }) => (
                        <TextField {...field} label="Full Name" fullWidth error={!!errors.fullName} helperText={errors.fullName?.message} />
                    )} />

                    <Controller name="email" control={control} render={({ field }) => (
                        <TextField {...field} label="Email Address" fullWidth error={!!errors.email} helperText={errors.email?.message} />
                    )} />

                    <Controller name="password" control={control} render={({ field }) => (
                        <TextField {...field} label="Temporary Password" type="password" fullWidth error={!!errors.password} helperText={errors.password?.message} />
                    )} />

                    <Controller name="companyCode" control={control} render={({ field }) => (
                        <TextField {...field} label="Company Code" fullWidth error={!!errors.companyCode} helperText={errors.companyCode?.message} />
                    )} />

                    {/* Position / Role Selection */}
                    <Controller
                        name="position"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Role / Position"
                                fullWidth
                                // If field.value is undefined/null, use "" to satisfy MUI
                                value={field.value ?? ""}
                                error={!!errors.position}
                                helperText={errors.position?.message}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            >
                                {POSITIONS.map((p) => (
                                    <MenuItem key={p.value} value={p.value}>
                                        {p.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />

                    {/* Organization Unit Selection */}
                    <Controller
                        name="orgUnitId"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label="Assign to Unit"
                                fullWidth
                                // If field.value is undefined/null, use "" to satisfy MUI
                                value={field.value ?? ""}
                                disabled={!selectedPosition || fetchingUnits}
                                error={!!errors.orgUnitId}
                                helperText={errors.orgUnitId?.message || (!selectedPosition && "Select position first")}
                                InputProps={{
                                    endAdornment: fetchingUnits ? <CircularProgress size={20} sx={{ mr: 3 }} /> : null
                                }}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                            >
                                {orgUnits.length > 0 ? (
                                    orgUnits.map((unit) => (
                                        <MenuItem key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled value="">
                                        {fetchingUnits ? "Loading..." : "No units available"}
                                    </MenuItem>
                                )}
                            </TextField>
                        )}
                    />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                    <Button onClick={onCancel} color="inherit" disabled={loading}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading} sx={{ px: 4, borderRadius: 2 }}>
                        {loading ? "Registering..." : "Confirm Registration"}
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
};

export default UserAddForm;