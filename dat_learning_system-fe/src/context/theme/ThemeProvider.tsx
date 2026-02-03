import { createContext, useState, useMemo, useEffect, type ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { getDesignTokens } from "./theme";

type ThemeContextType = {
  mode: "light" | "dark";
  toggleColorMode: () => void;
};

export const CustomThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleColorMode: () => {},
});

export const CustomThemeProvider = ({ children }: { children: ReactNode }) => {
  // 1. Initialize state by checking localStorage first
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const savedMode = localStorage.getItem("app_theme_mode");
    return (savedMode as "light" | "dark") || "light";
  });

  // 2. Wrap the toggle logic to save the new choice
  const toggleColorMode = () => {
    setMode((prev) => {
      const newMode = prev === "light" ? "dark" : "light";
      localStorage.setItem("app_theme_mode", newMode);
      return newMode;
    });
  };

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <CustomThemeContext.Provider value={{ mode, toggleColorMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </CustomThemeContext.Provider>
  );
};