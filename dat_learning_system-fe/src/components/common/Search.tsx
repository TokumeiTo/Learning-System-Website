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
                  <SearchIcon
                    sx={{
                      color: "text.secondary",
                    }}
                  />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: '10px',
                backgroundColor: "background.paper",
                color: "text.primary",

                "& fieldset": {
                  borderColor: "divider",
                },

                "&:hover fieldset": {
                  borderColor: "text.secondary",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },

              "& input::placeholder": {
                color: "text.secondary",
                opacity: 1,
              },
            }}
          />
        )}
      />
    </SearchContainer>
  );
}
