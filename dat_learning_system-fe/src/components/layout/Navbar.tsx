import React, { useContext } from 'react';
import { CustomThemeContext } from '../../context/theme/ThemeProvider';
import { useNotifications } from '../../context/NotificationContext'; // 1. Import the hook

import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  Toolbar, IconButton, Badge, ButtonGroup,
  styled, useTheme, useMediaQuery,
  Box
} from '@mui/material';

import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  open: boolean;
  onToggle: () => void;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'isMobile'
})<AppBarProps & { isMobile?: boolean }>(({ theme, open, isMobile }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && !isMobile && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Navbar: React.FC<NavbarProps> = ({ open, onToggle }) => {
  const { mode, toggleColorMode } = useContext(CustomThemeContext);

  const navigate = useNavigate();
  const { unreadCount, resetCount } = useNotifications();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleBellClick = () => {
    // Logic: Navigate to inbox OR just clear the badge
    resetCount();
    navigate('/notifications');
  };

  return (
    <AppBar position="fixed" open={open} isMobile={isMobile}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', boxShadow: '5px 0 10px rgba(0, 132, 255, 0.2)' }}>
        <IconButton
          color="inherit"
          onClick={onToggle}
          edge="start"
          sx={{
            marginRight: 2,
            display: isMobile || open ? "none" : "inline-flex",
          }}
        >
          <MenuIcon />
        </IconButton>

        <Box sx={{ width: '100%' }}>
          <img src="/dat_logo.png" width={60} alt="logo" />
        </Box>

        <ButtonGroup>
          <IconButton
            color="inherit"
            aria-label="dark/light mode"
            onClick={toggleColorMode}
            size="large"
          >
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          {/* 3. ACTIVATED BELL ICON */}
          <IconButton
            size="large"
            aria-label={`show ${unreadCount} new notifications`}
            color="inherit"
            onClick={handleBellClick}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </ButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;