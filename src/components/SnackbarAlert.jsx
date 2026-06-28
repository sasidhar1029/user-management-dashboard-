import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

const SlideTransition = (props) => <Slide {...props} direction="up" />;

const SnackbarAlert = ({ open, onClose, severity = 'success', message, autoHideDuration = 4000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        elevation={6}
        sx={{ width: '100%', borderRadius: 2, fontWeight: 500 }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarAlert;
