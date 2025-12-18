import { styled } from "@mui/material/styles";
import {
  Autocomplete,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

type SearchOption = {
  label: string;
};

type Props = {
  placeholder?: string;
  options: SearchOption[];
  onSelect?: (value: string) => void;
};

const SearchContainer = styled(Box)(() => ({
  width: "100%",
  maxWidth: 360,
}));

export default function SearchBar({
  placeholder = "Search…",
  options,
  onSelect,
}: Props) {
  return (
    <SearchContainer>
      <Autocomplete
        freeSolo
        options={options}
        onChange={(_, value) => {
          if (typeof value === "string") {
            onSelect?.(value);
          } else if (value) {
            onSelect?.(value.label);
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            size="small"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20",
                backgroundColor: "#fff",
              },
            }}
          />
        )}
      />
    </SearchContainer>
  );
}
