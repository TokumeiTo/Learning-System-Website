import { Box, CircularProgress, Typography } from "@mui/material";

type Props = {
  value: number;
};

export default function ProgressCircle({ value }: Props) {
  return (
    <>
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
          sx={{ position: "absolute", left: 0, filter: "drop-shadow(0 0 10px rgba(0, 174, 255, 1))" }}
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
          <Typography fontWeight="bold" sx={{ userSelect: 'none' }}>{value}%</Typography>
        </Box>
      </Box>
    </>
  );
}
