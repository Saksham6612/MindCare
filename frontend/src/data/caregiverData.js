// Mock data for Caregiver Dashboard — Professional healthcare context

export const caregiverPatient = {
  name: "Dr. Biren Hazarika",
  preferredName: "Amma",
  age: 76,
  location: "Uzan Bazar, Guwahati, Assam",
  diagnosis: "Mild Cognitive Impairment (MCI)",
  diagnosedDate: "March 2023",
  primaryCaregiver: {
    name: "Priya Hazarika",
    relation: "Daughter",
    phone: "+91 98640 12345",
    lastCheckIn: "28 Aug 2026, 10:15 AM"
  },
  physician: {
    name: "Dr. Samarjit Baruah",
    specialty: "Neurologist",
    hospital: "Guwahati Neurological Clinic",
    phone: "+91 94350 56789",
    nextAppointment: "15 Sep 2026"
  },
  medications: [
    { name: "Amlodipine 5mg", frequency: "Once daily (8:30 AM)", adherence: 92 },
    { name: "Donepezil 5mg", frequency: "Once daily (8:30 PM)", adherence: 87 },
    { name: "Calcium 500mg", frequency: "After lunch (1:00 PM)", adherence: 78 }
  ]
};

// 7-day cognitive performance data for charts
export const weeklyPerformanceData = [
  { day: "Mon", memory: 83, attention: 70, pattern: 65, date: "25 Aug" },
  { day: "Tue", memory: 78, attention: 75, pattern: 72, date: "26 Aug" },
  { day: "Wed", memory: 85, attention: 68, pattern: 70, date: "27 Aug" },
  { day: "Thu", memory: 90, attention: 80, pattern: 75, date: "28 Aug" },
  { day: "Fri", memory: 88, attention: 85, pattern: 80, date: "29 Aug" },
  { day: "Sat", memory: 92, attention: 82, pattern: 78, date: "30 Aug" },
  { day: "Sun", memory: 86, attention: 88, pattern: 83, date: "31 Aug" }
];

export const cognitiveStats = {
  memory: {
    label: "Memory",
    score: 86,
    trend: +8,
    level: "Good",
    sessions: 12,
    description: "Object recall accuracy this week"
  },
  attention: {
    label: "Attention",
    score: 78,
    trend: +5,
    level: "Fair",
    sessions: 8,
    description: "Focus & correct object selection rate"
  },
  pattern: {
    label: "Pattern",
    score: 74,
    trend: +11,
    level: "Improving",
    sessions: 7,
    description: "Pattern recognition completion rate"
  }
};

export const medicationAdherence = {
  overall: 86,
  weeklyData: [
    { day: "Mon", taken: 3, total: 3 },
    { day: "Tue", taken: 2, total: 3 },
    { day: "Wed", taken: 3, total: 3 },
    { day: "Thu", taken: 3, total: 3 },
    { day: "Fri", taken: 2, total: 3 },
    { day: "Sat", taken: 3, total: 3 },
    { day: "Sun", taken: 3, total: 3 }
  ]
};

export const recentActivities = [
  {
    id: "act-1",
    type: "game",
    title: "Completed Memory Game",
    detail: "Score: 5/6 (83%) · Level: Easy",
    time: "Today, 10:22 AM",
    icon: "Brain",
    sentiment: "positive"
  },
  {
    id: "act-2",
    type: "medicine",
    title: "Took Morning Tablet",
    detail: "Amlodipine 5mg — Marked as taken",
    time: "Today, 08:35 AM",
    icon: "Pill",
    sentiment: "positive"
  },
  {
    id: "act-3",
    type: "hydration",
    title: "Hydration Logged",
    detail: "Drank 3 glasses of water by 11 AM",
    time: "Today, 10:55 AM",
    icon: "Droplets",
    sentiment: "positive"
  },
  {
    id: "act-4",
    type: "mood",
    title: "Mood Check-in",
    detail: "Reported feeling 'Good' this morning",
    time: "Today, 08:10 AM",
    icon: "Smile",
    sentiment: "positive"
  },
  {
    id: "act-5",
    type: "game",
    title: "Attention Game Skipped",
    detail: "Session not completed",
    time: "Yesterday, 4:30 PM",
    icon: "Eye",
    sentiment: "neutral"
  },
  {
    id: "act-6",
    type: "medicine",
    title: "Evening Tablet Missed",
    detail: "Donepezil 5mg — Not marked by 10 PM",
    time: "Yesterday, 10:00 PM",
    icon: "Pill",
    sentiment: "negative"
  }
];

export const caregiverAlerts = [
  {
    id: "alert-1",
    severity: "warning",
    title: "Medication Missed Yesterday",
    detail: "Donepezil 5mg was not taken on 27 Aug. This is the 2nd miss this week.",
    time: "Yesterday, 10:00 PM",
    resolved: false
  },
  {
    id: "alert-2",
    severity: "info",
    title: "Difficulty Level Increased",
    detail: "Adaptive engine promoted Memory Game from Easy → Medium based on 90%+ accuracy.",
    time: "Today, 10:25 AM",
    resolved: false
  },
  {
    id: "alert-3",
    severity: "success",
    title: "7-Day Streak Achieved",
    detail: "Patient completed at least one brain exercise every day this week.",
    time: "Today, 12:00 AM",
    resolved: true
  }
];

export const gamesCompletedThisWeek = [
  { game: "Memory", completed: 5, total: 7, avgScore: 84 },
  { game: "Attention", completed: 3, total: 7, avgScore: 71 },
  { game: "Pattern", completed: 4, total: 7, avgScore: 68 }
];
