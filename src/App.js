import React, { useState, useMemo } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
          primary: {
            main: '#2563EB',
            light: '#3B82F6',
            dark: '#1D4ED8',
          },
          secondary: {
            main: '#7C3AED',
            light: '#8B5CF6',
            dark: '#6D28D9',
          },
          error: {
            main: '#EF4444',
          },
          warning: {
            main: '#F59E0B',
          },
          success: {
            main: '#10B981',
          },
          background: {
            default: darkMode ? '#0F172A' : '#F1F5F9',
            paper: darkMode ? '#1E293B' : '#FFFFFF',
          },
          text: {
            primary: darkMode ? '#F1F5F9' : '#0F172A',
            secondary: darkMode ? '#94A3B8' : '#64748B',
          },
        },
        typography: {
          fontFamily: "'Inter', sans-serif",
          h4: { fontWeight: 700 },
          h5: { fontWeight: 600 },
          h6: { fontWeight: 600 },
          subtitle1: { fontWeight: 500 },
          button: { textTransform: 'none', fontWeight: 500 },
        },
        shape: {
          borderRadius: 10,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                padding: '8px 18px',
                fontWeight: 600,
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none',
              },
            },
          },
          MuiTableHead: {
            styleOverrides: {
              root: {
                '& .MuiTableCell-head': {
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                },
              },
            },
          },
          MuiChip: {
            styleOverrides: {
              root: {
                fontWeight: 500,
                borderRadius: 6,
              },
            },
          },
        },
      }),
    [darkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="app-container">
        <Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />
      </div>
    </ThemeProvider>
  );
}

export default App;
