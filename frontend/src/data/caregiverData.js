// Mock data for Caregiver Dashboard — Professional healthcare context

export const caregiverPatient = {
  name: "Dr. Biren Hazarika",
  preferredName: "Amma",
  age: 76,
  location: "Uzan Bazar, Guwahati, Assam",
  diagnosis: "Mild Cognitive Impairment (MCI)",
  diagnosis_bn: "মৃদু জ্ঞানীয় দুর্বলতা (MCI)",
  diagnosedDate: "March 2023",
  primaryCaregiver: {
    name: "Priya Hazarika",
    relation: "Daughter",
    relation_bn: "মেয়ে",
    phone: "+91 98640 12345",
    lastCheckIn: "28 Aug 2026, 10:15 AM",
    lastCheckIn_bn: "২৮ আগস্ট ২০২৬, সকাল ১০:১৫"
  },
  physician: {
    name: "Dr. Samarjit Baruah",
    specialty: "Neurologist",
    specialty_bn: "নিউরোলজিস্ট",
    hospital: "Guwahati Neurological Clinic",
    phone: "+91 94350 56789",
    nextAppointment: "15 Sep 2026"
  },
  medications: [
    {
      name: "Amlodipine 5mg",
      frequency: "Once daily (8:30 AM)",
      frequency_bn: "প্রতিদিন একবার (সকাল ৮:৩০)",
      adherence: 92
    },
    {
      name: "Donepezil 5mg",
      frequency: "Once daily (8:30 PM)",
      frequency_bn: "প্রতিদিন একবার (রাত ৮:৩০)",
      adherence: 87
    },
    {
      name: "Calcium 500mg",
      frequency: "After lunch (1:00 PM)",
      frequency_bn: "দুপুরের খাবারের পর (দুপুর ১:০০)",
      adherence: 78
    }
  ]
};

// 7-day cognitive performance data for charts
export const weeklyPerformanceData = [
  { day: "Mon", day_bn: "সো", memory: 83, attention: 70, pattern: 65, date: "25 Aug", date_bn: "২৫ আগস্ট" },
  { day: "Tue", day_bn: "ম",  memory: 78, attention: 75, pattern: 72, date: "26 Aug", date_bn: "২৬ আগস্ট" },
  { day: "Wed", day_bn: "বু", memory: 85, attention: 68, pattern: 70, date: "27 Aug", date_bn: "২৭ আগস্ট" },
  { day: "Thu", day_bn: "বৃ", memory: 90, attention: 80, pattern: 75, date: "28 Aug", date_bn: "২৮ আগস্ট" },
  { day: "Fri", day_bn: "শু", memory: 88, attention: 85, pattern: 80, date: "29 Aug", date_bn: "২৯ আগস্ট" },
  { day: "Sat", day_bn: "শ",  memory: 92, attention: 82, pattern: 78, date: "30 Aug", date_bn: "৩০ আগস্ট" },
  { day: "Sun", day_bn: "র",  memory: 86, attention: 88, pattern: 83, date: "31 Aug", date_bn: "৩১ আগস্ট" }
];

export const cognitiveStats = {
  memory: {
    label: "Memory",
    score: 86,
    trend: +8,
    level: "Good",
    level_bn: "ভালো",
    sessions: 12,
    description: "Object recall accuracy this week",
    description_bn: "এই সপ্তাহে বস্তু স্মরণের নির্ভুলতা"
  },
  attention: {
    label: "Attention",
    score: 78,
    trend: +5,
    level: "Fair",
    level_bn: "মোটামুটি",
    sessions: 8,
    description: "Focus & correct object selection rate",
    description_bn: "মনোযোগ ও সঠিক বস্তু নির্বাচনের হার"
  },
  pattern: {
    label: "Pattern",
    score: 74,
    trend: +11,
    level: "Improving",
    level_bn: "উন্নতি হচ্ছে",
    sessions: 7,
    description: "Pattern recognition completion rate",
    description_bn: "প্যাটার্ন শনাক্তকরণের সমাপ্তির হার"
  }
};

export const medicationAdherence = {
  overall: 86,
  weeklyData: [
    { day: "Mon", day_bn: "সো", taken: 3, total: 3 },
    { day: "Tue", day_bn: "ম",  taken: 2, total: 3 },
    { day: "Wed", day_bn: "বু", taken: 3, total: 3 },
    { day: "Thu", day_bn: "বৃ", taken: 3, total: 3 },
    { day: "Fri", day_bn: "শু", taken: 2, total: 3 },
    { day: "Sat", day_bn: "শ",  taken: 3, total: 3 },
    { day: "Sun", day_bn: "র",  taken: 3, total: 3 }
  ]
};

