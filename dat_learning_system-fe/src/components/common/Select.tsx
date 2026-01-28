import React from 'react';
import { 
  Box, 
  InputLabel, 
  MenuItem, 
  FormControl, 
  Select, 
  type SelectChangeEvent,
  Typography
} from '@mui/material';
import { useAuth } from '../../hooks/useAuth';
import { MdOutlineSchool, MdOutlineSettingsSuggest } from 'react-icons/md';

interface BasicSelectProps {
  value: string;
  onChange: (val: string) => void;
}

export default function BasicSelect({ value, onChange }: BasicSelectProps) {
  const { user } = useAuth();

  // Define roles that are allowed to see the Management Mode
  const canManage = ['SuperAdmin', 'DivHead', 'DepHead', 'Admin'].includes(user?.position || '');

  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <Box sx={{ display: "flex", justifyContent: 'center', width: '90%', px: 2, mb: 1 }}>
      <FormControl variant="standard" fullWidth sx={{ mt: 1 }}>
        <InputLabel id="category-select-label" sx={{ fontSize: '0.8rem' }}>
          Workspace
        </InputLabel>
        <Select
          labelId="category-select-label"
          id="category-select"
          value={value}
          onChange={handleChange}
          label="Workspace"
          sx={{
            fontSize: '0.8rem',
            fontWeight: 500,
            '& .MuiSelect-select': {
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }
          }}
        >
          <MenuItem value="learn" sx={{display: 'flex', gap:0.8}}>
            <MdOutlineSchool size={18} color="#1976d2" />
            <Typography variant="inherit">Learning Mode</Typography>
          </MenuItem>

          {/* Conditional rendering based on user role */}
          {canManage && (
            <MenuItem value="manage" sx={{display: 'flex', gap:0.8}}>
              <MdOutlineSettingsSuggest size={18} color="#ed6c02" />
              <Typography variant="inherit">Management Mode</Typography>
            </MenuItem>
          )}
        </Select>
      </FormControl>
    </Box>
  );
}