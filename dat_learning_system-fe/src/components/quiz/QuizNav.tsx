import { Box, Card, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useContext } from "react";
import { CustomThemeContext } from "../../context/theme/ThemeProvider";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';


interface QuizNavProps {
    level: string;
    type: string;
}

export default function QuizNav({ level, type }: QuizNavProps) {
    const navigate = useNavigate();
    const { mode, toggleColorMode } = useContext(CustomThemeContext);
    const theme = useTheme();

    return (
        <>
            {/* Header */}
            <Card sx={{
                display: "flex",
                alignItems: "center",
                mb: 5, p: 1,
                justifyContent: 'space-between',
                bgcolor: theme.palette.background.toolbar
            }}>
                <Box sx={{ display: 'flex' }} >
                    <IconButton sx={{ mr: 2 }} onClick={() => navigate(-1)}>
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                    <Typography variant="h4" sx={{ fontWeight: "bold", color: theme.palette.text.tertiary }}>
                        {level} – {type}
                    </Typography>
                </Box>
                <IconButton
                    aria-label="dark/light mode"
                    onClick={toggleColorMode}
                    size="large"
                    sx={{ color: theme.palette.text.tertiary }} // set custom color here
                >
                    {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>

            </Card>
        </>
    )

}