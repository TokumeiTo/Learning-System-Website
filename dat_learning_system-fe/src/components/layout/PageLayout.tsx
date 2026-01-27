import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AppLoader from "../feedback/AppLoader";
import { useTheme } from "@mui/material";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const toggleSidebar = () => setOpen((o) => !o);

  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  /* Minimum loader duration */
  useEffect(() => {
    const MIN_DURATION = 500;
    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const delay = Math.max(0, MIN_DURATION - elapsed);
      setTimeout(() => setLoading(false), delay);
    };

    finish();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: 'row',
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Sidebar */}
      <Sidebar open={open} onClose={toggleSidebar} />

      {/* Right content */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar open={open} onToggle={toggleSidebar} />

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.paper",
            paddingTop: '65px',
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Children Loader */}
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 100 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ width: "100%" }}
              >
                <AppLoader fullscreen={false} />
              </motion.div>
            ) : (
              <Box
                component={motion.div}
                key="content"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                sx={{
                  width: "100%",
                  maxWidth: "100%",
                  scrollbarWidth: "none",
                  scrollbarColor: "transparent transparent",
                  transition: "scrollbar-color 0.3s, scrollbar-width 0.3s",

                  "&:hover": {
                    scrollbarWidth: "thin",
                    scrollbarColor: `#008cffff ${theme.palette.background.paper}`,
                  },

                  "&::-webkit-scrollbar": {
                    width: 6,
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "transparent",
                    borderRadius: 8,
                  },
                  "&:hover::-webkit-scrollbar-thumb": {
                    backgroundColor: "#008cffff",
                  },
                }}
              >
                {children}
              </Box>

            )}
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
};

export default PageLayout;
