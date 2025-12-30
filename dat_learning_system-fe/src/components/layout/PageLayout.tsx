import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children }) => {
  const [open, setOpen] = useState(true);
  const toggleSidebar = () => setOpen(!open);

  return (
    // Full-page flex container
    <Box sx={{ display: 'flex', flexDirection: 'row', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar open={open} onClose={toggleSidebar} />
      
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar open={open} onToggle={toggleSidebar} />

        {/* Main content grows with content */}
        <Box
          component="main"
          sx={{
            mt: '64px',       // offset for fixed Navbar
            flexGrow: 1,      // take remaining space
            bgcolor: 'background.paper',
            p: 3,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PageLayout;