export const recentActivities = [
  {
    id: "act-1",
    type: "game",
    title: "Completed Memory Game",
    title_bn: "স্মৃতি খেলা সম্পন্ন",
    detail: "Score: 5/6 (83%) · Level: Easy",
    detail_bn: "স্কোর: ৫/৬ (৮৩%) · স্তর: সহজ",
    time: "Today, 10:22 AM",
    time_bn: "আজ, সকাল ১০:২২",
    icon: "Brain",
    sentiment: "positive"
  },
  {
    id: "act-2",
    type: "medicine",
    title: "Took Morning Tablet",
    title_bn: "সকালের ট্যাবলেট গ্রহণ করেছেন",
    detail: "Amlodipine 5mg — Marked as taken",
    detail_bn: "অ্যামলোডিপিন ৫ মিগ্রা — গ্রহণ করা হয়েছে",
    time: "Today, 08:35 AM",
    time_bn: "আজ, সকাল ৮:৩৫",
    icon: "Pill",
    sentiment: "positive"
  },
  {
    id: "act-3",
    type: "hydration",
    title: "Hydration Logged",
    title_bn: "জলপান নথিভুক্ত",
    detail: "Drank 3 glasses of water by 11 AM",
    detail_bn: "সকাল ১১টার মধ্যে ৩ গ্লাস জল পান করেছেন",
    time: "Today, 10:55 AM",
    time_bn: "আজ, সকাল ১০:৫৫",
    icon: "Droplets",
    sentiment: "positive"
  },
  {
    id: "act-4",
    type: "mood",
    title: "Mood Check-in",
    title_bn: "মনের অবস্থা পরীক্ষা",
    detail: "Reported feeling 'Good' this morning",
    detail_bn: "আজ সকালে 'ভালো' অনুভব করছেন বলে জানিয়েছেন",
    time: "Today, 08:10 AM",
    time_bn: "আজ, সকাল ৮:১০",
    icon: "Smile",
    sentiment: "positive"
  },
  {
    id: "act-5",
    type: "game",
    title: "Attention Game Skipped",
    title_bn: "মনোযোগ খেলা বাদ দিয়েছেন",
    detail: "Session not completed",
    detail_bn: "সেশন সম্পন্ন হয়নি",
    time: "Yesterday, 4:30 PM",
    time_bn: "গতকাল, বিকাল ৪:৩০",
    icon: "Eye",
    sentiment: "neutral"
  },
  {
    id: "act-6",
    type: "medicine",
    title: "Evening Tablet Missed",
    title_bn: "সন্ধ্যার ট্যাবলেট মিস হয়েছে",
    detail: "Donepezil 5mg — Not marked by 10 PM",
    detail_bn: "ডোনেপেজিল ৫ মিগ্রা — রাত ১০টার মধ্যে নিশ্চিত করা হয়নি",
    time: "Yesterday, 10:00 PM",
    time_bn: "গতকাল, রাত ১০:০০",
    icon: "Pill",
    sentiment: "negative"
  }
];

export const caregiverAlerts = [
  {
    id: "alert-1",
    severity: "warning",
    title: "Medication Missed Yesterday",
    title_bn: "গতকাল ওষুধ মিস হয়েছে",
    detail: "Donepezil 5mg was not taken on 27 Aug. This is the 2nd miss this week.",
    detail_bn: "ডোনেপেজিল ৫ মিগ্রা ২৭ আগস্ট নেওয়া হয়নি। এই সপ্তাহে এটি ২য় বার মিস।",
    time: "Yesterday, 10:00 PM",
    time_bn: "গতকাল, রাত ১০:০০",
    resolved: false
  },
  {
    id: "alert-2",
    severity: "info",
    title: "Difficulty Level Increased",
    title_bn: "কঠিনতার স্তর বৃদ্ধি পেয়েছে",
    detail: "Adaptive engine promoted Memory Game from Easy → Medium based on 90%+ accuracy.",
    detail_bn: "অভিযোজিত ইঞ্জিন ৯০%+ নির্ভুলতার ভিত্তিতে স্মৃতি খেলাকে সহজ → মাঝারি স্তরে উন্নীত করেছে।",
    time: "Today, 10:25 AM",
    time_bn: "আজ, সকাল ১০:২৫",
    resolved: false
  },
  {
    id: "alert-3",
    severity: "success",
    title: "7-Day Streak Achieved",
    title_bn: "টানা ৭ দিনের সিরিজ অর্জিত",
    detail: "Patient completed at least one brain exercise every day this week.",
    detail_bn: "এই সপ্তাহে প্রতিদিন কমপক্ষে একটি মস্তিষ্কের অনুশীলন সম্পন্ন করেছেন।",
    time: "Today, 12:00 AM",
    time_bn: "আজ, রাত ১২:০০",
    resolved: true
  }
];

export const gamesCompletedThisWeek = [
  { game: "Memory", completed: 5, total: 7, avgScore: 84 },
  { game: "Attention", completed: 3, total: 7, avgScore: 71 },
  { game: "Pattern", completed: 4, total: 7, avgScore: 68 }
];
