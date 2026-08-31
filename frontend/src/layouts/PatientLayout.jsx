import React, { useState } from 'react';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import SOSModal from '../components/common/SOSModal';
import ProactiveReminderModal from '../components/reminders/ProactiveReminderModal';
import { useAccessibility } from '../hooks/useAccessibility';

export default function PatientLayout({ children }) {
  const [isSOSOpen, setIsSOSOpen] = useState(false);
  const { 
    fontScale, 
    highContrast, 
    cycleFontSize, 
    toggleHighContrast 
  } = useAccessibility();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#1E1B2E] transition-colors pb-28">
      {/* Header */}
      <Header
        onOpenSOS={() => setIsSOSOpen(true)}
        fontScale={fontScale}
        onCycleFontSize={cycleFontSize}
        highContrast={highContrast}
        onToggleContrast={toggleHighContrast}
      />

      {/* Main Page Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8">
        {children}
      </main>

      {/* Persistent Navigation */}
      <Navbar />

      {/* Emergency Modal */}
      <SOSModal 
        isOpen={isSOSOpen} 
        onClose={() => setIsSOSOpen(false)} 
      />

      {/* Proactive Due Reminder Notification Modal */}
      <ProactiveReminderModal />
    </div>
  );
}
