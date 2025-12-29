import { Box, CircularProgress, Typography } from "@mui/material";

type Props = {
  value: number;
};

export default function ProgressCircle({ value }: Props) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={100}
        size={120}
        sx={{ color: "grey.300" }}
      />
      <CircularProgress
        variant="determinate"
        value={value}
        size={120}
        sx={{ position: "absolute", left: 0 }}
      />
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography fontWeight="bold">{value}%</Typography>
      </Box>
    </Box>
  );
}
