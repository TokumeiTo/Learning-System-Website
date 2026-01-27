import type { Theme } from "@mui/material/styles";

export const getDesignTokens = (mode: "light" | "dark") => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                primary: { main: "#1976d2" },
                secondary: { main: "#ff9800" },
                background: {
                    default: "#f5f5f5",
                    paper: "#f8fafc",
                    toolbar: '#0080ffff',
                    blur: 'rgba(200, 213, 255, 0.43)',
                    gray: '#dcdcdcff',
                },
                text: { primary: "#333", secondary: "#666", tertiary: '#6200ffff' },
            }
            : {
                primary: { main: "#3da7fd" },
                secondary: { main: "#fbc02d" },
                background: {
                    default: "#0b1220",
                    paper: "#111827",
                    toolbar: '#000d26',
                    blur: '#000d2641',
                    gray: '#000000ff'
                },
                text: { primary: "#fff", secondary: "#9e9e9eff", tertiary: '#00e7ff', disabled: '#585858ff' },
            }),
    },

    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    },

    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },

        MuiCard: {
            styleOverrides: {
                root: ({ theme }: { theme: Theme }) => ({
                    borderRadius: 5,
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "0 3px 11px rgba(92, 178, 247, 0.6)"
                            : theme.shadows[3],
                }),
            },
        },
    },
});
