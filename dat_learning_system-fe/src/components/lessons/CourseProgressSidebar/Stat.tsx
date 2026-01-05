import { Box, Typography } from "@mui/material";

export default function Stat({ label, value }: { label: string; value: number }) {
    return (
        <Box textAlign="center">
            <Typography variant="h6" fontWeight={700}>
                {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
                {label}
            </Typography>
        </Box>
    );
}