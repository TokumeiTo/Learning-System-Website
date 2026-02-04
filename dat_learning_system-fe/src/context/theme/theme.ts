import type { Theme } from "@mui/material/styles";

export const getDesignTokens = (mode: "light" | "dark") => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                primary: { main: "#1976d2" },
                background: {
                    default: "#f5f5f5",
                    paper: "#f8fafc",
                    toolbar: '#0080ffff',
                    blur: 'rgba(200, 213, 255, 0.43)',
                    gray: '#dcdcdcff',
                    gradient: `radial-gradient(at 0% 0%, rgba(25, 118, 210, 0.15) 0%, transparent 50%), 
                        linear-gradient(135deg, #e2e8f0 0%, #ffffff 50%, #cbd5e1 100%)`,
                },
                text: { primary: "#333", secondary: "#666", tertiary: '#6200ffff' },
            }
            : {
                primary: { main: "#3da7fd" },
                background: {
                    default: "#0b1220",
                    paper: "#111827",
                    toolbar: '#000d26',
                    blur: '#000d2641',
                    gray: '#000000ff',
                    gradient: 'radial-gradient(circle at 2% 10%, #000d2641 0%, transparent 40%)', // Dark glow
                },
                text: {
                    primary: "#fff",
                    secondary: "#9e9e9eff",
                    tertiary: '#00e7ff',
                    disabled: '#585858ff'
                },
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
        // --- Added Table Overrides for Audit Log look ---
        MuiTableCell: {
            styleOverrides: {
                head: ({ theme }: { theme: Theme }) => ({
                    backgroundColor: theme.palette.mode === 'dark' ? '#1f2937' : '#f8fafc',
                    color: theme.palette.text.secondary,
                    fontWeight: 700,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                }),
                root: {
                    padding: '16px',
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: ({ theme }: { theme: Theme }) => ({
                    borderRadius: 8, // Increased slightly for a modern look
                    boxShadow:
                        theme.palette.mode === "dark"
                            ? "0 3px 11px rgba(0, 0, 0, 0.5)" // Subtler shadow for dark mode
                            : theme.shadows[1],
                    backgroundImage: "none",
                }),
            },
        },
    },
});