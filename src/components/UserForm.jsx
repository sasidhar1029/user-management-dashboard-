import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Box,
  Avatar,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import CloseIcon from '@mui/icons-material/Close';
import { DEPARTMENTS } from '../utils/helpers';
import { validateUserForm, hasErrors } from '../utils/validation';

const defaultValues = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
};

const UserForm = ({ open, onClose, onSubmit, editUser, loading }) => {
  const isEdit = Boolean(editUser);
  const [values, setValues] = useState(defaultValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (open) {
      if (isEdit && editUser) {
        setValues({
          firstName: editUser.firstName || '',
          lastName: editUser.lastName || '',
          email: editUser.email || '',
          department: editUser.department || '',
        });
      } else {
        setValues(defaultValues);
      }
      setErrors({});
      setTouched({});
    }
  }, [open, isEdit, editUser]);

  const handleChange = (field) => (e) => {
    const newValues = { ...values, [field]: e.target.value };
    setValues(newValues);
    if (touched[field]) {
      const newErrors = validateUserForm(newValues);
      setErrors(newErrors);
    }
  };

  const handleBlur = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const newErrors = validateUserForm(values);
    setErrors(newErrors);
  };

  const handleSubmit = () => {
    const allTouched = Object.fromEntries(
      Object.keys(defaultValues).map((k) => [k, true])
    );
    setTouched(allTouched);
    const newErrors = validateUserForm(values);
    setErrors(newErrors);
    if (hasErrors(newErrors)) return;
    onSubmit(values);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Avatar
            sx={{
              bgcolor: isEdit ? 'secondary.main' : 'primary.main',
              width: 36,
              height: 36,
            }}
          >
            {isEdit ? (
              <EditRoundedIcon fontSize="small" />
            ) : (
              <PersonAddAltRoundedIcon fontSize="small" />
            )}
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {isEdit ? 'Edit User' : 'Add New User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {isEdit ? 'Update user information' : 'Fill in the details below'}
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={onClose} disabled={loading} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2.5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              fullWidth
              size="small"
              value={values.firstName}
              onChange={handleChange('firstName')}
              onBlur={handleBlur('firstName')}
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
              placeholder="Enter first name"
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              size="small"
              value={values.lastName}
              onChange={handleChange('lastName')}
              onBlur={handleBlur('lastName')}
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
              placeholder="Enter last name"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email Address"
              fullWidth
              size="small"
              type="email"
              value={values.email}
              onChange={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              placeholder="name@company.com"
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Department"
              fullWidth
              size="small"
              select
              value={values.department}
              onChange={handleChange('department')}
              onBlur={handleBlur('department')}
              error={touched.department && Boolean(errors.department)}
              helperText={touched.department && errors.department}
              required
            >
              <MenuItem value="" disabled>
                Select a department
              </MenuItem>
              {DEPARTMENTS.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  {dept}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
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
          onClick={handleSubmit}
          disabled={loading}
          color={isEdit ? 'secondary' : 'primary'}
          size="small"
          startIcon={loading ? <CircularProgress size={14} color="inherit" /> : null}
        >
          {loading
            ? isEdit
              ? 'Saving…'
              : 'Adding…'
            : isEdit
            ? 'Save Changes'
            : 'Add User'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;
