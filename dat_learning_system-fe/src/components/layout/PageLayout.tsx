import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { motion, AnimatePresence } from "framer-motion";

import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AppLoader from "../feedback/AppLoader";
import AnnouncementBanner from "../announcement/AnnouncementBanner";
import { useTheme, Container } from "@mui/material";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const toggleSidebar = () => setOpen((o) => !o);

  const [loading, setLoading] = useState(true);

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
        bgcolor: "background.gradient",
      }}
    >
      <Sidebar open={open} onClose={toggleSidebar} />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Navbar open={open} onToggle={toggleSidebar} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: "background.gradient",
            paddingTop: '65px',
            position: "relative",
            display: "flex",
            flexDirection: "column", // Changed to column to stack Banner + Content
            alignItems: "center",
          }}
        >
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
                <AppLoader fullscreen={true} />
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
                  flex: 1,
                  overflowY: "auto", // Handle scrolling here
                  // ... your existing scrollbar styles ...
                }}
              >
                {/* --- ANNOUNCEMENT AREA --- */}
                {/* We use a Container to keep the banner aligned with your content width */}
                <Container maxWidth="lg" sx={{ mt: 2, bgcolor:'background.paper'}}>
                   <AnnouncementBanner />
                </Container>

                {/* --- PAGE CHILDREN --- */}
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