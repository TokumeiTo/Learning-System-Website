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
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import BookIcon from '@mui/icons-material/Book';
import TranslateIcon from '@mui/icons-material/Translate';
<<<<<<< HEAD
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
=======
<<<<<<< HEAD
=======
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)

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
    label: "Lessons",
    path: "/dashboard/lessons",
    icon: <SchoolIcon color="primary" />,
  },
  {
    label: "Schedule",
<<<<<<< HEAD
    path: "/schedule",
=======
<<<<<<< HEAD
    path: "/dashboard/schedule",
=======
    path: "/schedule",
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)
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
<<<<<<< HEAD
    path: "/quiz",
=======
<<<<<<< HEAD
    path: "/dashboard/path",
=======
    path: "/quiz",
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)
    icon: <QuizIcon color="primary" />,
  },
  {
    label: "Text books",
    path: "/dashboard/path",
    icon: <MenuBookIcon color="primary" />,
  },
  {
    label: "Flashcards",
<<<<<<< HEAD
    path: "/dashboard/flashcards",
=======
<<<<<<< HEAD
    path: "/flashcards",
=======
    path: "/dashboard/flashcards",
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)
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
    label: "Translate",
<<<<<<< HEAD
    path: "/dashboard/translate",
    icon: <TranslateIcon color="primary" />,
  },
=======
<<<<<<< HEAD
    path: "/translate",
    icon: <TranslateIcon color="primary" />,
  },
=======
    path: "/dashboard/translate",
    icon: <TranslateIcon color="primary" />,
  },
>>>>>>> 3943437 (12/22/2025)
  {
    label: "Mock test",
    path: "/test",
    icon: <HistoryEduIcon color="primary" />,
  },
<<<<<<< HEAD
=======
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)
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
<<<<<<< HEAD
        boxShadow: 10,
=======
<<<<<<< HEAD
=======
        boxShadow: 10,
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)
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
<<<<<<< HEAD
=======
<<<<<<< HEAD
          {open && (
            <ListItemText
              primary="Commons"
              sx={{ px: 3, fontSize: 12, color: "text.secondary" }}
            />
          )}
=======
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)
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
