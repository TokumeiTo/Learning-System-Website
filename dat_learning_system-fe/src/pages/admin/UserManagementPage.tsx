import { useEffect, useState, useMemo } from "react";
import {
  Box, Button, TextField, Typography, Paper, IconButton, Chip, Stack,
  InputAdornment, Avatar, Badge, useTheme, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { PersonAdd, Search, Edit, Delete, FilterList } from "@mui/icons-material";

// Components
import UserAddForm from "../../components/user/UserAddForm";
import UserEditDialog from "../../components/user/UserEditDialog";
import UserDeleteDialog from "../../components/user/UserDeleteDialog";
import MessagePopup from "../../components/feedback/MessagePopup";
import PageLayout from "../../components/layout/PageLayout";

// APIs & Types
import { register as registerApi } from '../../api/auth.api';
import { getUsersList, updateUser, deleteUser } from "../../api/user.api";
import type { UserListItem, UserUpdateFields, UserDeleteFields } from "../../types_interfaces/user";
import type { RegisterRequest } from "../../types_interfaces/auth";

const UserManagementPage = () => {
  const theme = useTheme();

  // State Management
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterUnitId, setFilterUnitId] = useState<number | "">("");
  const [filterPosition, setFilterPosition] = useState<number | "">("");

  // Targets for Modals
  const [editTarget, setEditTarget] = useState<UserListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserListItem | null>(null);

  const [popup, setPopup] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  // 1. Fetch Users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersList(
        searchTerm,
        filterUnitId === "" ? undefined : filterUnitId,
        filterPosition === "" ? undefined : filterPosition
      );
      setUsers(data);
    } catch (err) {
      setPopup({ open: true, message: "Could not load users", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300); // 300ms debounce prevents hitting the server too hard while typing

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterUnitId, filterPosition]);

  // 2. Filter Logic
  const filteredUsers = useMemo(() => {
    return users.filter(u =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  // 3. Action Handlers
  const handleAddUser = async (data: RegisterRequest) => {
    try {
      setProcessing(true);

      const res = await registerApi(data);

      if (res.isSuccess) {
        // Use the message from the backend: e.g., "User registered successfully!"
        setPopup({ open: true, message: res.message, severity: "success" });
        setShowAddForm(false);
        fetchUsers();
      } else {
        setPopup({ open: true, message: res.message || "Registration failed", severity: "error" });
      }
    } catch (err: any) {
      // 3. Handle actual HTTP errors (400 BadRequest, 401 Unauthorized, etc.)
      // We pull the error message sent by .NET (like ModelState validation errors)
      const errorMsg = err.response?.data?.message || "Server error during registration";
      setPopup({ open: true, message: errorMsg, severity: "error" });

      console.error("Registration Error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateUser = async (id: string, data: UserUpdateFields) => {
    try {
      setProcessing(true);
      // Call API and capture the result (Ok(new { message = "..." }))
      const res = await updateUser(id, data);

      setPopup({ open: true, message: res.message, severity: "success" });
      setEditTarget(null);
      fetchUsers();
    } catch (err: any) {
      // Pull the specific error message from the backend if it exists
      const errorMsg = err.response?.data?.message || "Update failed";
      setPopup({ open: true, message: errorMsg, severity: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (id: string, data: UserDeleteFields) => {
    try {
      setProcessing(true);
      // Same pattern: Capture the backend response message
      const res = await deleteUser(id, data);

      setPopup({ open: true, message: res.message, severity: "success" });
      setDeleteTarget(null);
      fetchUsers();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Delete failed";
      setPopup({ open: true, message: errorMsg, severity: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const getInitials = (name: string) =>
    name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <PageLayout>
      <Box sx={{
        p: 4,
        bgcolor: "background.default",
        minHeight: "calc(100vh - 65px)",
        display: 'flex',
        flexDirection: 'column'
      }}>

        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} color="text.primary">User Management</Typography>
            <Typography variant="body2" color="text.secondary">Manage system access and organization hierarchy</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={showAddForm ? null : <PersonAdd />}
            onClick={() => setShowAddForm(!showAddForm)}
            sx={{ borderRadius: 2, px: 3, fontWeight: 700, transition: 'all 0.2s' }}
          >
            {showAddForm ? "Back to User List" : "Add New User"}
          </Button>
        </Stack>

        {showAddForm ? (
          <UserAddForm
            onSuccess={handleAddUser}
            onCancel={() => setShowAddForm(false)}
            loading={processing}
          />
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            {/* Search and Filters */}
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
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                }}
              />
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel id="position-filter-label">Position</InputLabel>
                <Select
                  labelId="position-filter-label"
                  label="Position"
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value as number | "")}
                >
                  <MenuItem value="">All Positions</MenuItem>
                  <MenuItem value={1}>Division Head</MenuItem>
                  <MenuItem value={2}>Department Head</MenuItem>
                  <MenuItem value={5}>Employee</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel id="team-filter-label">Team</InputLabel>
                <Select
                  labelId="team-filter-label"
                  label="Team"
                  value={filterUnitId}
                  onChange={(e) => setFilterUnitId(e.target.value as number | "")}
                >
                  <MenuItem value="">All Units</MenuItem>
                  {/* --- Offshore & Development Units --- */}
                  <MenuItem value={11}>Translator Team</MenuItem>
                  <MenuItem value={9}>Other Local System Team</MenuItem>
                  <MenuItem value={21}>Exchange System Team</MenuItem>
                  <MenuItem value={22}>Common Application Infrastructure Team</MenuItem>
                  <MenuItem value={23}>JICA BPO Team</MenuItem>
                  <MenuItem value={24}>MAJA JLPT System Development Team</MenuItem>

                  {/* --- System & Infrastructure Teams --- */}
                  <MenuItem value={26}>System Team</MenuItem>
                  <MenuItem value={27}>Network Team</MenuItem>
                  <MenuItem value={28}>Service Desk Team</MenuItem>
                  <MenuItem value={29}>OMG Team</MenuItem>
                  <MenuItem value={31}>Aeon Infra Team</MenuItem>

                  {/* --- Project & Development Teams --- */}
                  <MenuItem value={30}>Local Project Team 1</MenuItem>
                  <MenuItem value={33}>Mark Team</MenuItem>
                  <MenuItem value={34}>SNR-MF Team</MenuItem>
                  <MenuItem value={36}>FPD Team</MenuItem>
                  <MenuItem value={37}>DBP Team</MenuItem>
                  <MenuItem value={39}>TDB, D-Base Team</MenuItem>
                  <MenuItem value={40}>CstNavi Team</MenuItem>
                  <MenuItem value={41}>Delta Team</MenuItem>
                  <MenuItem value={42}>OSS Team</MenuItem>
                  <MenuItem value={43}>MODOS Team</MenuItem>
                  <MenuItem value={44}>Block Chain Team</MenuItem>
                  <MenuItem value={45}>WB4 Team</MenuItem>
                  <MenuItem value={46}>SONAR-FR Team</MenuItem>
                  <MenuItem value={47}>FAIMS-IT Team</MenuItem>
                  <MenuItem value={48}>KOSMO-Network21 Team</MenuItem>
                  <MenuItem value={49}>WEB Team</MenuItem>
                  <MenuItem value={50}>KOSMO-NEXT Team</MenuItem>
                  <MenuItem value={51}>HIME Team</MenuItem>
                  <MenuItem value={52}>SoftPhone Team</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="text"
                color="inherit"
                onClick={() => { setSearchTerm(""); setFilterPosition(""); setFilterUnitId(""); }}
                sx={{ fontWeight: 700 }}
              >
                Reset
              </Button>
            </Paper>

            {/* Main Table */}
            <TableContainer component={Paper} elevation={0} sx={{
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              maxHeight: 'calc(100vh - 300px)' // Sticky header support
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800, bgcolor: 'action.hover' }}>Full Name</TableCell>
                    <TableCell sx={{ fontWeight: 800, bgcolor: 'action.hover' }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 800, bgcolor: 'action.hover' }}>Position</TableCell>
                    <TableCell sx={{ fontWeight: 800, bgcolor: 'action.hover' }}>Unit</TableCell>
                    <TableCell sx={{ fontWeight: 800, bgcolor: 'action.hover' }} align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                        <CircularProgress size={30} thickness={4} />
                        <Typography sx={{ mt: 2 }} variant="body2" color="text.secondary">Loading directory...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                        <Typography variant="body1" color="text.secondary">No users found matching your criteria.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : users.map((user) => (
                    <TableRow key={user.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
                            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontWeight: 700, fontSize: '0.9rem' }}>
                              {getInitials(user.fullName)}
                            </Avatar>
                          </Badge>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700} sx={{ lineHeight: 1.2 }}>{user.fullName}</Typography>
                            <Typography variant="caption" color="text.secondary">{user.companyCode}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.primary">{user.email}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={user.positionName}
                          size="small"
                          sx={{
                            fontWeight: 700,
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(144, 202, 249, 0.1)' : 'rgba(25, 118, 210, 0.05)',
                            color: 'primary.main',
                            border: '1px solid rgba(25, 118, 210, 0.1)'
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">{user.orgUnitName || "—"}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            size="small"
                            onClick={() => setEditTarget(user)}
                            sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(25, 118, 210, 0.05)' } }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteTarget(user)}
                            sx={{ '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.05)' } }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Action Dialogs */}
        <UserEditDialog
          open={!!editTarget}
          user={editTarget}
          onClose={() => setEditTarget(null)}
          onConfirm={handleUpdateUser}
          loading={processing}
        />

        <UserDeleteDialog
          open={!!deleteTarget}
          user={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDeleteUser}
          loading={processing}
        />

        <MessagePopup
          open={popup.open} message={popup.message} severity={popup.severity}
          onClose={() => setPopup({ ...popup, open: false })}
        />
      </Box>
    </PageLayout>
  );
};

export default UserManagementPage;