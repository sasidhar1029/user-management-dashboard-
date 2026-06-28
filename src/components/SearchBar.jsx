import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { debounce } from '../utils/helpers';

const SearchBar = ({ onSearch, value: externalValue }) => {
  const [inputValue, setInputValue] = useState(externalValue || '');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((val) => {
      onSearch(val);
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    setInputValue(externalValue || '');
  }, [externalValue]);

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    debouncedSearch(val);
  };

  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: { xs: '100%', sm: 360 } }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by name, email, or department…"
        value={inputValue}
        onChange={handleChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" color="action" />
            </InputAdornment>
          ),
          endAdornment: inputValue ? (
            <InputAdornment position="end">
              <Tooltip title="Clear search">
                <IconButton size="small" onClick={handleClear} edge="end">
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: 2,
            bgcolor: 'background.paper',
          },
        }}
      />
    </Box>
  );
};

export default SearchBar;
