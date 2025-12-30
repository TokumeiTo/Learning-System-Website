import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { useAuth } from "../hooks/useAuth";
// import { ProtectedRoute } from "./ProtectedRoute";
import SignIn from "../pages/auth/SignInPage";
import RegisterPage from "../pages/auth/RegisterPage";
import FlashcardsPage from "../pages/flashcards/FlashcardsPage";
import TranslationPage from "../pages/translation/TranslationPage";

import QuizIntroPage from "../pages/quiz/QuizIntroPage";
import QuizPage from "../pages/quiz/QuizPage";
import QuizResultPage from "../pages/quiz/QuizResultPage";
import QuizReviewPage from "../pages/quiz/QuizReviewPage";
import QuizSetupPage from "../pages/quiz/QuizSetupPage";
import QuizListPage from "../pages/quiz/QuizListPage";
import SchedulePage from "../pages/schedules/SchedulePage";
import LessonPage from "../pages/lessons/LessonPage";

export const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/signIn" element={<SignIn />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
            <Dashboard />
            // </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            // <ProtectedRoute>
            <RegisterPage />
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
        <Route path="/quiz" element={<QuizSetupPage />} />
        <Route path="/quiz/list" element={<QuizListPage />} />
        <Route path="/quiz/intro" element={<QuizIntroPage />} />
        <Route path="/quiz/start" element={<QuizPage />} />
        <Route path="/quiz/result" element={<QuizResultPage />} />
        <Route path="/quiz/review" element={<QuizReviewPage />} />
        
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/lessons" element={<LessonPage />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/signIn"} />} />
      </Routes>
    </Router>
  );
};
