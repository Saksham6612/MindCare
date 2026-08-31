import React from 'react';
import HomeHeader from '../components/home/HomeHeader';
import FeelingSection from '../components/home/FeelingSection';
import VoiceAssistantBanner from '../components/home/VoiceAssistantBanner';
import BrainExerciseCard from '../components/home/BrainExerciseCard';
import MedicineCard from '../components/home/MedicineCard';
import HydrationCard from '../components/home/HydrationCard';

export default function Home() {
  return (
    <div className="space-y-6 sm:space-y-7 max-w-3xl mx-auto animate-in fade-in duration-300">
      {/* 1. Header: Good Morning, Amma, Elderly Avatar */}
      <HomeHeader />

      {/* 2. Feeling Section: How are you feeling today? (😊 Good, 😐 Okay, 😔 Not good) */}
      <FeelingSection />

      {/* 3. AI Voice Assistant Quick Launch Banner */}
      <VoiceAssistantBanner />

      {/* 4. Today's Brain Exercise Card: Memory Challenge, 5-7 min, Adaptive level, Start Game */}
      <BrainExerciseCard />

      {/* 5. Medicine Card: Morning Tablet, 10:00 AM, Mark as Taken */}
      <MedicineCard />

      {/* 6. Hydration Card: Drink Water, Next reminder time, Log Water */}
      <HydrationCard />
    </div>
  );
}
