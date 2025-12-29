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
    <Box sx={{ display: 'flex', minHeight: '100vh'}}>
      <Sidebar open={open} onClose={toggleSidebar} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Navbar open={open} onToggle={toggleSidebar} />
        <Box component="main" sx={{ mt: "64px" }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PageLayout;
