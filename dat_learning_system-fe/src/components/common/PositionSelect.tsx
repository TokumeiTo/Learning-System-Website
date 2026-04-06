import { Autocomplete, TextField, Chip } from "@mui/material";
import { Position } from '../../types_interfaces/positions';

interface Props {
  value: number[]; // Array of position enums (0, 1, 2...)
  onChange: (val: number[]) => void;
}

const PositionSelect = ({ value, onChange }: Props) => {
  // Get the names (SuperAdmin, DivHead, etc.) from the object keys
  // We filter out the numeric keys because reverse-mappings can appear in some JS objects
  const positionEntries = Object.entries(Position) as [string, number][];

  return (
    <Autocomplete
      multiple
      options={positionEntries}
      // 'option' is [string, number] e.g. ["Admin", 6]
      getOptionLabel={(option) => option[0]} 
      // Compare the numeric value (option[1]) with our current value array
      value={positionEntries.filter(([, val]) => value.includes(val))}
      onChange={(_, newValue) => {
        // Extract just the numbers to send back to the parent/API
        onChange(newValue.map(([, val]) => val));
      }}
      isOptionEqualToValue={(option, value) => option[1] === value[1]}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label="Target Positions" 
          placeholder="Select Roles" 
          variant="outlined" 
        />
      )}
      renderTags={(tagValue, getTagProps) =>
        tagValue.map((option, index) => (
          <Chip 
            label={option[0]} 
            {...getTagProps({ index })} 
            size="small" 
            color="primary" 
            variant="outlined" 
          />
        ))
      }
    />
  );
};

export default PositionSelect;