import React, { useEffect, useState } from "react";
import {
    Box, Button, TextField, MenuItem, Paper, Typography, Stack, CircularProgress,
    Alert, AlertTitle, Checkbox, FormControlLabel, Divider,
    useTheme
} from "@mui/material";
import { InfoOutlined, WarningAmberRounded } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { ButtonClickLoader } from "../feedback/ButtonClickLoader";
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
    const [isConfirmed, setIsConfirmed] = useState(false);

    const theme = useTheme();
    const { control, handleSubmit, watch, setValue, formState: { errors } } = useForm<RegisterRequest>({
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
                const posId = Number(selectedPosition);
                let data = [];

                if (posId === 6 || posId === 7) {
                    // 1. Fetch specifically for Management
                    const divisions = await getDivisions();
                    const normalized = normalizeOrgData(divisions);
                    setOrgUnits(normalized);

                    // 2. Auto-find and Force Value
                    const mgmtDiv = normalized.find(d =>
                        d.name.match(/management/i) // Flexible search for "Management"
                    );
                    if (mgmtDiv) {
                        setValue("orgUnitId", mgmtDiv.id);
                    }
                } else {
                    // 3. Normal Manual Fetching
                    if (posId === 1) data = await getDivisions();
                    else if (posId === 2) data = await getDepartments();
                    else if (posId === 3) data = await getSections();
                    else data = await getTeams();

                    setOrgUnits(normalizeOrgData(data));

                    // 4. Clear value when switching FROM position 6 back to manual
                    // This ensures the user must pick a new valid unit.
                    setValue("orgUnitId", "" as any);
                }
            } finally {
                setFetchingUnits(false);
            }
        };
        fetchUnits();
    }, [selectedPosition, setValue]);

    return (
        <Paper
            elevation={0}
            sx={{
                p: { xs: 3, md: 5 },
                borderRadius: 8,
                border: '1px solid rgba(0, 231, 255, 0.2)',
                maxWidth: 850,
                mx: 'auto',
                position: 'relative',
                overflow: 'hidden',
                background: theme.palette.background.gradient,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.05)'
            }}
        >
            {loading && <ButtonClickLoader kanji="登" message="登録中..." />}

            <Box sx={{ mb: 4 }}>
                <Typography variant="h5" sx={{
                    fontWeight: 900,
                    color: 'text.primary',
                }}>
                    Account Registration
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Register a new member to the learning management system.
                </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSuccess)} noValidate>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                    <Controller name="fullName" control={control} render={({ field }) => (
                        <TextField {...field} label="Full Name" fullWidth error={!!errors.fullName} helperText={errors.fullName?.message} sx={{ bgcolor: 'background.paper', borderRadius: 5 }} />
                    )} />

                    <Controller name="email" control={control} render={({ field }) => (
                        <TextField {...field} label="Email Address" fullWidth error={!!errors.email} helperText={errors.email?.message} sx={{ bgcolor: 'background.paper', borderRadius: 5 }} />
                    )} />

                    <Controller name="companyCode" control={control} render={({ field }) => (
                        <TextField {...field} label="Company Code" fullWidth error={!!errors.companyCode} helperText={errors.companyCode?.message} sx={{ bgcolor: 'background.paper', borderRadius: 5 }} />
                    )} />

                    <Controller name="password" control={control} render={({ field }) => (
                        <TextField {...field} label="Temporary Password" type="password" fullWidth error={!!errors.password} helperText={errors.password?.message} sx={{ bgcolor: 'background.paper', borderRadius: 5 }} />
                    )} />

                    <Controller name="position" control={control} render={({ field }) => (
                        <TextField
                            {...field} select label="Role / Position" fullWidth
                            value={field.value ?? ""}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            sx={{ bgcolor: 'background.paper', borderRadius: 5 }}
                        >
                            {POSITIONS.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                        </TextField>
                    )} />

                    <Controller
                        name="orgUnitId"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                label={selectedPosition === 6 || selectedPosition === 7 ? "Assigned Unit (Fixed)" : "Assign to Unit"}
                                fullWidth
                                // Lock only for position 6
                                disabled={!selectedPosition || fetchingUnits || selectedPosition === 6 || selectedPosition === 7}
                                value={field.value ?? ""}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                                sx={{ bgcolor: 'background.paper', borderRadius: 5 }}
                                InputProps={{
                                    endAdornment: fetchingUnits ? <CircularProgress size={20} sx={{ mr: 3 }} /> : null
                                }}
                            >
                                {orgUnits.length > 0 ? (
                                    orgUnits.map((unit) => (
                                        <MenuItem key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled value="">
                                        {fetchingUnits ? "Loading..." : "No units found"}
                                    </MenuItem>
                                )}
                            </TextField>
                        )}
                    />
                </Box>

                <Alert
                    severity="warning"
                    icon={<WarningAmberRounded />}
                    sx={{
                        mt: 4, borderRadius: 3, border: '1px solid #ffe16a',
                        background: 'background.paper',
                        backdropFilter: 'blur(4px)'
                    }}
                >
                    <AlertTitle sx={{ fontWeight: 800 }}>Important Audit Notice</AlertTitle>
                    <Typography variant="caption" display="block">
                        • Full Name and Position can be adjusted in the Admin panel later.
                    </Typography>
                    <Typography variant="body2" color="error.main" sx={{ fontWeight: 800, mt: 1 }}>
                        • Company Code is permanent and cannot be modified after registration.
                    </Typography>
                </Alert>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'background.default', borderRadius: 3, border: `1px dashed ${theme.palette.text.tertiary}` }}>
                    <FormControlLabel
                        control={<Checkbox checked={isConfirmed} onChange={(e) => setIsConfirmed(e.target.checked)} sx={{ color: theme.palette.text.tertiary }} />}
                        label={<Typography variant="body2" sx={{ fontWeight: 500 }}>I confirm all data (especially Company Code) is correct.</Typography>}
                    />
                </Box>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                    <Button onClick={onCancel} color="inherit" disabled={loading} sx={{ fontWeight: 600 }}>Cancel</Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={loading || !isConfirmed}
                        sx={{
                            px: 5, py: 1.5, borderRadius: 10, fontWeight: 800,
                            background: isConfirmed ? 'linear-gradient(90deg, #00b4cc, #00e7ff)' : '#ccc',
                            boxShadow: isConfirmed ? '0 10px 20px rgba(0, 231, 255, 0.3)' : 'none',
                            '&:hover': { background: 'linear-gradient(90deg, #008ba3, #00d4eb)' }
                        }}
                    >
                        Confirm Registration
                    </Button>
                </Stack>
            </form>
        </Paper>
    );
};

export default UserAddForm;