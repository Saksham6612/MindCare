import { useState, useEffect } from 'react';
import { getGreeting, formatSeniorDate, formatSeniorTime } from '../utils/dateUtils';
import { useLanguage } from '../context/LanguageContext';

export function useTimeOfDay() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { language } = useLanguage();

  useEffect(() => {
    // Update every 10 seconds for real-time accurate clock display
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting(currentTime, language);
  const formattedDate = formatSeniorDate(currentTime, language);
  const formattedTime = formatSeniorTime(currentTime, language);

  return {
    currentTime,
    greeting,
    formattedDate,
    formattedTime
  };
}
