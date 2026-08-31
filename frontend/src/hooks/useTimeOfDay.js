import { useState, useEffect } from 'react';
import { getGreeting, formatSeniorDate, formatSeniorTime } from '../utils/dateUtils';

export function useTimeOfDay() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update every 10 seconds for real-time accurate clock display
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const greeting = getGreeting(currentTime);
  const formattedDate = formatSeniorDate(currentTime);
  const formattedTime = formatSeniorTime(currentTime);

  return {
    currentTime,
    greeting,
    formattedDate,
    formattedTime
  };
}
