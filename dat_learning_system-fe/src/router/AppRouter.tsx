import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/auth/Login";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { useAuth } from "../hooks/useAuth";
import { ProtectedRoute } from "./ProtectedRoute";

export const AppRouter = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};
