import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { useAuth } from "../hooks/useAuth";
// import { ProtectedRoute } from "./ProtectedRoute";
import SignIn from "../pages/auth/SignInPage";
import RegisterPage from "../pages/auth/RegisterPage";
import FlashcardsPage from "../pages/flashcards/FlashcardsPage";
import TranslationPage from "../pages/translation/TranslationPage";
<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> 3943437 (12/22/2025)
import QuizIntroPage from "../pages/quiz/QuizIntroPage";
import QuizPage from "../pages/quiz/QuizPage";
import QuizResultPage from "../pages/quiz/QuizResultPage";
import QuizReviewPage from "../pages/quiz/QuizReviewPage";
import QuizSetupPage from "../pages/quiz/QuizSetupPage";
import QuizListPage from "../pages/quiz/QuizListPage";
import SchedulePage from "../pages/schedules/SchedulePage";
<<<<<<< HEAD
=======
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)

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
<<<<<<< HEAD
          path="/dashboard/flashcards"
=======
<<<<<<< HEAD
          path="/flashcards"
=======
          path="/dashboard/flashcards"
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)
          element={
            // <ProtectedRoute>
            <FlashcardsPage />
            // </ProtectedRoute>
          }
        />
        <Route
<<<<<<< HEAD
          path="/dashboard/translate"
=======
<<<<<<< HEAD
          path="/translate"
=======
          path="/dashboard/translate"
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)
          element={
            // <ProtectedRoute>
            <TranslationPage />
            // </ProtectedRoute>
          }
        />

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
>>>>>>> 3943437 (12/22/2025)
        <Route path="/quiz" element={<QuizSetupPage />} />
        <Route path="/quiz/list" element={<QuizListPage />} />
        <Route path="/quiz/intro" element={<QuizIntroPage />} />
        <Route path="/quiz/start" element={<QuizPage />} />
        <Route path="/quiz/result" element={<QuizResultPage />} />
        <Route path="/quiz/review" element={<QuizReviewPage />} />
        
        <Route path="/schedule" element={<SchedulePage />} />

<<<<<<< HEAD
=======
>>>>>>> c7ea32c (12/22/2025)
>>>>>>> 3943437 (12/22/2025)
        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/signIn"} />} />
      </Routes>
    </Router>
  );
};
