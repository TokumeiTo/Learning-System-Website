import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { CustomThemeProvider } from "./context/theme/ThemeProvider";

// 1. Import QueryClient and Provider
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Fonts
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// 2. Initialize the QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // This prevents unnecessary background refetches while you're coding
      refetchOnWindowFocus: false, 
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* 3. Wrap everything with QueryClientProvider */}
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <AuthProvider>
          <CustomThemeProvider>
            <App />
          </CustomThemeProvider>
        </AuthProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  </StrictMode>
);