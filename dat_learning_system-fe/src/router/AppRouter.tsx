import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

/* Pages */
import { Dashboard } from "../pages/dashboard/Dashboard";
import SignIn from "../pages/auth/SignInPage";
import RegisterPage from "../pages/auth/RegisterPage";

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

/* Guards */
// import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* ---------- Public ---------- */}
        <Route path="/signIn" element={<SignIn />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* ---------- Protected ---------- */}
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <Dashboard />
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

        {/* ---------- System ---------- */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* ---------- Root ---------- */}
        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/signIn"} replace />}
        />

        {/* ---------- 404 ---------- */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};
