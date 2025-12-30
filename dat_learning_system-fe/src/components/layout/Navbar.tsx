import React from 'react';
import { useContext } from "react";
import { CustomThemeContext } from '../../context/theme/ThemeProvider';

import MuiAppBar from '@mui/material/AppBar';
import type { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import { styled } from '@mui/material/styles';

import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Badge from '@mui/material/Badge';
import ButtonGroup from '@mui/material/ButtonGroup';
import TranslateIcon from '@mui/icons-material/Translate';
import LightModeIcon from '@mui/icons-material/LightMode';

interface NavbarProps {
  open: boolean;
  onToggle: () => void;
}

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, { shouldForwardProp: (prop) => prop !== 'open' })<AppBarProps>(
  ({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);

const Navbar: React.FC<NavbarProps> = ({ open, onToggle }) => {
  const { mode, toggleColorMode } = useContext(CustomThemeContext);

  return (
    <AppBar position="fixed" open={open}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', boxShadow:'5px 0 10px rgba(0, 132, 255, 1)' }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={onToggle}
          edge="start"
          sx={{ marginRight: 5, ...(open && { display: 'none' }) }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap component="div">
          <TipsAndUpdatesIcon sx={{ marginRight: 1 }} />
          HLMS
        </Typography>

        <ButtonGroup>
          <IconButton
            color="inherit"
            aria-label="translate page"
            size="large"
          >
            <TranslateIcon />
          </IconButton>

          {/* DARK / LIGHT MODE TOGGLE */}
          <IconButton
            color="inherit"
            aria-label="dark/light mode"
            onClick={toggleColorMode}   // toggles light/dark theme
            size="large"
          >
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>

          <IconButton
            size="large"
            aria-label="show 17 new notifications"
            color="inherit"
          >
            <Badge badgeContent={17} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </ButtonGroup>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
