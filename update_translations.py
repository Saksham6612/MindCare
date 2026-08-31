import json

en_file = 'frontend/src/locales/en/translation.json'
as_file = 'frontend/src/locales/as/translation.json'

with open(en_file, 'r') as f:
    en_data = json.load(f)

with open(as_file, 'r') as f:
    as_data = json.load(f)

en_additions = {
    "voice": {
        "back_to_home": "Back to Home",
        "title": "Voice Companion",
        "subtitle": "Tap the big purple microphone below and speak naturally.",
        "assistant_title": "MindCare Assistant",
        "stop_listening": "Stop listening",
        "start_speaking": "Start speaking to assistant",
        "listening_status": "Listening... Speak now",
        "tap_to_speak": "Tap Microphone to Speak",
        "suggested_title": "Or tap any common question below:"
    },
    "reminders": {
        "title": "Reminders",
        "subtitle": "Manage daily medicine, hydration, and appointments.",
        "add_new": "Add New Reminder",
        "type": "Type",
        "time": "Time",
        "medicine_name": "Medicine Name",
        "dosage": "Dosage",
        "frequency": "Frequency",
        "add_reminder": "Add Reminder",
        "cancel": "Cancel",
        "save": "Save",
        "status_taken": "Taken",
        "status_pending": "Pending"
    },
    "caregiver": {
        "title": "Caregiver Dashboard",
        "subtitle": "Monitor activity and health metrics",
        "recent_activity": "Recent Activity",
        "performance": "Performance",
        "alerts": "Alerts",
        "stats": "Quick Stats"
    },
    "games": {
        "title": "Games",
        "subtitle": "Keep your mind active with fun exercises.",
        "memory_game": "Memory Game",
        "word_game": "Word Match",
        "play_now": "Play Now",
        "difficulty": "Difficulty",
        "easy": "Easy",
        "medium": "Medium",
        "hard": "Hard"
    },
    "memory_spotlight": {
        "cherished_memory": "Cherished Memory of the Day",
        "with": "With:",
        "listen": "Listen to Memory",
        "playing_audio": "Playing Audio Story...",
        "remember": "I Remember!",
        "remember_this": "I Remember This!"
    },
    "common": {
        "loading": "Loading...",
        "error": "An error occurred",
        "save": "Save",
        "cancel": "Cancel",
        "close": "Close"
    }
}

as_additions = {
    "voice": {
        "back_to_home": "মুখ্য পৃষ্ঠালৈ উভতি যাওক",
        "title": "কণ্ঠ লগৰীয়া",
        "subtitle": "তলৰ ডাঙৰ বেঙুনীয়া মাইক্ৰ'ফ'নটো স্পৰ্শ কৰক আৰু স্বাভাৱিকভাৱে কথা পাতক।",
        "assistant_title": "MindCare সহায়ক",
        "stop_listening": "শুনা বন্ধ কৰক",
        "start_speaking": "সহায়কৰ সৈতে কথা পাতক",
        "listening_status": "শুনি আছোঁ... এতিয়া কওক",
        "tap_to_speak": "কথা পাতিবলৈ মাইক্ৰ'ফ'ন স্পৰ্শ কৰক",
        "suggested_title": "বা তলৰ যিকোনো সাধাৰণ প্ৰশ্ন স্পৰ্শ কৰক:"
    },
    "reminders": {
        "title": "সোঁৱৰণী",
        "subtitle": "দৈনিক ঔষধ, পানী আৰু সাক্ষাৎকাৰ পৰিচালনা কৰক।",
        "add_new": "নতুন সোঁৱৰণী যোগ কৰক",
        "type": "প্ৰকাৰ",
        "time": "সময়",
        "medicine_name": "ঔষধৰ নাম",
        "dosage": "মাত্ৰা",
        "frequency": "সঘনতা",
        "add_reminder": "সোঁৱৰণী যোগ কৰক",
        "cancel": "বাতিল কৰক",
        "save": "সংৰক্ষণ কৰক",
        "status_taken": "খোৱা হৈছে",
        "status_pending": "বাকী আছে"
    },
    "caregiver": {
        "title": "যত্ন লওঁতাৰ ডেচবৰ্ড",
        "subtitle": "কাৰ্যকলাপ আৰু স্বাস্থ্যৰ মেট্ৰিক্স নিৰীক্ষণ কৰক",
        "recent_activity": "সাম্প্ৰতিক কাৰ্যকলাপ",
        "performance": "প্ৰদৰ্শন",
        "alerts": "সতৰ্কবাণী",
        "stats": "দ্ৰুত পৰিসংখ্যা"
    },
    "games": {
        "title": "খেল",
        "subtitle": "মজাৰ ব্যায়ামৰ সৈতে আপোনাৰ মন সক্ৰিয় ৰাখক।",
        "memory_game": "স্মৃতিশক্তিৰ খেল",
        "word_game": "শব্দ মিলোৱা",
        "play_now": "এতিয়াই খেলক",
        "difficulty": "কঠিনতা",
        "easy": "সহজ",
        "medium": "মজলীয়া",
        "hard": "কঠিন"
    },
    "memory_spotlight": {
        "cherished_memory": "দিনটোৰ মৰমৰ স্মৃতি",
        "with": "সৈতে:",
        "listen": "স্মৃতি শুনক",
        "playing_audio": "অডিঅ' কাহিনী বাজি আছে...",
        "remember": "মোৰ মনত আছে!",
        "remember_this": "এইটো মোৰ মনত আছে!"
    },
    "common": {
        "loading": "লোড হৈ আছে...",
        "error": "এটা ত্ৰুটি ঘটিছে",
        "save": "সংৰক্ষণ কৰক",
        "cancel": "বাতিল কৰক",
        "close": "বন্ধ কৰক"
    }
}

en_data.update(en_additions)
as_data.update(as_additions)

with open(en_file, 'w') as f:
    json.dump(en_data, f, indent=2, ensure_ascii=False)

with open(as_file, 'w') as f:
    json.dump(as_data, f, indent=2, ensure_ascii=False)

print("Translation JSONs updated.")
