import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, MenuItem, Switch, FormControlLabel, Box, Chip, Typography,
    Tooltip,
    IconButton,
    Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs, { Dayjs } from 'dayjs';
import { Position } from '../../types_interfaces/positions';
import { scheduleApi } from '../../api/schedule.api';
import type { SchedulePlan, SchedulePlanUpsert, ActivityType } from '../../types_interfaces/schedule';
import MessagePopup from '../feedback/MessagePopup';

interface Props {
    plan: SchedulePlan | null; // Null means "Create New"
    initialDate?: Dayjs | null;
    onClose: () => void;
    onSuccess: () => void;
}

const ScheduleDialog = ({ plan, initialDate, onClose, onSuccess }: Props) => {
    const [formData, setFormData] = useState<SchedulePlanUpsert>({
        title: '',
        description: '',
        activityType: 'LECTURE',
        startTime: initialDate
            ? initialDate.hour(9).minute(0).format('YYYY-MM-DDTHH:mm')
            : dayjs().format('YYYY-MM-DDTHH:mm'),
        endTime: dayjs().add(1, 'hour').format('YYYY-MM-DDTHH:mm'),
        location: 'Online',
        color: '#6366f1',
        isPublic: false,
        targetPositions: [],
        targetUserCodes: []
    });
    const [popUp, setPopUp] = useState<{
        open: boolean;
        message: string;
        severity: "success" | "error";
    }>({
        open: false,
        message: "",
        severity: "success",
    });
    const [userCodeInput, setUserCodeInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Sync if editing an existing plan
    useEffect(() => {
        if (plan) {
            setFormData({
                ...plan,
                startTime: dayjs(plan.startTime).format('YYYY-MM-DDTHH:mm'),
                endTime: plan.endTime ? dayjs(plan.endTime).format('YYYY-MM-DDTHH:mm') : '',
            });
        }
    }, [plan]);

    const handleClosePopup = () => setPopUp({ ...popUp, open: false });

    const handleSave = async () => {
        setErrors({});
        try {
            if (plan) {
                await scheduleApi.updatePlan(plan.id, formData);
            } else {
                await scheduleApi.createPlan(formData);
            }
            onSuccess();
            onClose();
        } catch (err: any) {
            // Check if it's a 400 Validation Error
            if (err.response?.status === 400 && err.response.data?.errors) {
                const validationErrors = err.response.data.errors;
                const newErrors: Record<string, string> = {};

                // ASP.NET returns errors as { "Title": ["Title is required"], "EndTime": [...] }
                Object.keys(validationErrors).forEach((key) => {
                    // Convert PascalCase from backend to camelCase for frontend if needed
                    const fieldName = key.charAt(0).toLowerCase() + key.slice(1);
                    newErrors[fieldName] = validationErrors[key][0];
                });
                setErrors(newErrors);
            } else {
                console.error("Save failed", err);
            }
        }
    };

    const handleDelete = async () => {
        if (!plan) return;
        if (window.confirm(`Are you sure you want to delete "${plan.title}"?`)) {
            try {
                await scheduleApi.deletePlan(plan.id);
                onSuccess();
                onClose();
            } catch (err) {
                console.error("Delete failed", err);
            }
        }
    };

    const addTargetUserCode = () => {
        if (userCodeInput && !formData.targetUserCodes.includes(userCodeInput)) {
            setFormData({ ...formData, targetUserCodes: [...formData.targetUserCodes, userCodeInput] });
            setUserCodeInput('');
        }
    };

    return (
        <>
            <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{plan ? 'Edit Schedule' : 'Create New Plan'}</span>
                    {plan && (
                        <Tooltip title="Delete this plan">
                            <IconButton onClick={handleDelete} color="error">
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    )}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Title"
                            fullWidth
                            required
                            value={formData.title}
                            onChange={(e) => {
                                setFormData({ ...formData, title: e.target.value });
                                if (errors.title) setErrors({ ...errors, title: '' }); // Clear error on type
                            }}
                            error={!!errors.title}
                            helperText={errors.title || `${formData.title.length}/100`}
                            inputProps={{ maxLength: 100 }}
                        />

                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Course Name (Optional)"
                                fullWidth
                                value={formData.courseName || ''}
                                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                                inputProps={{ maxLength: 150 }}
                            />
                            <TextField
                                label="Instructor Name (Optional)"
                                fullWidth
                                value={formData.instructorName || ''}
                                onChange={(e) => setFormData({ ...formData, instructorName: e.target.value })}
                                inputProps={{ maxLength: 100 }}

                            />
                        </Stack>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                select
                                label="Type"
                                sx={{ flex: 1 }}
                                value={formData.activityType}
                                onChange={(e) => setFormData({ ...formData, activityType: e.target.value as ActivityType })}
                            >
                                {['LECTURE', 'LAB', 'EXAM', 'MEETING', 'HOLIDAY', 'DEADLINE'].map((t) => (
                                    <MenuItem key={t} value={t}>{t}</MenuItem>
                                ))}
                            </TextField>
                            <input
                                type="color"
                                value={formData.color}
                                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                style={{ width: '50px', height: '56px', border: '1px solid #ccc', borderRadius: '4px' }}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Start Time"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.startTime}
                                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                            />
                            <TextField
                                label="End Time (Optional)"
                                type="datetime-local"
                                fullWidth
                                InputLabelProps={{ shrink: true }}
                                value={formData.endTime}
                                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                            />
                        </Box>

                        <TextField
                            label="Location"
                            placeholder="e.g. Zoom, Meeting Room A"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            inputProps={{ maxLength: 200 }}
                        />

                        <FormControlLabel
                            control={<Switch checked={formData.isPublic} onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })} />}
                            label="Is Public (Visible to everyone)"
                        />

                        {!formData.isPublic && (
                            <>
                                <Typography variant="subtitle2" sx={{ mb: -1 }}>Targeted Roles</Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {Object.entries(Position)
                                        .filter(([k]) => isNaN(Number(k)))
                                        .map(([name, val]) => (
                                            <Chip
                                                key={val}
                                                label={name}
                                                clickable
                                                color={formData.targetPositions.includes(val as any) ? "primary" : "default"}
                                                onClick={() => {
                                                    const current = formData.targetPositions;
                                                    const next = current.includes(val as any)
                                                        ? current.filter(p => p !== val)
                                                        : [...current, val as any];
                                                    setFormData({ ...formData, targetPositions: next });
                                                }}
                                            />
                                        ))}
                                </Box>

                                <Typography variant="subtitle2" sx={{ mb: -1 }}>Target Specific Users (Company Codes)</Typography>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <TextField
                                        size="small"
                                        placeholder="Enter Code..."
                                        value={userCodeInput}
                                        onChange={(e) => setUserCodeInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && addTargetUserCode()}
                                    />
                                    <Button variant="outlined" onClick={addTargetUserCode}>Add</Button>
                                </Box>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {formData.targetUserCodes.map(code => (
                                        <Chip
                                            key={code}
                                            label={code}
                                            onDelete={() => setFormData({ ...formData, targetUserCodes: formData.targetUserCodes.filter(c => c !== code) })}
                                        />
                                    ))}
                                </Box>
                            </>
                        )}

                        <TextField
                            label="Description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            inputProps={{ maxLength: 500 }}
                            helperText={errors.description || `${(formData.description ?? '').length}/500`}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="inherit">Cancel</Button>
                    <Button onClick={handleSave} variant="contained" color="primary">
                        {plan ? 'Update' : 'Create'} Schedule
                    </Button>
                </DialogActions>
            </Dialog>

            <MessagePopup
                open={popUp.open}
                message={popUp.message}
                severity={popUp.severity}
                onClose={handleClosePopup}
            />
        </>
    );
};

export default ScheduleDialog;