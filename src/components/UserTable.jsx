import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Typography,
  Skeleton,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import { getDepartmentColor } from '../utils/helpers';

const COLUMNS = [
  { id: 'id', label: 'ID', sortable: false, width: 60 },
  { id: 'firstName', label: 'First Name', sortable: true },
  { id: 'lastName', label: 'Last Name', sortable: true },
  { id: 'email', label: 'Email', sortable: true },
  { id: 'department', label: 'Department', sortable: true },
  { id: 'actions', label: 'Actions', sortable: false, align: 'center' },
];

const getInitials = (firstName, lastName) =>
  `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase();

const AVATAR_COLORS = [
  '#2563EB', '#7C3AED', '#DB2777', '#DC2626',
  '#D97706', '#059669', '#0891B2', '#4F46E5',
];

const getAvatarColor = (id) => AVATAR_COLORS[(id - 1) % AVATAR_COLORS.length];

// ──────────────────────────────────────────────
// Loading skeleton rows
// ──────────────────────────────────────────────
const SkeletonRows = ({ count = 8 }) =>
  Array.from({ length: count }).map((_, i) => (
    <TableRow key={i}>
      <TableCell><Skeleton variant="text" width={30} /></TableCell>
      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={80} />
        </Box>
      </TableCell>
      <TableCell><Skeleton variant="text" width={80} /></TableCell>
      <TableCell><Skeleton variant="text" width={160} /></TableCell>
      <TableCell><Skeleton variant="rounded" width={70} height={24} /></TableCell>
      <TableCell align="center">
        <Box display="flex" justifyContent="center" gap={0.5}>
          <Skeleton variant="circular" width={30} height={30} />
          <Skeleton variant="circular" width={30} height={30} />
        </Box>
      </TableCell>
    </TableRow>
  ));

// ──────────────────────────────────────────────
// Empty state
// ──────────────────────────────────────────────
const EmptyState = ({ hasSearch }) => (
  <TableRow>
    <TableCell colSpan={6}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        py={8}
        gap={1.5}
      >
        <PeopleOutlineRoundedIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
        <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
          {hasSearch ? 'No users match your search' : 'No users found'}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          {hasSearch
            ? 'Try adjusting your filters or search term'
            : 'Add your first user to get started'}
        </Typography>
      </Box>
    </TableCell>
  </TableRow>
);

// ──────────────────────────────────────────────
// Mobile card view
// ──────────────────────────────────────────────
const MobileCard = ({ user, onEdit, onDelete }) => (
  <Card variant="outlined" sx={{ mb: 1.5, borderRadius: 2 }}>
    <CardContent sx={{ pb: 1 }}>
      <Box display="flex" alignItems="center" gap={1.5} mb={1}>
        <Avatar sx={{ bgcolor: getAvatarColor(user.id), width: 40, height: 40, fontSize: '0.875rem' }}>
          {getInitials(user.firstName, user.lastName)}
        </Avatar>
        <Box flex={1} minWidth={0}>
          <Typography variant="subtitle2" fontWeight={600} noWrap>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary" noWrap>
            {user.email}
          </Typography>
        </Box>
        <Chip
          label={user.department}
          color={getDepartmentColor(user.department)}
          size="small"
          variant="outlined"
        />
      </Box>
      <Typography variant="caption" color="text.disabled">
        ID #{user.id}
      </Typography>
    </CardContent>
    <Divider />
    <CardActions sx={{ justifyContent: 'flex-end', py: 0.5 }}>
      <Tooltip title="Edit user">
        <IconButton size="small" color="primary" onClick={() => onEdit(user)}>
          <EditRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Delete user">
        <IconButton size="small" color="error" onClick={() => onDelete(user)}>
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </CardActions>
  </Card>
);

// ──────────────────────────────────────────────
// Main UserTable component
// ──────────────────────────────────────────────
const UserTable = ({ users, loading, onEdit, onDelete, hasSearch }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('firstName');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSort = (columnId) => {
    const isAsc = orderBy === columnId && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(columnId);
    setPage(0);
  };

  const sorted = useMemo(() => {
    if (!orderBy) return users;
    return [...users].sort((a, b) => {
      const valA = (a[orderBy] || '').toString().toLowerCase();
      const valB = (b[orderBy] || '').toString().toLowerCase();
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, order, orderBy]);

  const paginated = useMemo(
    () => sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sorted, page, rowsPerPage]
  );

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  // ── Mobile layout ──
  if (isMobile) {
    return (
      <Box>
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} variant="outlined" sx={{ mb: 1.5, borderRadius: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1.5}>
                    <Skeleton variant="circular" width={40} height={40} />
                    <Box flex={1}>
                      <Skeleton variant="text" width="60%" />
                      <Skeleton variant="text" width="80%" />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))
          : paginated.length === 0
          ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              py={8}
              gap={1.5}
            >
              <PeopleOutlineRoundedIcon sx={{ fontSize: 56, color: 'text.disabled' }} />
              <Typography variant="subtitle1" fontWeight={600} color="text.secondary">
                {hasSearch ? 'No users match your search' : 'No users found'}
              </Typography>
            </Box>
          )
          : paginated.map((user) => (
              <MobileCard
                key={user.id}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
        {!loading && sorted.length > 0 && (
          <TablePagination
            component="div"
            count={sorted.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[10, 25, 50, 100]}
            sx={{ borderTop: '1px solid', borderColor: 'divider' }}
          />
        )}
      </Box>
    );
  }

  // ── Desktop layout ──
  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <TableContainer>
        <Table size="medium" stickyHeader>
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <TableCell
                  key={col.id}
                  align={col.align || 'left'}
                  sx={{
                    width: col.width,
                    bgcolor: (t) =>
                      t.palette.mode === 'dark' ? '#1E293B' : '#F8FAFC',
                    borderBottom: '2px solid',
                    borderColor: 'divider',
                    color: 'text.secondary',
                    py: 1.5,
                  }}
                >
                  {col.sortable ? (
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={orderBy === col.id ? order : 'asc'}
                      onClick={() => handleSort(col.id)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <SkeletonRows count={8} />
            ) : paginated.length === 0 ? (
              <EmptyState hasSearch={hasSearch} />
            ) : (
              paginated.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    '&:last-child td': { borderBottom: 0 },
                    transition: 'background 0.15s',
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" color="text.disabled" fontWeight={500}>
                      #{user.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Avatar
                        sx={{
                          bgcolor: getAvatarColor(user.id),
                          width: 32,
                          height: 32,
                          fontSize: '0.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {getInitials(user.firstName, user.lastName)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={500}>
                        {user.firstName}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{user.lastName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.department}
                      color={getDepartmentColor(user.department)}
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center" gap={0.5}>
                      <Tooltip title="Edit user">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => onEdit(user)}
                          sx={{ '&:hover': { bgcolor: 'primary.50' } }}
                        >
                          <EditRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete user">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => onDelete(user)}
                          sx={{ '&:hover': { bgcolor: 'error.50' } }}
                        >
                          <DeleteOutlineRoundedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {!loading && sorted.length > 0 && (
        <TablePagination
          component="div"
          count={sorted.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            bgcolor: (t) => (t.palette.mode === 'dark' ? '#1E293B' : '#F8FAFC'),
          }}
        />
      )}
    </Paper>
  );
};

export default UserTable;
