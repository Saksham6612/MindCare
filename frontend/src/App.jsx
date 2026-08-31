import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PatientLayout from "./layouts/PatientLayout";
import Home from "./pages/Home";
import Games from "./pages/Games";
import MemoryGame from "./pages/MemoryGame";
import Reminders from "./pages/Reminders";
import VoiceAssistant from "./pages/VoiceAssistant";
import CaregiverDashboard from "./pages/CaregiverDashboard";
import Auth from "./pages/Auth";

import BackendStatus from "./components/BackendStatus";
import { isAuthenticated } from "./api/api";

function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

function App() {
  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/auth"
          element={
            isAuthenticated()
              ? <Navigate to="/" replace />
              : <Auth />
          }
        />

        {/* PROTECTED APPLICATION */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <PatientLayout>
                <BackendStatus />

                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/games" element={<Games />} />
                  <Route path="/games/memory" element={<MemoryGame />} />
                  <Route path="/reminders" element={<Reminders />} />
                  <Route path="/voice" element={<VoiceAssistant />} />
                  <Route
                    path="/caregiver"
                    element={<CaregiverDashboard />}
                  />

                  <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                  />
                </Routes>
              </PatientLayout>
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

export default App;
