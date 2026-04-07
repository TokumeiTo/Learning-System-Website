import { useEffect, useState } from "react";
import {
  Box, Button, TextField, Typography, Paper, IconButton, Chip, Stack,
  InputAdornment, Avatar, Badge, useTheme, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem, TablePagination
} from "@mui/material";
import { PersonAdd, Search, Edit, Delete } from "@mui/icons-material";

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
import { useAuth } from "../../hooks/useAuth";

const UserManagementPage = () => {
  const theme = useTheme();
  // Extract isAdmin from useAuth
  const { user: currentUser, isAdmin } = useAuth();

  // State Management
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterUnitId, setFilterUnitId] = useState<number | "">("");
  const [filterPosition, setFilterPosition] = useState<number | "">("");
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  // Targets for Modals
  const [editTarget, setEditTarget] = useState<UserListItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserListItem | null>(null);

  const [popup, setPopup] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false, message: "", severity: "success",
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsersList(
        searchTerm,
        filterUnitId === "" ? undefined : filterUnitId,
        filterPosition === "" ? undefined : filterPosition,
        page + 1,
        pageSize
      );
      setUsers(data.items);
      setTotalCount(data.totalCount);
    } catch (err) {
      setPopup({ open: true, message: "Could not load users", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, filterUnitId, filterPosition, page, pageSize]);

  useEffect(() => {
    setPage(0);
  }, [searchTerm, filterUnitId, filterPosition]);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAddUser = async (data: RegisterRequest) => {
    try {
      setProcessing(true);
      const res = await registerApi(data);
      if (res.isSuccess) {
        setPopup({ open: true, message: res.message, severity: "success" });
        setShowAddForm(false);
        fetchUsers();
      } else {
        setPopup({ open: true, message: res.message || "Registration failed", severity: "error" });
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Server error during registration";
      setPopup({ open: true, message: errorMsg, severity: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const handleUpdateUser = async (id: string, data: UserUpdateFields) => {
    try {
      setProcessing(true);
      const res = await updateUser(id, data);
      setPopup({ open: true, message: res.message, severity: "success" });
      setEditTarget(null);
      fetchUsers();
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Update failed";
      setPopup({ open: true, message: errorMsg, severity: "error" });
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async (id: string, data: UserDeleteFields) => {
    try {
      setProcessing(true);
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
      <Box sx={{ px: 4, display: 'flex', flexDirection: 'column' }}>

        {/* Header Section */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={900} color="text.primary">User Management</Typography>
            <Typography variant="body2" color="text.secondary">Manage system access and organization hierarchy</Typography>
          </Box>
          
          {/* 1. HIDE ADD BUTTON IF NOT ADMIN */}
          {isAdmin && (
            <Button
              variant="contained"
              startIcon={showAddForm ? null : <PersonAdd />}
              onClick={() => setShowAddForm(!showAddForm)}
              sx={{ borderRadius: 2, px: 3, fontWeight: 700, transition: 'all 0.2s' }}
            >
              {showAddForm ? "Back to User List" : "Add New User"}
            </Button>
          )}
        </Stack>

        {showAddForm && isAdmin ? (
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
                placeholder="Name, Email, UserId"
                size="small"
                sx={{ flex: 1 }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>
                }}
              />
              {/* Position and Team Filters remain visible to all for directory purposes */}
              <FormControl size="small" sx={{ flex: 1 }}>
                <InputLabel id="position-filter-label">Position</InputLabel>
                <Select
                  labelId="position-filter-label"
                  label="Position"
                  value={filterPosition}
                  onChange={(e) => setFilterPosition(e.target.value as number | "")}
                >
                  <MenuItem value="">All Positions</MenuItem>
                  <MenuItem value={1}>Division Heads</MenuItem>
                  <MenuItem value={2}>Department Heads</MenuItem>
                  <MenuItem value={3}>Section Heads</MenuItem>
                  <MenuItem value={4}>Project Managers</MenuItem>
                  <MenuItem value={5}>Employee</MenuItem>
                  <MenuItem value={6}>Admin</MenuItem>
                  <MenuItem value={7}>Auditors</MenuItem>
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
                  <MenuItem value={11}>Translator Team</MenuItem>
                  <MenuItem value={9}>Other Local System Team</MenuItem>
                  <MenuItem value={21}>Exchange System Team</MenuItem>
                  <MenuItem value={22}>Common Application Infrastructure Team</MenuItem>
                  <MenuItem value={23}>JICA BPO Team</MenuItem>
                  <MenuItem value={24}>MAJA JLPT System Development Team</MenuItem>
                  <MenuItem value={26}>System Team</MenuItem>
                  <MenuItem value={27}>Network Team</MenuItem>
                  <MenuItem value={28}>Service Desk Team</MenuItem>
                  <MenuItem value={29}>OMG Team</MenuItem>
                  <MenuItem value={31}>Aeon Infra Team</MenuItem>
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

            <TableContainer component={Paper} elevation={0} sx={{
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              maxHeight: 'calc(100vh - 300px)'
            }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 800 }}>Full Name</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Contact</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Position</TableCell>
                    <TableCell sx={{ fontWeight: 800 }}>Unit</TableCell>
                    {/* 2. ONLY SHOW ACTIONS HEADER IF ADMIN */}
                    {isAdmin && <TableCell sx={{ fontWeight: 800 }} align="right">Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={isAdmin ? 5 : 4} align="center" sx={{ py: 10 }}>
                        <CircularProgress size={30} thickness={4} />
                      </TableCell>
                    </TableRow>
                  ) : users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                            {getInitials(user.fullName)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={700}>{user.fullName}</Typography>
                            <Typography variant="caption" color="text.secondary">{user.companyCode}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip label={user.positionName} size="small" color="primary" variant="outlined" />
                      </TableCell>
                      <TableCell>{user.orgUnitName || "—"}</TableCell>
                      
                      {/* 3. CONDITIONALLY RENDER ACTION BUTTONS */}
                      {isAdmin && (
                        <TableCell align="right">
                          {user.id !== currentUser?.id ? (
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <IconButton size="small" onClick={() => setEditTarget(user)}>
                                <Edit fontSize="small" />
                              </IconButton>
                              <IconButton size="small" color="error" onClick={() => setDeleteTarget(user)}>
                                <Delete fontSize="small" />
                              </IconButton>
                            </Stack>
                          ) : (
                            <Chip label="You" size="small" variant="outlined" sx={{ opacity: 0.6 }} />
                          )}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <TablePagination
                component="div"
                count={totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={pageSize}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5, 10, 25]}
                sx={{ borderTop: `1px solid ${theme.palette.divider}` }}
              />
            </TableContainer>
          </Box>
        )}

        {/* Dialogs remain for state management, but won't trigger if targets are null */}
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