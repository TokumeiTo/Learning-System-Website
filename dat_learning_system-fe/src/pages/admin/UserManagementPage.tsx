import React, { useEffect, useState, useMemo } from "react";
import {
  Box, Button, TextField, MenuItem, Typography, Paper,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  IconButton, Chip, Stack, InputAdornment, Avatar, CircularProgress, Badge, useTheme
} from "@mui/material";
import { PersonAdd, Search, Edit, Delete, FilterList } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

// APIs & Types
import { register as registerApi } from '../../api/auth.api';
import { getUsersList } from "../../api/user.api";
import type { UserListItem } from "../../types/user";
import { getDepartments, getDivisions, getSections, getTeams } from "../../api/org.api";
import { POSITIONS } from "../../utils/positions";
import type { RegisterRequest } from "../../types/auth";
import MessagePopup from "../../components/feedback/MessagePopup";
import PageLayout from "../../components/layout/PageLayout";

const schema = yup.object({
  fullName: yup.string().required("Full Name is required").max(100),
  email: yup.string().required("Email is required").email("Invalid email format"),
  password: yup.string().required("Password is required").min(6),
  position: yup.number().required("Position is required"),
  companyCode: yup.string().required("Company Code is required"),
  orgUnitId: yup.number().required("Organization unit is required").typeError("Organization unit is required"),
});

interface OrgUnitDto { id: number; name: string; }

const UserManagementPage = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [orgUnits, setOrgUnits] = useState<OrgUnitDto[]>([]);
  const [popup, setPopup] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  const { control, handleSubmit, reset, watch } = useForm<RegisterRequest>({
    resolver: yupResolver(schema),
    defaultValues: { fullName: "", email: "", password: "", position: undefined, companyCode: "", orgUnitId: undefined },
  });

  const selectedPosition = watch("position");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersList();
      setUsers(data);
    } catch (err) {
      setPopup({ open: true, message: "Could not load users", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (!selectedPosition) { setOrgUnits([]); return; }
    const fetchUnits = async () => {
      const pos = Number(selectedPosition);
      if (pos === 1) setOrgUnits(await getDivisions());
      else if (pos === 2) setOrgUnits(await getDepartments());
      else if (pos === 3) setOrgUnits(await getSections());
      else setOrgUnits(await getTeams());
    };
    fetchUnits();
  }, [selectedPosition]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const onSubmit = async (data: RegisterRequest) => {
    try {
      const res = await registerApi(data);
      if (res.isSuccess) {
        setPopup({ open: true, message: "User created successfully!", severity: "success" });
        reset();
        setShowAddForm(false);
        fetchUsers();
      } else {
        setPopup({ open: true, message: res.message, severity: "error" });
      }
    } catch (err: any) {
      setPopup({ open: true, message: "Server error", severity: "error" });
    }
  };

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <PageLayout>
      <Box sx={{ p: 4, bgcolor: "background.default", minHeight: "100vh", transition: '0.3s' }}>
        
        {/* Header Area */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} color="text.primary">User Management</Typography>
            <Typography variant="body2" color="text.secondary">Manage system access and organization hierarchy</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => { setShowAddForm(!showAddForm); if(showAddForm) reset(); }}
            sx={{ borderRadius: 2, px: 3, fontWeight: 700 }}
          >
            {showAddForm ? "View All Users" : "Add New User"}
          </Button>
        </Stack>

        {showAddForm ? (
          /* ADD USER FORM SECTION */
          <Paper elevation={0} sx={{ 
            p: 4, 
            borderRadius: 4, 
            bgcolor: 'background.paper',
            border: `1px solid ${theme.palette.divider}`,
            maxWidth: 800, 
            mx: 'auto' 
          }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>Registration Details</Typography>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <Controller name="fullName" control={control} render={({ field, fieldState }) => (
                  <TextField {...field} label="Full Name" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                )} />
                <Controller name="email" control={control} render={({ field, fieldState }) => (
                  <TextField {...field} label="Email Address" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                )} />
                <Controller name="password" control={control} render={({ field, fieldState }) => (
                  <TextField {...field} label="Temporary Password" type="password" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                )} />
                <Controller name="companyCode" control={control} render={({ field, fieldState }) => (
                  <TextField {...field} label="Company Code" fullWidth error={!!fieldState.error} helperText={fieldState.error?.message} />
                )} />
                <Controller name="position" control={control} render={({ field, fieldState }) => (
                  <TextField 
                    {...field} 
                    select 
                    label="Role / Position" 
                    fullWidth 
                    error={!!fieldState.error} 
                    helperText={fieldState.error?.message}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {POSITIONS.map((p) => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
                  </TextField>
                )} />
                <Controller name="orgUnitId" control={control} render={({ field, fieldState }) => (
                  <TextField 
                    {...field} 
                    select 
                    label="Assign to Unit" 
                    fullWidth 
                    disabled={!selectedPosition} 
                    error={!!fieldState.error} 
                    helperText={fieldState.error?.message || (!selectedPosition && "Select position first")}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  >
                    {orgUnits.map((unit) => <MenuItem key={unit.id} value={unit.id}>{unit.name}</MenuItem>)}
                  </TextField>
                )} />
              </Box>
              <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
                <Button onClick={() => setShowAddForm(false)} color="inherit">Cancel</Button>
                <Button type="submit" variant="contained" sx={{ px: 4, borderRadius: 2 }}>Confirm Registration</Button>
              </Stack>
            </form>
          </Paper>
        ) : (
          /* USER LIST TABLE SECTION */
          <Box>
            <Paper elevation={0} sx={{ 
              p: 2, mb: 3, borderRadius: 3, 
              bgcolor: 'background.paper',
              border: `1px solid ${theme.palette.divider}`, 
              display: 'flex', gap: 2 
            }}>
              <TextField
                placeholder="Search by name or email..."
                size="small"
                sx={{ flex: 1 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment> }}
              />
              <Button startIcon={<FilterList />} variant="outlined" color="inherit">Filters</Button>
            </Paper>

            <TableContainer component={Paper} elevation={0} sx={{ 
                borderRadius: 4, 
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                backgroundImage: 'none'
            }}>
              <Table>
                <TableHead sx={{ bgcolor: theme.palette.background.gray }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Full Name</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Position</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <CircularProgress size={24} sx={{ mr: 2 }} />
                        <Typography variant="body2" color="text.secondary" display="inline">Loading users...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                        <Typography color="text.disabled">No users found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id} hover sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                        <TableCell>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
                              <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '0.85rem', fontWeight: 700 }}>
                                {getInitials(user.fullName)}
                              </Avatar>
                            </Badge>
                            <Typography variant="subtitle2" fontWeight={700} color="text.primary">{user.fullName}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell color="text.secondary">{user.email}</TableCell>
                        <TableCell>
                          <Chip 
                            label={user.position} 
                            size="small" 
                            sx={{ 
                                fontWeight: 800, 
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(61, 167, 253, 0.15)' : 'rgba(25, 118, 210, 0.1)', 
                                color: 'primary.main',
                                fontSize: '0.7rem'
                            }} 
                          />
                        </TableCell>
                        <TableCell color="text.secondary">{user.orgUnitName}</TableCell>
                        <TableCell align="right">
                          <IconButton size="small" sx={{ color: 'text.secondary' }}><Edit fontSize="small" /></IconButton>
                          <IconButton size="small" color="error"><Delete fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        <MessagePopup
          open={popup.open} message={popup.message} severity={popup.severity}
          onClose={() => setPopup({ ...popup, open: false })}
        />
      </Box>
    </PageLayout>
  );
};

export default UserManagementPage;