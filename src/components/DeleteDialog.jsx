import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Divider,
  CircularProgress,
} from '@mui/material';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';

const DeleteDialog = ({ open, onClose, onConfirm, user, loading }) => {
  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar sx={{ bgcolor: 'error.lighter', color: 'error.main', width: 36, height: 36 }}>
            <WarningAmberRoundedIcon fontSize="small" />
          </Avatar>
          <Typography variant="h6" fontWeight={600}>
            Delete User
          </Typography>
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <Typography variant="body2" color="text.secondary" lineHeight={1.7}>
          Are you sure you want to delete{' '}
          <Typography component="span" fontWeight={600} color="text.primary">
            {fullName}
          </Typography>
          ? This action cannot be undone.
        </Typography>
        <Box
          mt={2}
          p={1.5}
          bgcolor="error.50"
          borderRadius={2}
          border="1px solid"
          borderColor="error.100"
          sx={{ bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239,68,68,0.1)' : '#FEF2F2',
                borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(239,68,68,0.3)' : '#FECACA' }}
        >
          <Typography variant="caption" color="error.main" fontWeight={500}>
            {user.email}
          </Typography>
        </Box>
      </DialogContent>
      <Divider />
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          disabled={loading}
          size="small"
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          disabled={loading}
          size="small"
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
        >
          {loading ? 'Deleting…' : 'Delete User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
