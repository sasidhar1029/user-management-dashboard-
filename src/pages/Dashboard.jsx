import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Tooltip,
  Badge,
  Chip,
  Paper,
  Grid,
  Divider,
  Alert,
  AlertTitle,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import FilterListRoundedIcon from '@mui/icons-material/FilterListRounded';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';

import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';
import DeleteDialog from '../components/DeleteDialog';
import SearchBar from '../components/SearchBar';
import FilterDialog from '../components/FilterDialog';
import SnackbarAlert from '../components/SnackbarAlert';

import { fetchUsers, createUser, updateUser, deleteUser } from '../services/userService';
import { mapApiUserToUiUser, includesCI, generateTempId, DEPARTMENTS, assignDepartment } from '../utils/helpers';

const defaultFilters = { firstName: '', lastName: '', email: '', department: '' };

const Dashboard = ({ darkMode, setDarkMode }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // ── Data state ──
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ── UI state ──
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(defaultFilters);
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);

  // ── Snackbar state ──
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  // ── Fetch users ──
  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data.map(mapApiUserToUiUser));
    } catch (err) {
      setError(err.message || 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // ── Filtered + searched users ──
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        !searchTerm ||
        includesCI(user.firstName, searchTerm) ||
        includesCI(user.lastName, searchTerm) ||
        includesCI(user.email, searchTerm) ||
        includesCI(user.department, searchTerm);

      const matchesFilters =
        (!filters.firstName || includesCI(user.firstName, filters.firstName)) &&
        (!filters.lastName || includesCI(user.lastName, filters.lastName)) &&
        (!filters.email || includesCI(user.email, filters.email)) &&
        (!filters.department || user.department === filters.department);

      return matchesSearch && matchesFilters;
    });
  }, [users, searchTerm, filters]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length,
    [filters]
  );

  // ── Department stats ──
  const deptStats = useMemo(() => {
    const counts = {};
    DEPARTMENTS.forEach((d) => (counts[d] = 0));
    users.forEach((u) => {
      if (counts[u.department] !== undefined) counts[u.department]++;
    });
    return counts;
  }, [users]);

  // ── Add user ──
  const handleAddUser = useCallback(
    async (formValues) => {
      setActionLoading(true);
      try {
        const payload = {
          name: `${formValues.firstName} ${formValues.lastName}`,
          email: formValues.email,
        };
        const created = await createUser(payload);
        const tempId = generateTempId();
        const newUser = {
          id: created.id || tempId,
          firstName: formValues.firstName,
          lastName: formValues.lastName,
          email: formValues.email,
          department: formValues.department,
        };
        setUsers((prev) => [newUser, ...prev]);
        setFormOpen(false);
        showSnackbar(`${formValues.firstName} ${formValues.lastName} added successfully!`, 'success');
      } catch (err) {
        showSnackbar(err.message || 'Failed to add user.', 'error');
      } finally {
        setActionLoading(false);
      }
    },
    [showSnackbar]
  );

  // ── Edit user ──
  const handleEditUser = useCallback(
    async (formValues) => {
      if (!editUser) return;
      setActionLoading(true);
      try {
        await updateUser(editUser.id, {
          name: `${formValues.firstName} ${formValues.lastName}`,
          email: formValues.email,
        });
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editUser.id
              ? { ...u, ...formValues }
              : u
          )
        );
        setFormOpen(false);
        setEditUser(null);
        showSnackbar(`${formValues.firstName} ${formValues.lastName} updated successfully!`, 'success');
      } catch (err) {
        showSnackbar(err.message || 'Failed to update user.', 'error');
      } finally {
        setActionLoading(false);
      }
    },
    [editUser, showSnackbar]
  );

  // ── Delete user ──
  const handleDeleteUser = useCallback(async () => {
    if (!userToDelete) return;
    setActionLoading(true);
    try {
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setDeleteDialogOpen(false);
      showSnackbar(
        `${userToDelete.firstName} ${userToDelete.lastName} deleted.`,
        'info'
      );
      setUserToDelete(null);
    } catch (err) {
      showSnackbar(err.message || 'Failed to delete user.', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [userToDelete, showSnackbar]);

  // ── Open handlers ──
  const openAdd = () => {
    setEditUser(null);
    setFormOpen(true);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setFormOpen(true);
  };

  const openDelete = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const hasSearch = Boolean(searchTerm || activeFilterCount);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* ── AppBar ── */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ gap: 1 }}>
          <Box display="flex" alignItems="center" gap={1} sx={{ flexGrow: 1 }}>
            <PeopleRoundedIcon color="primary" />
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ display: { xs: 'none', sm: 'block' }, letterSpacing: '-0.02em' }}
            >
              User Management
            </Typography>
            <Typography
              variant="h6"
              fontWeight={700}
              sx={{ display: { xs: 'block', sm: 'none' }, letterSpacing: '-0.02em' }}
            >
              Users
            </Typography>
          </Box>
          <Tooltip title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
            <IconButton onClick={() => setDarkMode((d) => !d)} size="small" color="inherit">
              {darkMode ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh">
            <IconButton onClick={loadUsers} size="small" color="inherit" disabled={loading}>
              <RefreshRoundedIcon />
            </IconButton>
          </Tooltip>
          {!isMobile && (
            <Button
              variant="contained"
              startIcon={<AddRoundedIcon />}
              onClick={openAdd}
              size="small"
            >
              Add User
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 3 } }}>

        {/* ── Error banner ── */}
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2, borderRadius: 2 }}
            action={
              <Button color="inherit" size="small" onClick={loadUsers}>
                Retry
              </Button>
            }
          >
            <AlertTitle>Failed to load users</AlertTitle>
            {error}
          </Alert>
        )}

        {/* ── Stats row ── */}
        {!loading && !error && (
          <Grid container spacing={1.5} sx={{ mb: 2.5 }}>
            <Grid item xs={6} sm={4} md={2}>
              <Paper
                variant="outlined"
                sx={{ p: 1.5, borderRadius: 2, textAlign: 'center' }}
              >
                <Typography variant="h5" fontWeight={700} color="primary.main">
                  {users.length}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Total Users
                </Typography>
              </Paper>
            </Grid>
            {DEPARTMENTS.map((dept) => (
              <Grid item xs={6} sm={4} md={2} key={dept}>
                <Paper
                  variant="outlined"
                  sx={{ p: 1.5, borderRadius: 2, textAlign: 'center' }}
                >
                  <Typography variant="h5" fontWeight={700} color="text.primary">
                    {deptStats[dept] || 0}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {dept}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}

        {/* ── Toolbar: Search + Filter + Add ── */}
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          flexWrap="wrap"
          mb={2}
        >
          <SearchBar onSearch={setSearchTerm} value={searchTerm} />
          <Tooltip title="Advanced filters">
            <Badge badgeContent={activeFilterCount} color="primary" overlap="circular">
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterListRoundedIcon />}
                onClick={() => setFilterDialogOpen(true)}
                sx={{ flexShrink: 0 }}
              >
                {isMobile ? 'Filter' : 'Filters'}
              </Button>
            </Badge>
          </Tooltip>
          {isMobile && (
            <Button
              variant="contained"
              size="small"
              startIcon={<AddRoundedIcon />}
              onClick={openAdd}
              sx={{ ml: 'auto' }}
            >
              Add
            </Button>
          )}
        </Box>

        {/* ── Active filter chips ── */}
        {activeFilterCount > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.75} mb={1.5}>
            {Object.entries(filters)
              .filter(([, v]) => Boolean(v))
              .map(([key, val]) => (
                <Chip
                  key={key}
                  label={`${key.replace(/([A-Z])/g, ' $1')}: ${val}`}
                  size="small"
                  onDelete={() => {
                    const next = { ...filters, [key]: '' };
                    setFilters(next);
                  }}
                  color="primary"
                  variant="outlined"
                  sx={{ textTransform: 'capitalize', fontSize: '0.72rem' }}
                />
              ))}
            <Chip
              label="Clear all"
              size="small"
              onClick={() => setFilters(defaultFilters)}
              color="default"
              variant="outlined"
              sx={{ fontSize: '0.72rem' }}
            />
          </Box>
        )}

        {/* ── Result count ── */}
        {!loading && (
          <Box display="flex" alignItems="center" gap={1} mb={1.5}>
            <GroupsRoundedIcon fontSize="small" color="action" />
            <Typography variant="body2" color="text.secondary">
              Showing{' '}
              <strong>{filteredUsers.length}</strong> of {users.length} users
            </Typography>
          </Box>
        )}

        {/* ── Main table ── */}
        <UserTable
          users={filteredUsers}
          loading={loading}
          onEdit={openEdit}
          onDelete={openDelete}
          hasSearch={hasSearch}
        />
      </Container>

      {/* ── Dialogs ── */}
      <UserForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditUser(null);
        }}
        onSubmit={editUser ? handleEditUser : handleAddUser}
        editUser={editUser}
        loading={actionLoading}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setUserToDelete(null);
        }}
        onConfirm={handleDeleteUser}
        user={userToDelete}
        loading={actionLoading}
      />

      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onApply={setFilters}
        activeFilters={filters}
      />

      <SnackbarAlert
        open={snackbar.open}
        onClose={closeSnackbar}
        severity={snackbar.severity}
        message={snackbar.message}
      />
    </Box>
  );
};

export default Dashboard;
