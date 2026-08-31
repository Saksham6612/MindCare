import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PatientLayout from './layouts/PatientLayout';
import Home from './pages/Home';
import Games from './pages/Games';
import MemoryGame from './pages/MemoryGame';
import Reminders from './pages/Reminders';
import VoiceAssistant from './pages/VoiceAssistant';
import CaregiverDashboard from './pages/CaregiverDashboard';
import BackendStatus from './components/BackendStatus';

export default function App() {
  return (
    <Router>
      <PatientLayout>

        {/* Backend + Database Connection Status */}
        <BackendStatus />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/memory" element={<MemoryGame />} />
          <Route path="/reminders" element={<Reminders />} />
          <Route path="/voice" element={<VoiceAssistant />} />
          <Route path="/caregiver" element={<CaregiverDashboard />} />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

      </PatientLayout>
    </Router>
  );
}