import * as React from "react";
import { styled, useTheme, type Theme, type CSSObject } from "@mui/material/styles";
import {
  Box, List, Divider, IconButton, ListItemButton,
  ListItemIcon, ListItemText, Typography, useMediaQuery
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import { NavLink, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// Icons
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeFilledIcon from "@mui/icons-material/HomeFilled";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

// Custom Components & Config
import BasicSelect from "../common/Select";
import UserProfileMenu from "../UserProfileMenu";
import { useAuth } from "../../hooks/useAuth";
import { LEARNING_NAV, MANAGEMENT_NAV } from "../../config/Navigation";

const drawerWidth = 240;

/* ---------------- Drawer Mixins ---------------- */

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

/* ---------------- Common Items (Always Visible) ---------------- */

const commonNavItems = [
  { label: "Home", path: "/home", icon: <HomeFilledIcon color="primary" /> },
  { label: "Progress", path: "/progress", icon: <AnalyticsIcon color="primary" /> },
  { label: "Support", path: "/help", icon: <SupportAgentIcon color="primary" /> },
  { label: "Notifications", path: "/notifications", icon: <CircleNotificationsIcon color="primary" /> },
];

/* ---------------- Sidebar Component ---------------- */

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/* ---------------- Sidebar Component ---------------- */

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // 1. Initialize from localStorage so it survives a Refresh
  const [category, setCategory] = React.useState(() => {
    return localStorage.getItem("sidebar_category") || "learn";
  });

  // 2. Auto-detect Mode from URL (Survives direct Navigation)
  React.useEffect(() => {
    // List your management routes here
    const managementRoutes = ["/umanage", "/org_units", "/admin", "/enrollements", "/logs"];
    const isManagementPage = managementRoutes.some(path => location.pathname.startsWith(path));

    if (isManagementPage) {
      setCategory("manage");
      localStorage.setItem("sidebar_category", "manage");
    } else {
      // Optional: auto-switch back to learn if on a learning page
      // setCategory("learn");
    }
  }, [location.pathname]);

  // 3. Helper to handle manual dropdown changes
  const handleCategoryChange = (newVal: string) => {
    setCategory(newVal);
    localStorage.setItem("sidebar_category", newVal);
  };

  const dynamicNavItems = category === 'manage' ? MANAGEMENT_NAV : LEARNING_NAV;
  const isDrawerOpen = isMobile ? false : open;

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <MuiDrawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(isDrawerOpen ? openedMixin(theme) : closedMixin(theme)),
        "& .MuiDrawer-paper": {
          ...(isDrawerOpen ? openedMixin(theme) : closedMixin(theme)),
          overflowY: "auto",
          boxShadow: 4,
          scrollbarWidth: "none",
          "&:hover": { scrollbarWidth: "thin" },
          "&::-webkit-scrollbar": { width: "5px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: theme.palette.primary.main, borderRadius: "10px" }
        },
      }}
    >
      <DrawerHeader>
        {/* Pass the custom handler instead of just setCategory */}
        {isDrawerOpen ? (
          <BasicSelect value={category} onChange={handleCategoryChange} />
        ) : (
          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img src="/dat logo.png" width={30} alt="logo" />
          </Box>
        )}
        <IconButton onClick={onClose} disabled={isMobile}>
          {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      {/* DYNAMIC NAVIGATION SECTION */}
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {isDrawerOpen && (
            <Typography variant="overline" sx={{ px: 3, fontWeight: 'bold', color: 'text.secondary' }}>
              {category === 'manage' ? "Management Tools" : "Learning Core"}
            </Typography>
          )}
          {dynamicNavItems.map((item) => (
            <ListItemButton
              key={item.label}
              component={NavLink}
              to={item.path}
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: isDrawerOpen ? "initial" : "center",
                "&.active": {
                  bgcolor: "action.selected",
                  borderRight: `4px solid ${theme.palette.primary.main}`,
                  "& .MuiListItemIcon-root": { color: theme.palette.primary.main },
                  "& .MuiListItemText-primary": { color: theme.palette.primary.main, fontWeight: 'bold' }
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: isDrawerOpen ? 3 : "auto", justifyContent: "center" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} sx={{ opacity: isDrawerOpen ? 1 : 0 }} />
            </ListItemButton>
          ))}
        </List>
      </Box>

      {/* ... Rest of your component (Common items, Profile) is perfect as it is ... */}

      <Divider />
      <List>
        {isDrawerOpen && <Typography variant="overline" sx={{ px: 3, color: 'text.secondary', fontWeight: '500' }}>General</Typography>}
        {commonNavItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={NavLink}
            to={item.path}
            sx={{
              minHeight: 44,
              px: 2.5,
              justifyContent: isDrawerOpen ? "initial" : "center",
              "&.active": { bgcolor: "action.selected" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 0, mr: isDrawerOpen ? 3 : "auto", justifyContent: "center" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} sx={{ opacity: isDrawerOpen ? 1 : 0 }} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 1 }}>
        <UserProfileMenu
          name={user?.fullName ?? "Guest User"}
          email={user?.email ?? ""}
          position={user?.position ?? "Student"}
          onLogout={handleLogout}
        />
      </Box>
    </MuiDrawer>
  );
};

export default Sidebar;