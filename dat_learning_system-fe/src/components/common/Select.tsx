import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';

export default function BasicSelect() {
    const [sub, setSub] = React.useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setSub(event.target.value as string);
    };

    return (
        <Box sx={{ display: "flex", justifyContent: 'center', minWidth: 170}}>
            <FormControl variant="standard" sx={{ minWidth: 170 }}>
                <InputLabel id="demo-simple-select-standard-label">Learn</InputLabel>
                <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={sub}
                    onChange={handleChange}
                    label="Learn"
                >
                    <MenuItem value={10}>IT</MenuItem>
                    <MenuItem value={20}>English</MenuItem>
                    <MenuItem value={30}>Japanese</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}
