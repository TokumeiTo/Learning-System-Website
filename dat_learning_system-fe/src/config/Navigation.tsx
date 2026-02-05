import FollowTheSignsIcon from '@mui/icons-material/FollowTheSigns';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import StyleIcon from '@mui/icons-material/Style';
import QuizIcon from '@mui/icons-material/Quiz';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import BookIcon from '@mui/icons-material/Book';
import TranslateIcon from '@mui/icons-material/Translate';
import PeopleIcon from '@mui/icons-material/People';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AddCardIcon from '@mui/icons-material/AddCard';
import DvrIcon from '@mui/icons-material/Dvr';

export const LEARNING_NAV = [
    { label: "Learning path", path: "/path", icon: <FollowTheSignsIcon color="primary" /> },
    { label: "Courses", path: "/courses", icon: <CastForEducationIcon color="primary" /> },
    { label: "Schedule", path: "/schedule", icon: <EditCalendarIcon color="primary" /> },
    { label: "Flashcards", path: "/flashcards", icon: <StyleIcon color="primary" /> },
    { label: "Quizs & Practice", path: "/quiz", icon: <QuizIcon color="primary" /> },
    { label: "Mock test", path: "/mock_test", icon: <HistoryEduIcon color="primary" />, },
    { label: "Library", path: "/ebooks", icon: <LocalLibraryIcon color="primary" /> },
    { label: "Dictionary", path: "/dictionary", icon: <BookIcon color="primary" /> },
    { label: "Translation tool", path: "/translate", icon: <TranslateIcon color="primary" /> },
];

export const MANAGEMENT_NAV = [
    { label: "Admin Dashboard", path: "/admin/dashboard", icon: <DashboardIcon color="secondary" /> },
    { label: "User Management", path: "/admin/user_management", icon: <PeopleIcon color="secondary" /> },
    { label: "Org Structure", path: "/admin/org_units", icon: <AccountTreeIcon color="secondary" /> },
    { label: "Enrollments", path: "/admin/enrollments", icon: <AddCardIcon color="secondary" /> },
    { label: "Audits", path: "/admin/logs", icon: <DvrIcon color="secondary" /> },
];