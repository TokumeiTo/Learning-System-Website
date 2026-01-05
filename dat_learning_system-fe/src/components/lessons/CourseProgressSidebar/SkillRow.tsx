import { Box, Stack, Typography } from "@mui/material";

export default function SkillRow({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" fontWeight={600}>
          {label}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {value}%
        </Typography>
      </Stack>

      <Box
        sx={{
          mt: 0.5,
          height: 6,
          borderRadius: 4,
          bgcolor: "rgba(255,255,255,0.12)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            height: "100%",
            width: `${value}%`,
            bgcolor: "primary.main",
            transition: "width 0.4s ease",
          }}
        />
      </Box>
    </Box>
  );
}
