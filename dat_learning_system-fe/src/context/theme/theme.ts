import type { Theme, ThemeOptions } from "@mui/material/styles";

export const getDesignTokens = (mode: "light" | "dark"): ThemeOptions => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                primary: { main: "#1976d2" },
                background: {
                    default: "#f5f5f5",
                    paper: "#f8fafc",
                    toolbar: "#0080ffff",
                    blur: "rgba(200, 213, 255, 0.43)",
                    gray: "#dcdcdcff",
                    // Sakura Light Shape: Pink petals + Cyan glow + White base
                    gradient: `
                        radial-gradient(circle at 10% 10%, rgba(255, 183, 197, 0.2) 0%, transparent 25%),
                        radial-gradient(circle at 15% 5%, rgba(255, 183, 197, 0.15) 0%, transparent 20%),
                        radial-gradient(at 0% 0%, rgba(0, 231, 255, 0.12) 0%, transparent 40%), 
                        linear-gradient(135deg, #fdf2f4 0%, #ffffff 50%, #f0fdff 100%)
                    `,
                },
                text: { 
                    primary: "#333", 
                    secondary: "#666", 
                    tertiary: "#6200ffff",
                    disabled: "#999"
                },
            }
            : {
                primary: { main: "#3da7fd" },
                background: {
                    default: "#0b1220",
                    paper: "#111827",
                    toolbar: "#000d26",
                    blur: "#000d2641",
                    gray: "#000000ff",
                    // Dark Mode: Deep Midnight + Pink petal glow + Cyan accents
                    gradient: `
                        radial-gradient(circle at 10% 10%, rgba(255, 105, 180, 0.08) 0%, transparent 25%),
                        radial-gradient(circle at 15% 5%, rgba(0, 231, 255, 0.05) 0%, transparent 20%),
                        radial-gradient(at 100% 100%, rgba(0, 231, 255, 0.1) 0%, transparent 50%),
                        linear-gradient(135deg, #0b1220 0%, #111827 50%, #080e1a 100%)
                    `,
                },
                text: {
                    primary: "#fff",
                    secondary: "#9e9e9eff",
                    tertiary: "#00e7ff",
                    disabled: "#585858ff"
                },
            }),
    },

    typography: {
        fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    },

    components: {
        MuiCssBaseline: {
            styleOverrides: (theme: Theme) => ({
                body: {
                    background: theme.palette.background.gradient,
                    backgroundAttachment: "fixed",
                    minHeight: "100vh",
                    margin: 0,
                    transition: "background 0.3s ease-in-out",
                },
            }),
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: "none",
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: ({ theme }: { theme: Theme }) => ({
                    backgroundColor: theme.palette.mode === "dark" ? "#1f2937" : "#f8fafc",
                    color: theme.palette.text.secondary,
                    fontWeight: 700,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }),
                root: {
                    padding: "16px",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme }: { theme: Theme }) => ({
                    borderRadius: 8,
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "0 4px 20px rgba(0, 0, 0, 0.5)"
                            : "0 2px 12px rgba(0, 0, 0, 0.08)",
                    backgroundImage: "none",
                }),
            },
        },
    },
});