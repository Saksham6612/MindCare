// Date and time utility functions optimized for senior readability

export function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) {
    return {
      text: "Good Morning",
      icon: "Sun",
      subtext: "Wishing you a peaceful and bright day"
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      text: "Good Afternoon",
      icon: "SunMedium",
      subtext: "Hope your day is relaxing and comfortable"
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      text: "Good Evening",
      icon: "Sunset",
      subtext: "Time to unwind and enjoy a calm evening"
    };
  } else {
    return {
      text: "Good Night",
      icon: "Moon",
      subtext: "Rest well and have sweet, peaceful dreams"
    };
  }
}

export function formatSeniorDate(date = new Date()) {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

export function formatSeniorTime(date = new Date()) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}
