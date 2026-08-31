import React, { useState } from 'react';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import SOSModal from '../components/common/SOSModal';

export default function PatientLayout({ children }) {
  const [isSOSOpen, setIsSOSOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E1B2E]">

      <Header
        onOpenSOS={() => setIsSOSOpen(true)}
      />

      <main className="max-w-5xl mx-auto px-6 py-8">
        {children}
      </main>

      <Navbar />

      <SOSModal
        isOpen={isSOSOpen}
        onClose={() => setIsSOSOpen(false)}
      />

    </div>
  );
}