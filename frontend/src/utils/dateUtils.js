// Date and time utility functions optimized for senior readability with English and Bengali support

export function getGreeting(date = new Date(), language = 'en') {
  const hour = date.getHours();
  const isBn = language === 'bn';

  if (hour >= 5 && hour < 12) {
    return {
      text: isBn ? "শুভ সকাল" : "Good Morning",
      icon: "Sun",
      subtext: isBn ? "আপনার দিনটি শান্তিময় ও উজ্জ্বল হোক" : "Wishing you a peaceful and bright day"
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      text: isBn ? "শুভ দুপুর" : "Good Afternoon",
      icon: "SunMedium",
      subtext: isBn ? "আপনার দিনটি আরামদায়ক ও শান্ত কাটুক" : "Hope your day is relaxing and comfortable"
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      text: isBn ? "শুভ সন্ধ্যা" : "Good Evening",
      icon: "Sunset",
      subtext: isBn ? "দিনের ক্লান্তি দূর করে শান্ত সন্ধ্যা উপভোগ করুন" : "Time to unwind and enjoy a calm evening"
    };
  } else {
    return {
      text: isBn ? "শুভ রাত্রি" : "Good Night",
      icon: "Moon",
      subtext: isBn ? "শান্তিতে বিশ্রাম নিন ও মিষ্টি স্বপ্ন দেখুন" : "Rest well and have sweet, peaceful dreams"
    };
  }
}

export function formatSeniorDate(date = new Date(), language = 'en') {
  const locale = language === 'bn' ? 'bn-IN' : 'en-IN';
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  try {
    return date.toLocaleDateString(locale, options);
  } catch {
    return date.toLocaleDateString('en-IN', options);
  }
}

export function formatSeniorTime(date = new Date(), language = 'en') {
  const locale = language === 'bn' ? 'bn-IN' : 'en-IN';
  try {
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
}
