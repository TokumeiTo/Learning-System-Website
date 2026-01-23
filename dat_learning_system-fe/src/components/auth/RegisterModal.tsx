// components/RegisterModal.tsx
import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, MenuItem } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { register as registerApi } from '../../api/auth.api';
import type { RegisterRequest } from "../../types/auth";
import MessagePopup from "../feedback/MessagePopup";
import { POSITIONS } from "../../utils/positions";
import { getDepartments, getDivisions, getSections, getTeams } from "../../api/org.api";

const schema = yup.object({
    fullName: yup.string().required("Full Name is required").max(100),
    email: yup.string().required("Email is required").email("Invalid email format"),
    password: yup.string().required("Password is required").min(6),
    position: yup.string().required("Position is required"),
    companyCode: yup.string().required("Company Code is required"),
    orgUnitId: yup
        .number()
        .required("Organization unit is required")
        .typeError("Organization unit is required"), // <-- added
});

type Props = {
    open: boolean;
    onClose: () => void;
};

type OrgUnitDto = {
    id: number;
    name: string;
};


const RegisterModal: React.FC<Props> = ({ open, onClose }) => {
    const { control, handleSubmit, reset, watch } = useForm<RegisterRequest>({
        resolver: yupResolver(schema),
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
            position: "",
            companyCode: "",
            orgUnitId: -1,
        },
    });

    const [popup, setPopup] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const [orgUnits, setOrgUnits] = useState<OrgUnitDto[]>([]);
    const selectedPosition = watch("position");


    const onSubmit = async (data: RegisterRequest) => {
        try {
            const res = await registerApi(data);
            if (res.isSuccess) {
                setPopup({ open: true, message: res.message, severity: "success" });
                reset(); // clear form
                onClose(); // close modal
            } else {
                setPopup({ open: true, message: res.message, severity: "error" });
            }
        } catch (err: any) {
            setPopup({ open: true, message: err?.response?.data?.message || "Something went wrong", severity: "error" });
        }
    };

    useEffect(() => {
        if (!selectedPosition) {
            setOrgUnits([]);
            return;
        }

        const fetchUnits = async () => {
            switch (Number(selectedPosition)) {
                case 1: // DivHead
                    setOrgUnits(await getDivisions());
                    break;

                case 2: // DepHead
                    setOrgUnits(await getDepartments());
                    break;

                case 3: // SecHead
                    setOrgUnits(await getSections());
                    break;

                case 4: // ProjectManager
                case 5: // Employee
                case 6: // Admin
                case 7: // Auditor
                    setOrgUnits(await getTeams());
                    break;

                default:
                    setOrgUnits([]);
            }
        };

        fetchUnits();
    }, [selectedPosition]);


    return (
        <>
            <Modal open={open} onClose={onClose}>
                <Box sx={{ width: 400, p: 4, bgcolor: "background.paper", mx: "auto", mt: "15%", borderRadius: 2 }}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Controller
                            name="fullName"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Full Name" fullWidth margin="normal" error={!!fieldState.error} helperText={fieldState.error?.message} />
                            )}
                        />
                        <Controller
                            name="email"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Email" fullWidth margin="normal" error={!!fieldState.error} helperText={fieldState.error?.message} />
                            )}
                        />
                        <Controller
                            name="password"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Password" type="password" fullWidth margin="normal" error={!!fieldState.error} helperText={fieldState.error?.message} />
                            )}
                        />
                        <Controller
                            name="companyCode"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField {...field} label="Company Code" fullWidth margin="normal" error={!!fieldState.error} helperText={fieldState.error?.message} />
                            )}
                        />
                        <Controller
                            name="position"
                            control={control}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Position"
                                    fullWidth
                                    margin="normal"
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    error={!!fieldState.error}
                                    helperText={fieldState.error?.message}
                                >
                                    {POSITIONS.map((p) => (
                                        <MenuItem key={p.value} value={p.value}>
                                            {p.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            name="orgUnitId"
                            control={control}
                            rules={{ required: "Organization unit is required" }}
                            render={({ field, fieldState }) => (
                                <TextField
                                    {...field}
                                    select
                                    label="Organization Unit"
                                    fullWidth
                                    margin="normal"
                                    disabled={!selectedPosition}
                                    value={field.value ?? ""}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                    error={!!fieldState.error}
                                    helperText={
                                        fieldState.error?.message ||
                                        (!selectedPosition && "Select position first")
                                    }
                                >
                                    {orgUnits.map((unit) => (
                                        <MenuItem key={unit.id} value={unit.id}>
                                            {unit.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />


                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                            Register
                        </Button>
                    </form>
                </Box>
            </Modal>

            <MessagePopup
                open={popup.open}
                message={popup.message}
                severity={popup.severity}
                onClose={() => setPopup({ ...popup, open: false })}
            />
        </>
    );
};

export default RegisterModal;
