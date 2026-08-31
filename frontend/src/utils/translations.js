// MindCare Comprehensive Bilingual Dictionary (English & Bengali)

export const translations = {
  en: {
    // Brand & Common
    app: {
      name: "MindCare",
      seniorCompanion: "Senior Companion",
      subLocation: "Guwahati, Assam • SIH 2026",
      tagline: "Your Gentle Daily Companion"
    },
    // Header & Accessibility
    header: {
      fontAdjusterTitle: "Adjust text size",
      fontNormal: "Normal",
      fontLarge: "Large Text",
      fontExtraLarge: "XL Text",
      contrastToggleTitle: "Toggle High Contrast",
      contrastLabel: "Contrast",
      contrastOn: "High Contrast: On",
      languageToggleTitle: "বাংলা ভাষায় পরিবর্তন করুন",
      languageLabel: "বাংলা",
      languageName: "English",
      sosHelp: "SOS HELP",
      sosHelpAria: "Open Emergency and Help Contacts",
      connected: "Connected"
    },
    // Navigation
    nav: {
      home: "Home",
      games: "Games",
      reminders: "Reminders",
      profile: "Profile"
    },
    // Greetings & Time
    greeting: {
      morning: "Good Morning",
      morningSub: "Wishing you a peaceful and bright day",
      afternoon: "Good Afternoon",
      afternoonSub: "Hope your day is relaxing and comfortable",
      evening: "Good Evening",
      eveningSub: "Time to unwind and enjoy a calm evening",
      night: "Good Night",
      nightSub: "Rest well and have sweet, peaceful dreams"
    },
    // Home Page
    home: {
      patientName: "Amma",
      howFeeling: "How are you feeling today?",
      dailyCheckIn: "Daily Check-in",
      moodGood: "Good",
      moodOkay: "Okay",
      moodNotGood: "Not good",
      moodGoodResponse: "Wonderful to hear, Amma! Keep that lovely smile on your face.",
      moodOkayResponse: "Taking it one step at a time. A warm cup of tea might help you feel refreshed!",
      moodNotGoodResponse: "We are here for you, Amma. Daughter Priya has been sent a gentle check-in note.",
      // Brain Exercise Card
      brainExerciseTitle: "Today's Brain Exercise",
      memoryChallenge: "Memory Challenge",
      duration: "5–7 min",
      adaptiveLevel: "Adaptive level",
      startGame: "Start Game",
      // Medicine Card
      medication: "Medication",
      morningTablet: "Morning Tablet",
      tabletTime: "10:00 AM",
      tabletInstruction: "1 Tablet with warm water",
      markAsTaken: "Mark as Taken",
      taken: "Taken",
      // Hydration Card
      hydration: "Hydration",
      glassesCount: "{count} of 8 glasses today",
      drinkWater: "Drink Water",
      nextReminderTime: "Next Reminder: 11:30 AM",
      glassUnit: "1 Glass",
      drinkWaterBtn: "I Drank Water",
      loggedGlassBtn: "Logged 1 Glass!"
    },
    // SOS Emergency Modal
    sos: {
      title: "Emergency & Help",
      subtitle: "Tap any button below to call immediately",
      primaryContact: "Primary Family Contact",
      familyPhysician: "Family Physician",
      elderLine: "Elder Line Helpline (14567)",
      freeHelplineDesc: "Free 24/7 National Senior Support",
      tollFree: "Toll Free",
      closeBtn: "I am Safe • Close This"
    },
    // Cognitive Games Page
    games: {
      title: "Cognitive Games",
      subtitle: "Choose a game to exercise your mind.",
      playGame: "Play Game",
      loading: "Loading games...",
      error: "Unable to load games.",
      recommended: "Recommended",
      focusExercise: "Focus Exercise",
      patternLogic: "Pattern Logic",
      comingSoon: "Coming Soon",
      allBrainGames: "All Brain Games"
    },
    // Memory Challenge Game
    memoryGame: {
      backToGames: "Back to All Games",
      title: "Memory Challenge",
      levelBadge: "{level} Level",
      adaptiveEngine: "Adaptive Cognitive Engine",
      // Step 1: Memorization
      step1Title: "Step 1: Memorization",
      memorizeHeading: "Memorize these {count} objects",
      memorizeSubheading: "Look closely. They will hide in {seconds} seconds.",
      imReady: "I'm Ready",
      // Step 2: Recall
      step2Title: "Step 2: Recall",
      recallHeading: "Which objects did you see?",
      recallSubheading: "Tap the cards you remember from earlier, then submit your answers.",
      selectedCount: "Selected: {count} objects",
      submitAnswers: "Submit Answers",
      // Step 3: Results
      gameCompleted: "Game Completed",
      perfectRecallTitle: "Perfect Recall, Amma! 🌟",
      perfectRecallMsg: "Outstanding! You remembered all objects without a single mistake!",
      wonderfulMemoryTitle: "Wonderful Memory, Amma! 🎉",
      wonderfulMemoryMsg: "You remembered the objects with great accuracy!",
      goodPracticeTitle: "Good Practice, Amma! 🌸",
      goodPracticeMsg: "Every daily exercise strengthens your memory pathways. Great effort!",
      scoreLabel: "Score",
      accuracyLabel: "{percentage}% Accuracy",
      responseTimeLabel: "Response Time",
      elapsedTimeLabel: "Elapsed Time",
      currentLevelLabel: "Current Level",
      adaptiveLabel: "Adaptive",
      adaptiveRecommendation: "Adaptive Difficulty Recommendation",
      correctAnswers: "Correct Answers ({count})",
      correctAnswersSub: "Objects you saw and correctly selected",
      reviewLearn: "Review & Learn",
      reviewLearnSub: "Items missed or unshown cards",
      correctBadge: "Correct",
      missedBadge: "Missed",
      notShownBadge: "Not Shown",
      playAgain: "Play Again",
      // Pool Object Names
      objects: {
        tea: "Assam Tea",
        orchid: "Kopou Orchid",
        rhino: "One-horn Rhino",
        apple: "Red Apple",
        mango: "Sweet Mango",
        bell: "Temple Bell",
        lotus: "Pink Lotus",
        banana: "Fresh Banana",
        coconut: "Tender Coconut",
        parrot: "Green Parrot",
        elephant: "Gentle Elephant",
        sun: "Morning Sun"
      }
    },
    // Reminders Page
    reminders: {
      backToHome: "Back to Home",
      title: "Today's Reminders",
      subtitle: "Tap \"Mark Done\" after completing each item.",
      addReminderBtn: "Add Reminder",
      dailyProgress: "Daily Progress",
      doneCount: "{completed} / {total} done",
      progressAria: "{percent}% reminders completed",
      filterAll: "All",
      filterMedicine: "Medicine",
      filterHydration: "Hydration",
      filterActivity: "Activity",
      filterAppointment: "Appointment",
      markDone: "Mark Done",
      done: "Done",
      noReminders: "No reminders for today yet.",
      noFilteredReminders: "No {type} reminders today.",
      tapAddPrompt: "Tap \"Add Reminder\" above to create one.",
      // Form modal
      addNewReminder: "Add New Reminder",
      formSubtitle: "Fill in the details below and tap \"Save\".",
      reminderType: "Reminder Type",
      titleInput: "Title",
      titlePlaceholder: "e.g. Evening Blood Pressure Tablet",
      titleRequired: "Please enter a reminder title.",
      timeRequired: "Please choose a time.",
      descriptionInput: "Description (Optional)",
      descriptionPlaceholder: "Extra notes or instructions...",
      dateInput: "Date",
      timeInput: "Time",
      saveReminder: "Save Reminder",
      cancel: "Cancel",
      completedBadge: "✓ Completed"
    },
    // Voice Assistant Page
    voice: {
      backToHome: "Back to Home",
      title: "Voice Companion",
      subtitle: "Tap the big purple microphone below and speak naturally.",
      assistantTitle: "MindCare Assistant",
      initialGreeting: "Hello Dadu! I am your MindCare voice assistant. How can I help you right now?",
      listeningPrompt: "Listening to you in English or Bengali...",
      listeningFeedback: "You asked: 'What is my next reminder?'",
      reminderResponse: "Your next reminder is at 10:30 AM: Enjoy your warm cup of tea with biscuits.",
      medicineResponse: "You have already taken your Blood Pressure medicine at 8:30 AM. Your next medicine is at 1:00 PM (Lunch Joint Care).",
      callPriyaResponse: "Connecting you to your daughter Priya Hazarika (+91 98640 12345)...",
      generalResponse: "I heard your request: \"{phrase}\". Everything is set and peaceful.",
      tapToSpeak: "Tap Microphone to Speak",
      listeningNow: "Listening... Speak now",
      suggestionsHeader: "Or tap any common question below:"
    },
    // Caregiver Dashboard
    caregiver: {
      backToPatient: "Patient App Home",
      dashboardTitle: "Caregiver Dashboard",
      monitoring: "Monitoring {name}",
      activeAlerts: "{count} Active Alert{plural}",
      statusLabel: "Status",
      safeConnected: "Safe & Connected",
      caregiverLabel: "Caregiver",
      physicianLabel: "Physician",
      nextAppointmentLabel: "Next Appointment",
      lastCheckIn: "Last check-in: {time}",
      cognitivePerformance: "Cognitive Performance This Week",
      weeklyChartTitle: "Weekly Cognitive Performance",
      weeklyChartSub: "Memory, Attention & Pattern Recognition (%) — Last 7 days",
      gamesCompleted: "Games Completed This Week",
      sessionsCompletedSub: "Sessions completed out of 7 days",
      medicationAdherence: "Medication Adherence",
      medicationsTracked: "3 daily medications tracked",
      overallThisWeek: "Overall this week",
      dailyDoses: "This Week — Daily Doses",
      recentActivity: "Recent Activity",
      recentActivitySub: "Live patient events from the last 48 hours",
      alertsTitle: "Alerts ({count} active)",
      resolvedCount: "{count} resolved",
      noAlerts: "No active alerts. Everything looks good!",
      statMemory: "Memory",
      statAttention: "Attention",
      statPattern: "Pattern",
      statLevel: "Level",
      statSessions: "{count} sessions",
      totalSessions: "Total Sessions",
      bestAvgScore: "Best Avg Score",
      daysActive: "Days Active"
    },
    // Backend Status
    systemStatus: {
      title: "System Status",
      backendApi: "Backend API",
      postgresDb: "PostgreSQL Database",
      connected: "● Connected",
      error: "● Error",
      checking: "● Checking..."
    },
    // Difficulties
    difficulty: {
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      adaptive: "Adaptive"
    },
    // Alert Badges
    alertBadge: {
      warning: "Warning",
      info: "Info",
      resolved: "Resolved",
      resolvedText: "Resolved"
    },
    vsLastWeek: "vs last week",
    nextLabel: "Next:",
    chartType: {
      line: "Line",
      bar: "Bar"
    },
    ageLabel: "Age",
    daysLabel: "days",
    avgLabel: "Avg",
    adaptiveRecommendations: {
      increased: "Great job! Your recall was fast and accurate. Tomorrow's challenge will be slightly harder ({nextDifficulty}).",
      atMax: "Outstanding recall! You are mastering our highest difficulty level with great precision.",
      decreased: "Good effort, Amma! We have adjusted the challenge to a gentler pace ({nextDifficulty}) so you can practice comfortably.",
      atMin: "Keep practicing at your own gentle pace. Regular daily exercise strengthens memory retention.",
      maintained: "Steady progress! You are performing well. We'll keep this comfortable level for your next session."
    }
  },

  bn: {
    // Brand & Common
    app: {
      name: "মাইন্ডকেয়ার",
      seniorCompanion: "প্রবীণ সাথী",
      subLocation: "গুয়াহাটি, আসাম • এসআইএইচ ২০২৬",
      tagline: "আপনার প্রতিদিনের বিশ্বস্ত সঙ্গী"
    },
    // Header & Accessibility
    header: {
      fontAdjusterTitle: "লেখার আকার পরিবর্তন করুন",
      fontNormal: "স্বাভাবিক",
      fontLarge: "বড় লেখা",
      fontExtraLarge: "খুব বড় লেখা",
      contrastToggleTitle: "উচ্চ কনট্রাস্ট মোড চালু/বন্ধ করুন",
      contrastLabel: "কনট্রাস্ট",
      contrastOn: "উচ্চ কনট্রাস্ট: চালু",
      languageToggleTitle: "Switch to English",
      languageLabel: "English",
      languageName: "বাংলা",
      sosHelp: "জরুরি সাহায্য",
      sosHelpAria: "জরুরি এবং সহায়তা যোগাযোগ খুলুন",
      connected: "সংযুক্ত"
    },
    // Navigation
    nav: {
      home: "হোম",
      games: "খেলাধুলা",
      reminders: "অনুস্মারক",
      profile: "প্রোফাইল"
    },
    // Greetings & Time
    greeting: {
      morning: "শুভ সকাল",
      morningSub: "আপনার দিনটি শান্তিময় ও উজ্জ্বল হোক",
      afternoon: "শুভ দুপুর",
      afternoonSub: "আপনার দিনটি আরামদায়ক ও শান্ত কাটুক",
      evening: "শুভ সন্ধ্যা",
      eveningSub: "দিনের ক্লান্তি দূর করে শান্ত সন্ধ্যা উপভোগ করুন",
      night: "শুভ রাত্রি",
      nightSub: "শান্তিতে বিশ্রাম নিন ও মিষ্টি স্বপ্ন দেখুন"
    },
    // Home Page
    home: {
      patientName: "আম্মা",
      howFeeling: "আজ আপনার কেমন লাগছে?",
      dailyCheckIn: "দৈনিক অনুভূতি",
      moodGood: "ভালো",
      moodOkay: "মোটামুটি",
      moodNotGood: "ভালো নেই",
      moodGoodResponse: "শুনে খুব আনন্দ হলো, আম্মা! আপনার মুখে সবসময় এমন মিষ্টি হাসি থাকুক।",
      moodOkayResponse: "ধীরে ধীরে সব ঠিক হয়ে যাবে। এক কাপ গরম চা খেলে আপনার ভালো লাগবে!",
      moodNotGoodResponse: "আমরা আপনার পাশেই আছি, আম্মা। মেয়ে প্রিয়াজিকে একটি বার্তা পাঠানো হয়েছে।",
      // Brain Exercise Card
      brainExerciseTitle: "আজকের মস্তিষ্কের অনুশীলন",
      memoryChallenge: "স্মৃতি পরীক্ষা",
      duration: "৫–৭ মিনিট",
      adaptiveLevel: "অভিযোজিত স্তর",
      startGame: "খেলা শুরু করুন",
      // Medicine Card
      medication: "ওষুধ",
      morningTablet: "সকালের ট্যাবলেট",
      tabletTime: "সকাল ১০:০০",
      tabletInstruction: "১টি ট্যাবলেট হালকা গরম জল দিয়ে",
      markAsTaken: "খাওয়া হয়েছে",
      taken: "খাওয়া সম্পন্ন",
      // Hydration Card
      hydration: "জলপান",
      glassesCount: "আজ ৮ গ্লাসের মধ্যে {count} গ্লাস খেয়েছেন",
      drinkWater: "জল পান করুন",
      nextReminderTime: "পরবর্তী সময়: সকাল ১১:৩০",
      glassUnit: "১ গ্লাস",
      drinkWaterBtn: "আমি জল খেয়েছি",
      loggedGlassBtn: "১ গ্লাস যুক্ত হয়েছে!"
    },
    // SOS Emergency Modal
    sos: {
      title: "জরুরি ও সহায়তা যোগাযোগ",
      subtitle: "তাৎক্ষণিক কল করতে নিচের যেকোনো বোতামে স্পর্শ করুন",
      primaryContact: "প্রধান পারিবারিক যোগাযোগ",
      familyPhysician: "পারিবারিক চিকিৎসক",
      elderLine: "এল্ডার লাইন হেল্পলাইন (১৪৫৬৭)",
      freeHelplineDesc: "২৪/৭ বিনামূল্যে জাতীয় প্রবীণ সহায়তা সেবা",
      tollFree: "টোল ফ্রি",
      closeBtn: "আমি নিরাপদ • এটি বন্ধ করুন"
    },
    // Cognitive Games Page
    games: {
      title: "জ্ঞানমূলক খেলাসমূহ",
      subtitle: "আপনার মনকে সতেজ ও সক্রিয় রাখতে একটি খেলা বেছে নিন।",
      playGame: "খেলা শুরু করুন",
      loading: "খেলা লোড হচ্ছে...",
      error: "খেলা লোড করা সম্ভব হয়নি।",
      recommended: "প্রস্তাবিত",
      focusExercise: "মনোযোগ অনুশীলন",
      patternLogic: "প্যাটার্ন যুক্তি",
      comingSoon: "শীঘ্রই আসছে",
      allBrainGames: "সব মস্তিষ্কের খেলা"
    },
    // Memory Challenge Game
    memoryGame: {
      backToGames: "সকল খেলায় ফিরে যান",
      title: "স্মৃতি পরীক্ষা",
      levelBadge: "{level} স্তর",
      adaptiveEngine: "অভিযোজিত জ্ঞানমূলক ইঞ্জিন",
      // Step 1: Memorization
      step1Title: "ধাপ ১: মনে রাখা",
      memorizeHeading: "এই {count}টি বস্তু মন দিয়ে মনে রাখুন",
      memorizeSubheading: "ভালো করে দেখুন। {seconds} সেকেন্ডের মধ্যে এগুলো অদৃশ্য হবে।",
      imReady: "আমি প্রস্তুত",
      // Step 2: Recall
      step2Title: "ধাপ ২: মনে করে বলা",
      recallHeading: "আপনি কোন কোন বস্তু দেখেছিলেন?",
      recallSubheading: "আগে যে বস্তুগুলো দেখেছিলেন সেগুলোতে স্পর্শ করে বেছে নিন, তারপর জমা দিন।",
      selectedCount: "নির্বাচিত: {count}টি বস্তু",
      submitAnswers: "উত্তর জমা দিন",
      // Step 3: Results
      gameCompleted: "খেলা সম্পন্ন হয়েছে",
      perfectRecallTitle: "নিখুঁত স্মৃতিশক্তি, আম্মা! 🌟",
      perfectRecallMsg: "অসাধারণ! আপনি একটি ভুল ছাড়াও সবকটি বস্তু সঠিকভাবে মনে রেখেছেন!",
      wonderfulMemoryTitle: "চমৎকার স্মৃতিশক্তি, আম্মা! 🎉",
      wonderfulMemoryMsg: "আপনি খুব সুন্দরভাবে বেশিরভাগ বস্তু মনে রেখেছেন!",
      goodPracticeTitle: "সুন্দর প্রচেষ্টা, আম্মা! 🌸",
      goodPracticeMsg: "প্রতিদিনের অনুশীলন আপনার স্মৃতিশক্তিকে আরও সতেজ রাখবে। চমৎকার প্রয়াস!",
      scoreLabel: "স্কোর",
      accuracyLabel: "{percentage}% সঠিকতা",
      responseTimeLabel: "প্রতিক্রিয়ার সময়",
      elapsedTimeLabel: "মোট সময়",
      currentLevelLabel: "বর্তমান স্তর",
      adaptiveLabel: "অভিযোজিত",
      adaptiveRecommendation: "অভিযোজিত স্তরের সুপারিশ",
      correctAnswers: "সঠিক উত্তরসমূহ ({count})",
      correctAnswersSub: "যেসব বস্তু আপনি সঠিকভাবে নির্বাচন করেছেন",
      reviewLearn: "পর্যালোচনা ও শিক্ষা",
      reviewLearnSub: "যেসব বস্তু বাদ পড়েছে বা ছিল না",
      correctBadge: "সঠিক",
      missedBadge: "বাদ পড়েছে",
      notShownBadge: "ছিল না",
      playAgain: "আবার খেলুন",
      // Pool Object Names
      objects: {
        tea: "অসম চা",
        orchid: "কপো ফুল",
        rhino: "একশৃঙ্গ গণ্ডার",
        apple: "লাল আপেল",
        mango: "মিষ্টি আম",
        bell: "মন্দিরের ঘণ্টা",
        lotus: "গোলাপি পদ্ম",
        banana: "তাজা কলা",
        coconut: "ডাব / নারকেল",
        parrot: "সবুজ টিয়া পাখি",
        elephant: "শান্ত হাতি",
        sun: "সকালের সূর্য"
      }
    },
    // Reminders Page
    reminders: {
      backToHome: "হোমে ফিরে যান",
      title: "আজকের অনুস্মারকসমূহ",
      subtitle: "প্রতিটি কাজ সম্পন্ন করার পর \"সম্পন্ন\" বোতামে স্পর্শ করুন।",
      addReminderBtn: "অনুস্মারক যোগ করুন",
      dailyProgress: "দৈনিক অগ্রগতি",
      doneCount: "{completed} / {total} সম্পন্ন",
      progressAria: "{percent}% অনুস্মারক সম্পন্ন হয়েছে",
      filterAll: "সব",
      filterMedicine: "ওষুধ",
      filterHydration: "জলপান",
      filterActivity: "কার্যকলাপ",
      filterAppointment: "অ্যাপয়েন্টমেন্ট",
      markDone: "সম্পন্ন করুন",
      done: "সম্পন্ন ✓",
      noReminders: "আজকের জন্য এখনও কোনো অনুস্মারক নেই।",
      noFilteredReminders: "আজ কোনো {type} অনুস্মারক নেই।",
      tapAddPrompt: "নতুন অনুস্মারক তৈরি করতে ওপরের \"অনুস্মারক যোগ করুন\" বোতামে চাপ দিন।",
      // Form modal
      addNewReminder: "নতুন অনুস্মারক যোগ করুন",
      formSubtitle: "নিচের তথ্যগুলো পূরণ করে \"সংরক্ষণ করুন\" বোতামে চাপ দিন।",
      reminderType: "অনুস্মারকের ধরন",
      titleInput: "শিরোনাম",
      titlePlaceholder: "যেমন: সন্ধ্যার রক্তচাপের ট্যাবলেট",
      titleRequired: "অনুগ্রহ করে অনুস্মারকের শিরোনাম লিখুন।",
      timeRequired: "অনুগ্রহ করে সময় নির্বাচন করুন।",
      descriptionInput: "বিবরণ (ঐচ্ছিক)",
      descriptionPlaceholder: "অতিরিক্ত কোনো নির্দেশনা বা তথ্য...",
      dateInput: "তারিখ",
      timeInput: "সময়",
      saveReminder: "সংরক্ষণ করুন",
      cancel: "বাতিল",
      completedBadge: "✓ সম্পন্ন"
    },
    // Voice Assistant Page
    voice: {
      backToHome: "হোমে ফিরে যান",
      title: "ভয়েস সঙ্গী",
      subtitle: "নিচের বড় বেগুনি মাইক্রোফোনে স্পর্শ করে স্বাভাবিকভাবে কথা বলুন।",
      assistantTitle: "মাইন্ডকেয়ার সহকারী",
      initialGreeting: "নমস্কার দাদু! আমি আপনার মাইন্ডকেয়ার ভয়েস সহকারী। এখন আপনাকে কীভাবে সাহায্য করতে পারি?",
      listeningPrompt: "বাংলা অথবা ইংরেজিতে শুনছি...",
      listeningFeedback: "আপনি জানতে চেয়েছেন: 'আমার পরবর্তী অনুস্মারক কী?'",
      reminderResponse: "আপনার পরবর্তী অনুস্মারক সকাল ১০:৩০ মিনিটে: বিস্কুট দিয়ে গরম এক কাপ চা পান করুন।",
      medicineResponse: "আপনি সকাল ৮:৩০ মিনিটে রক্তচাপের ওষুধ খেয়েছেন। আপনার পরবর্তী ওষুধ দুপুর ১:০০ টায় (দুপুরের খাবার পর)।",
      callPriyaResponse: "আপনার মেয়ে প্রিয়া হাজারিকার (+৯১ ৯৮৬৪০ ১২৩৪৫) সাথে সংযোগ করা হচ্ছে...",
      generalResponse: "আমি আপনার কথা শুনতে পেয়েছি: \"{phrase}\"। সবকিছু ঠিকঠাক রয়েছে।",
      tapToSpeak: "কথা বলতে মাইক্রোফোনে স্পর্শ করুন",
      listeningNow: "শুনছি... এখন কথা বলুন",
      suggestionsHeader: "অথবা নিচের সাধারণ প্রশ্নে স্পর্শ করুন:"
    },
    // Caregiver Dashboard
    caregiver: {
      backToPatient: "রোগীর অ্যাপ হোম",
      dashboardTitle: "তত্ত্বাবধায়ক ড্যাশবোর্ড",
      monitoring: "{name}-এর পর্যবেক্ষণ",
      activeAlerts: "{count}টি সক্রিয় সতর্কতা",
      statusLabel: "অবস্থা",
      safeConnected: "নিরাপদ ও সংযুক্ত",
      caregiverLabel: "তত্ত্বাবধায়ক",
      physicianLabel: "চিকিৎসক",
      nextAppointmentLabel: "পরবর্তী অ্যাপয়েন্টমেন্ট",
      lastCheckIn: "সর্বশেষ যোগাযোগ: {time}",
      cognitivePerformance: "এই সপ্তাহের জ্ঞানমূলক কর্মক্ষমতা",
      weeklyChartTitle: "সাপ্তাহিক জ্ঞানমূলক কর্মক্ষমতা",
      weeklyChartSub: "স্মৃতিশক্তি, মনোযোগ ও প্যাটার্ন শনাক্তকরণ (%) — গত ৭ দিন",
      gamesCompleted: "এই সপ্তাহে সম্পন্ন হওয়া খেলাসমূহ",
      sessionsCompletedSub: "৭ দিনের মধ্যে সম্পন্ন হওয়া সেশন",
      medicationAdherence: "ওষুধ সেবনের নিয়মনিষ্ঠতা",
      medicationsTracked: "প্রতিদিনের ৩টি ওষুধ পর্যবেক্ষণ করা হচ্ছে",
      overallThisWeek: "এই সপ্তাহের গড় হার",
      dailyDoses: "এই সপ্তাহ — দৈনিক ডোজ",
      recentActivity: "সাম্প্রতিক কার্যকলাপ",
      recentActivitySub: "গত ৪৮ ঘণ্টার রোগীর লাইভ কার্যকলাপ",
      alertsTitle: "সতর্কতা বার্তা ({count}টি সক্রিয়)",
      resolvedCount: "{count}টি সমাধান হয়েছে",
      noAlerts: "কোনো সক্রিয় সতর্কতা নেই। সবকিছু স্বাভাবিক আছে!",
      statMemory: "স্মৃতিশক্তি",
      statAttention: "মনোযোগ",
      statPattern: "প্যাটার্ন",
      statLevel: "স্তর",
      statSessions: "{count}টি সেশন",
      totalSessions: "মোট সেশন",
      bestAvgScore: "সর্বোচ্চ গড় স্কোর",
      daysActive: "সক্রিয় দিন"
    },
    // Backend Status
    systemStatus: {
      title: "সিস্টেমের অবস্থা",
      backendApi: "ব্যাকএন্ড এপিআই",
      postgresDb: "পোস্টগ্রেসকিউএল ডাটাবেস",
      connected: "● সংযুক্ত",
      error: "● ত্রুটি",
      checking: "● যাচাই করা হচ্ছে..."
    },
    // Difficulties
    difficulty: {
      easy: "সহজ",
      medium: "মাঝারি",
      hard: "কঠিন",
      adaptive: "অভিযোজিত"
    },
    // Alert Badges
    alertBadge: {
      warning: "সতর্কতা",
      info: "তথ্য",
      resolved: "সমাধান হয়েছে",
      resolvedText: "সমাধান হয়েছে"
    },
    vsLastWeek: "গত সপ্তাহের তুলনায়",
    nextLabel: "পরবর্তী:",
    chartType: {
      line: "রেখা",
      bar: "দণ্ড"
    },
    ageLabel: "বয়স",
    daysLabel: "দিন",
    avgLabel: "গড়",
    adaptiveRecommendations: {
      increased: "চমৎকার! আপনার স্মৃতিশক্তি দ্রুত ও নির্ভুল ছিল। আগামীকালের চ্যালেঞ্জ একটু কঠিন হবে ({nextDifficulty})।",
      atMax: "অসাধারণ স্মৃতিশক্তি! আপনি আমাদের সর্বোচ্চ কঠিনতম স্তরে দক্ষতার সাথে এগিয়ে যাচ্ছেন।",
      decreased: "সুন্দর প্রচেষ্টা, আম্মা! আপনি যেন স্বাচ্ছন্দ্যে অনুশীলন করতে পারেন তার জন্য চ্যালেঞ্জ কমানো হয়েছে ({nextDifficulty})।",
      atMin: "আপনার নিজের গতিতে অনুশীলন চালিয়ে যান। প্রতিদিনের নিয়মিত অনুশীলন স্মৃতিশক্তি ধরে রাখতে সাহায্য করে।",
      maintained: "ধারাবাহিক অগ্রগতি! আপনি ভালো করছেন। আপনার পরবর্তী সেশনের জন্য এই স্বাচ্ছন্দ্যময় স্তর বজায় রাখব।"
    }
  }
};
