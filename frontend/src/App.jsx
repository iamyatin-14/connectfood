import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./pages/Login";
import DonorDashboard from "./pages/DonorDashboard";
import RecipientDashboard from "./pages/RecipientDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Donate from "./pages/Donate";
import CompleteProfile from "./pages/CompleteProfile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen page-container">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route
                path="/donor-dashboard"
                element={
                  <ProtectedRoute allowedRole="donor">
                    <DonorDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recipient-dashboard"
                element={
                  <ProtectedRoute allowedRole="recipient">
                    <RecipientDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/donate"
                element={
                  <ProtectedRoute allowedRole="donor">
                    <Donate />
                  </ProtectedRoute>
                }
              />
              <Route path="/complete-profile" element={<CompleteProfile />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
