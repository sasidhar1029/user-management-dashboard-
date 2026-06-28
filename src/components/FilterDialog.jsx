import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  IconButton,
  Divider,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import { DEPARTMENTS } from '../utils/helpers';

const defaultFilters = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
};

const FilterDialog = ({ open, onClose, onApply, activeFilters }) => {
  const [filters, setFilters] = useState(defaultFilters);

  useEffect(() => {
    if (open) {
      setFilters(activeFilters || defaultFilters);
    }
  }, [open, activeFilters]);

  const handleChange = (field) => (e) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    onApply(defaultFilters);
    onClose();
  };

  const activeCount = Object.values(activeFilters || {}).filter(Boolean).length;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterListIcon color="primary" />
          <Typography variant="h6">Filter Users</Typography>
          {activeCount > 0 && (
            <Typography
              variant="caption"
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                borderRadius: '50%',
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.7rem',
              }}
            >
              {activeCount}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
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
              value={filters.firstName}
              onChange={handleChange('firstName')}
              placeholder="Filter by first name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              fullWidth
              size="small"
              value={filters.lastName}
              onChange={handleChange('lastName')}
              placeholder="Filter by last name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              fullWidth
              size="small"
              value={filters.email}
              onChange={handleChange('email')}
              placeholder="Filter by email"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Department"
              fullWidth
              size="small"
              select
              value={filters.department}
              onChange={handleChange('department')}
            >
              <MenuItem value="">All Departments</MenuItem>
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
        <Button variant="outlined" onClick={handleReset} color="error" size="small">
          Reset Filters
        </Button>
        <Button variant="contained" onClick={handleApply} size="small">
          Apply Filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
