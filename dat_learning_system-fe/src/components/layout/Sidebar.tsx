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
import type { CSSObject, Theme } from "@mui/material/styles";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import QuizIcon from '@mui/icons-material/Quiz';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import StyleIcon from '@mui/icons-material/Style';
import ReportIcon from '@mui/icons-material/Report';

import BasicSelect from "../common/Select";
import UserProfileMenu from "../UserProfileMenu";

import { NavLink } from "react-router-dom";

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
    label: "Courses",
    path: "/dashboard/courses",
    icon: <SchoolIcon color="primary" />,
  },
  {
    label: "Schedule",
    path: "/dashboard/schedule",
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
    icon: <EditCalendarIcon color="primary" />,
  },
  {
    label: "Quiz",
    path: "/dashboard/path",
    icon: <QuizIcon color="primary" />,
  },
  {
    label: "Ebooks",
    path: "/dashboard/path",
    icon: <MenuBookIcon color="primary" />,
  },
  {
    label: "Flashcards",
    path: "/flashcards",
    icon: <StyleIcon color="primary" />,
  },
  {
    label: "Video Lessons",
    path: "/dashboard/path",
    icon: <CastForEducationIcon color="primary" />,
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
  {
    label: "Settings",
    path: "/dashboard/settings",
    icon: <SettingsIcon color="primary" />,
  },
]

/* ---------------- component ---------------- */

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const theme = useTheme();

  return (
    <MuiDrawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        whiteSpace: "nowrap",
        boxSizing: "border-box",
        ...(open ? openedMixin(theme) : closedMixin(theme)),
        "& .MuiDrawer-paper": open
          ? openedMixin(theme)
          : closedMixin(theme),
      }}
    >
      {/* ---------- Header ---------- */}
      <DrawerHeader>
        {open && <BasicSelect />}
        <IconButton onClick={onClose}>
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
          {open && (
            <ListItemText
              primary="Commons"
              sx={{ px: 3, fontSize: 12, color: "text.secondary" }}
            />
          )}
          {mainNavItems.map((item) => (
            <ListItemButton
              key={item.label}
              component={NavLink}
              to={item.path}
              sx={{
                minHeight: 48,
                px: 2.5,
                justifyContent: open ? "initial" : "center",
                "&.active": {
                  backgroundColor: "action.selected",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>

      <Divider />

      {/* ---------- Commons ---------- */}
      <List>
        {open && (
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
              justifyContent: open ? "initial" : "center",
              "&.active": {
                backgroundColor: "action.selected",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: open ? 3 : "auto",
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              sx={{ opacity: open ? 1 : 0 }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      {/* ---------- Footer / Profile ---------- */}
      <Box sx={{ p: 1 }}>
        <UserProfileMenu
          name="Riley Carter"
          email="riley@email.com"
          avatarUrl="/static/images/avatar/7.jpg"
          onLogout={() => console.log("logout")}
        />
      </Box>
    </MuiDrawer>
  );
};

export default Sidebar;
