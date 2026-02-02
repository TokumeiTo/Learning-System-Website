import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/* Pages */
import SignIn from "../pages/auth/SignInPage";

import FlashcardsPage from "../pages/flashcards/FlashcardsPage";
import TranslationPage from "../pages/translation/TranslationPage";

import QuizSetupPage from "../pages/quiz/QuizSetupPage";
import QuizListPage from "../pages/quiz/QuizListPage";
import QuizPage from "../pages/quiz/QuizPage";
import QuizResultPage from "../pages/quiz/QuizResultPage";
import QuizReviewPage from "../pages/quiz/QuizReviewPage";

import SchedulePage from "../pages/schedules/SchedulePage";
import LessonPage from "../pages/lessons/LessonPage";

/* System pages */
import NotFoundPage from "../pages/auth/NotFoundPage";
import UnauthorizedPage from "../pages/auth/UnauthorizedPage";
import ProgressPage from "../pages/dashboard/ProgressPage";
import Home from "../pages/dashboard/DashboardPage";
import EBooksPage from "../pages/ebooks/LibraryPage";
import DictionaryPage from "../pages/dictionaryPage/DictionaryPage";
import ClassroomPage from "../pages/classroom/ClassroomPage";
import SupportCenter from "../pages/feedbacks/FAQsPage";
import MockTestPage from "../pages/mock_tests/MockTestPage";
import CoursesPage from "../pages/courses/CoursePage";
import UserManagementPage from "../pages/auth/UserManagementPage";
import OrgPage from "../pages/orgUnits/OrgUnitPage";
import AdminDashboard from "../pages/dashboard/AdminDashboardPage";

/* Guards */
// import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* ---------- Public ---------- */}
        <Route path="/signIn" element={<SignIn />} />

        {/* ---------- Protected ---------- */}
        <Route
          path="/home"
          element={
            // <ProtectedRoute>
            <Home />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/progress"
          element={
            // <ProtectedRoute>
            <ProgressPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/flashcards"
          element={
            // <ProtectedRoute>
            <FlashcardsPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/translate"
          element={
            // <ProtectedRoute>
            <TranslationPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/schedule"
          element={
            // <ProtectedRoute>
            <SchedulePage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/lessons"
          element={
            // <ProtectedRoute>
            <LessonPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/classroom/:id"
          element={
            // <ProtectedRoute>
            <ClassroomPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            // <ProtectedRoute>
            <CoursesPage />
            // </ProtectedRoute>
          }
        />
        

        {/* ---------- Quiz (semi-public) ---------- */}
        <Route path="/quiz" element={<QuizSetupPage />} />
        <Route path="/quiz/list" element={<QuizListPage />} />

        <Route
          path="/quiz/start"
          element={
            // <ProtectedRoute>
            <QuizPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/result"
          element={
            // <ProtectedRoute>
            <QuizResultPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/quiz/review"
          element={
            // <ProtectedRoute>
            <QuizReviewPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/ebooks"
          element={
            // <ProtectedRoute>
            <EBooksPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/mock_test"
          element={
            // <ProtectedRoute>
            <MockTestPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/dictionary"
          element={
            // <ProtectedRoute>
            <DictionaryPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="/help"
          element={
            // <ProtectedRoute>
            <SupportCenter />
            // </ProtectedRoute>
          }
        />

        {/* ---------- System ---------- */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ---------- Root ---------- */}
        <Route
          path="/"
          element={<Navigate to={user ? "/home" : "/signIn"} replace />}
        />

        {/* ---------- 404 ---------- */}
        <Route path="*" element={<NotFoundPage />} />

        {/* ---------- Admin ----------- */}
        <Route
          path="admin/dashboard"
          element={
            // <ProtectedRoute>
            <AdminDashboard />
            // </ProtectedRoute>
          }
        />

        <Route
          path="admin/user_management"
          element={
            // <ProtectedRoute>
            <UserManagementPage />
            // </ProtectedRoute>
          }
        />

        <Route
          path="admin/org_units"
          element={
            // <ProtectedRoute>
            <OrgPage />
            // </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};
