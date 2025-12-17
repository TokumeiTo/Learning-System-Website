import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { useAuth } from "../hooks/useAuth";
// import { ProtectedRoute } from "./ProtectedRoute";
import SignIn from "../pages/auth/SignInPage";
import RegisterPage from "../pages/auth/RegisterPage";

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

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/signIn"} />} />
      </Routes>
    </Router>
  );
};
