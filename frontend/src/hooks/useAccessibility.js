import { useState, useEffect } from 'react';

export function useAccessibility() {
  const [fontScale, setFontScale] = useState(() => {
    return localStorage.getItem('mindcare_font_scale') || 'large';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('mindcare_high_contrast') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('mindcare_font_scale', fontScale);
    const root = document.documentElement;

    if (fontScale === 'extra-large') {
      root.style.fontSize = '20px';
    } else if (fontScale === 'large') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontScale]);

  useEffect(() => {
    localStorage.setItem('mindcare_high_contrast', highContrast.toString());
    if (highContrast) {
      document.body.classList.add('high-contrast-mode');
    } else {
      document.body.classList.remove('high-contrast-mode');
    }
  }, [highContrast]);

  const cycleFontSize = () => {
    if (fontScale === 'normal') setFontScale('large');
    else if (fontScale === 'large') setFontScale('extra-large');
    else setFontScale('normal');
  };

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
  };

  return {
    fontScale,
    highContrast,
    cycleFontSize,
    toggleHighContrast
  };
}
