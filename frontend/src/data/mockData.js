// Mock data for MindCare MVP - Designed for North-Eastern India elderly context

export const patientProfile = {
  name: "Dr. Biren Hazarika",
  preferredName: "Dadu",
  age: 76,
  location: "Uzan Bazar, Guwahati, Assam",
  primaryLanguage: "English & Assamese",
  caregiver: {
    name: "Priya Hazarika",
    relationship: "Daughter",
    phone: "+91 98640 12345",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    status: "Active & Connected",
    lastCheckIn: "10 mins ago",
    note: "Priya is in Guwahati and checked in with you this morning."
  },
  emergencyDoctor: {
    name: "Dr. Samarjit Baruah",
    hospital: "Guwahati Neurological Clinic",
    phone: "+91 94350 56789"
  }
};

// Shared reminder type config used across the app
export const REMINDER_TYPES = {
  medicine: {
    label: "Medicine",
    color: "purple",
    bgClass: "bg-purple-100",
    textClass: "text-purple-700",
    borderClass: "border-purple-300",
    badgeBg: "bg-purple-100 text-purple-900 border-purple-200"
  },
  hydration: {
    label: "Hydration",
    color: "sky",
    bgClass: "bg-sky-100",
    textClass: "text-sky-700",
    borderClass: "border-sky-300",
    badgeBg: "bg-sky-100 text-sky-900 border-sky-200"
  },
  activity: {
    label: "Daily Activity",
    color: "emerald",
    bgClass: "bg-emerald-100",
    textClass: "text-emerald-700",
    borderClass: "border-emerald-300",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-200"
  },
  appointment: {
    label: "Medical Appointment",
    color: "amber",
    bgClass: "bg-amber-100",
    textClass: "text-amber-700",
    borderClass: "border-amber-300",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-200"
  }
};

export const todaysReminders = [
  {
    id: "rem-1",
    title: "Morning Blood Pressure Tablet",
    title_bn: "সকালের রক্তচাপের ট্যাবলেট",
    description: "Take Amlodipine 5mg with a full glass of warm water after light breakfast.",
    description_bn: "হালকা সকালের নাস্তার পর এক গ্লাস হালকা গরম জল দিয়ে অ্যামলোডিপিন ৫ মিগ্রা নিন।",
    date: new Date().toISOString().split("T")[0],
    time: "08:30 AM",
    type: "medicine",
    completed: true
  },
  {
    id: "rem-2",
    title: "Drink Water & Warm Tea",
    title_bn: "জল পান ও গরম চা",
    description: "Enjoy a cup of warm Assam tea and drink at least 2 glasses of water.",
    description_bn: "এক কাপ গরম আসাম চা পান করুন এবং কমপক্ষে ২ গ্লাস জল পান করুন।",
    date: new Date().toISOString().split("T")[0],
    time: "10:30 AM",
    type: "hydration",
    completed: false
  },
  {
    id: "rem-3",
    title: "Calcium Tablet with Lunch",
    title_bn: "দুপুরের খাবারে ক্যালসিয়াম ট্যাবলেট",
    description: "Take 1 Calcium tablet after warm rice, dal, and boiled vegetables.",
    description_bn: "গরম ভাত, ডাল এবং সিদ্ধ সবজি খাওয়ার পর ১টি ক্যালসিয়াম ট্যাবলেট নিন।",
    date: new Date().toISOString().split("T")[0],
    time: "01:00 PM",
    type: "medicine",
    completed: false
  },
  {
    id: "rem-4",
    title: "Gentle Verandah Walk",
    title_bn: "বারান্দায় মৃদু হাঁটাহাঁটি",
    description: "15 minutes of slow walking in the garden or verandah for joint health.",
    description_bn: "জয়েন্টের স্বাস্থ্যের জন্য বাগানে বা বারান্দায় ১৫ মিনিট ধীরে হাঁটুন।",
    date: new Date().toISOString().split("T")[0],
    time: "05:00 PM",
    type: "activity",
    completed: false
  },
  {
    id: "rem-5",
    title: "Neurology Check-up",
    title_bn: "নিউরোলজি পরীক্ষা",
    description: "Visit Dr. Samarjit Baruah at Guwahati Neurological Clinic. Bring previous reports.",
    description_bn: "গুয়াহাটি নিউরোলজিক্যাল ক্লিনিকে ডা. সমরজিৎ বড়ুয়াকে দেখান। আগের রিপোর্টগুলো নিয়ে যান।",
    date: new Date().toISOString().split("T")[0],
    time: "11:00 AM",
    type: "appointment",
    completed: false
  },
  {
    id: "rem-6",
    title: "Night Memory Medicine",
    title_bn: "রাতের স্মৃতি ওষুধ",
    description: "Take Donepezil 5mg tablet with warm water before going to bed.",
    description_bn: "শুতে যাওয়ার আগে গরম জল দিয়ে ডোনেপেজিল ৫ মিগ্রা ট্যাবলেট নিন।",
    date: new Date().toISOString().split("T")[0],
    time: "08:30 PM",
    type: "medicine",
    completed: false
  }
];

export const memorySpotlight = {
  id: "mem-1",
  title: "Family Trip to Shillong Peak",
  date: "October 2024",
  location: "Shillong, Meghalaya",
  image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
  caption: "You, your daughter Priya, and little Aarav enjoying the pine breeze at Elephant Falls.",
  promptQuestion: "Do you remember the warm cinnamon tea we had near the lake?",
  familyMembers: [
    { name: "Priya", relation: "Daughter" },
    { name: "Aarav", relation: "Grandson" }
  ]
};

export const brainGamesList = [
  {
    id: "memory",
    title: "Memory",
    description: "Remember objects",
    difficulty: "Easy",
    duration: "5–7 min",
    iconName: "Brain",
    route: "/games/memory",
    badgeText: "Recommended"
  },
  {
    id: "attention",
    title: "Attention",
    description: "Find the correct object",
    difficulty: "Medium",
    duration: "4–6 min",
    iconName: "Eye",
    route: "/games/memory",
    badgeText: "Focus Exercise"
  },
  {
    id: "pattern",
    title: "Pattern",
    description: "Complete the pattern",
    difficulty: "Adaptive",
    duration: "5 min",
    iconName: "Shapes",
    route: "/games/memory",
    badgeText: "Pattern Logic"
  }
];

export const quickVoiceSuggestions = [
  "What medicine do I need to take next?",
  "Tell me what day and time it is today.",
  "Call my daughter Priya.",
  "Play a gentle Assamese flute melody.",
  "Show me photos of grandson Aarav."
];
