import * as React from "react";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { CSSObject, Theme } from "@mui/material/styles";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import SchoolIcon from "@mui/icons-material/School";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import QuizIcon from '@mui/icons-material/Quiz';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StyleIcon from '@mui/icons-material/Style';
import ReportIcon from '@mui/icons-material/Report';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import BookIcon from '@mui/icons-material/Book';
import TranslateIcon from '@mui/icons-material/Translate';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';

import BasicSelect from "../common/Select";
import UserProfileMenu from "../UserProfileMenu";

import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const drawerWidth = 240;

/* ---------------- drawer mixins ---------------- */

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

/* ---------------- styled components ---------------- */

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

/* ---------------- types ---------------- */

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

/* ---------------- navigation config ---------------- */

export const mainNavItems = [
  {
    label: "Lessons",
    path: "/lessons",
    icon: <SchoolIcon color="primary" />,
  },
  {
    label: "Schedule",
    path: "/schedule",
    icon: <EditCalendarIcon color="primary" />,
  },
  {
    label: "Learning path",
    path: "/dashboard/path",
    icon: <FollowTheSignsIcon color="primary" />,
  },
  {
    label: "Pratice",
    path: "/dashboard/schedule",
    icon: <DesignServicesIcon color="primary" />,
  },
  {
    label: "Quiz",
    path: "/quiz",
    icon: <QuizIcon color="primary" />,
  },
  {
    label: "Text books",
    path: "/dashboard/path",
    icon: <MenuBookIcon color="primary" />,
  },
  {
    label: "Flashcards",
    path: "/dashboard/flashcards",
    icon: <StyleIcon color="primary" />,
  },
  {
    label: "Classroom",
    path: "/dashboard/path",
    icon: <CastForEducationIcon color="primary" />,
  },
  {
    label: "Dictionary",
    path: "/dashboard/path",
    icon: <BookIcon color="primary" />,
  },
  {
    label: "Translation tool",
    path: "/dashboard/translate",
    icon: <TranslateIcon color="primary" />,
  },
  {
    label: "Mock test",
    path: "/test",
    icon: <HistoryEduIcon color="primary" />,
  },
];

const commonNavItems = [
  {
    label: "Progress",
    path: "/dashboard",
    icon: <AnalyticsIcon color="primary" />,
  },
  {
    label: "Help",
    path: "/dashboard/help",
    icon: <HelpOutlineIcon color="primary" />,
  },
  {
    label: "Report",
    path: "/dashboard/help",
    icon: <ReportIcon color="primary" />,
  },
]

/* ---------------- component ---------------- */

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();              // clear token + user
    navigate("/auth/login"); // redirect
  };


  React.useEffect(() => {
    if (isMobile && open) {
      onClose(); // force close when entering mobile
    }
  }, [isMobile, open, onClose]);
  const isDrawerOpen = isMobile ? false : open;

  return (
    <MuiDrawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        boxShadow: 10,
        ...(isDrawerOpen ? openedMixin(theme) : closedMixin(theme)),

        // ---- SCROLLBAR MUST TARGET PAPER ----
        "& .MuiDrawer-paper": {
          ...(isDrawerOpen ? openedMixin(theme) : closedMixin(theme)),
          overflowY: "auto",

          scrollbarWidth: "none", // hidden by default
          scrollbarColor: "transparent transparent",
          transition: "scrollbar-color 0.3s, scrollbar-width 0.3s",

          "&:hover": {
            scrollbarWidth: "thin",
            scrollbarColor: ` #008cffff ${theme.palette.background.paper}`, // thumb / track
          },
        },
      }}
    >

      {/* ---------- Header ---------- */}
      <DrawerHeader>
        {isDrawerOpen && <BasicSelect />}
        <IconButton onClick={onClose} disabled={isMobile}>
          {theme.direction === "rtl" ? (
            <ChevronRightIcon />
          ) : (
            <ChevronLeftIcon />
          )}
        </IconButton>
      </DrawerHeader>

      <Divider />

      {/* ---------- Main Navigation ---------- */}
      <Box sx={{ flexGrow: 1 }}>
        <List>
          {mainNavItems.map((item) => (
            <ListItemButton
              key={item.label}
              component={NavLink}
              to={item.path}
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: isDrawerOpen ? "initial" : "center",
                "&.active": {
                  backgroundColor: "action.selected",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isDrawerOpen ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ opacity: isDrawerOpen ? 1 : 0 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Divider />

      {/* ---------- Commons ---------- */}
      <List>
        {isDrawerOpen && (
          <ListItemText
            primary="Commons"
            sx={{ px: 3, py: 1, fontSize: 12, color: "text.secondary" }}
          />
        )}

        {commonNavItems.map((item) => (
          <ListItemButton
            key={item.label}
            component={NavLink}
            to={item.path}
            sx={{
              minHeight: 44,
              px: 2.5,
              justifyContent: isDrawerOpen ? "initial" : "center",
              "&.active": {
                backgroundColor: "action.selected",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: isDrawerOpen ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{ opacity: isDrawerOpen ? 1 : 0 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      {/* ---------- Footer / Profile ---------- */}
      <Box sx={{ p: 1 }}>
        <UserProfileMenu
          name={user?.fullName ?? "Unknown user"}
          email={user?.email ?? "Unknown email"}
          avatarUrl="/static/images/avatar/7.jpg"
          position={user?.position ?? "Unknown position"}
          onLogout={handleLogout}
        />
      </Box>
    </MuiDrawer>
  );
};

export default Sidebar;