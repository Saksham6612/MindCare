/**
 * MindCare Intent Processor - Phase 3C (Robust Wake Phrase Stripping & Entity Extraction)
 * 
 * Deterministic, rule-based natural language intent processor for voice inputs.
 * Cleanly strips conversational wake phrases ("Hey MindCare", "Mind care", etc.)
 * before intent matching and parameter extraction to ensure clean task extraction.
 */

export const INTENTS = {
  GET_TODAY_REMINDERS: 'GET_TODAY_REMINDERS',
  GET_NEXT_REMINDER: 'GET_NEXT_REMINDER',
  CREATE_REMINDER: 'CREATE_REMINDER',
  CONFIRM: 'CONFIRM',
  CANCEL: 'CANCEL',
  START_GAME: 'START_GAME',
  GET_PROGRESS: 'GET_PROGRESS',
  GET_RECENT_ACTIVITY: 'GET_RECENT_ACTIVITY',
  HELP: 'HELP',
  UNKNOWN: 'UNKNOWN',
};

export const START_MEMORY_GAME_RESPONSE = "Okay. Let's start a memory game.";
export const UNSUPPORTED_GAME_RESPONSE = "That game isn't available yet. You can play the memory game.";
export const PROGRESS_NO_DATA_RESPONSE = "You haven't completed any activities yet. Let's start when you're ready.";
export const PROGRESS_ERROR_RESPONSE = "I'm sorry, I couldn't check your progress right now.";
export const RECENT_ACTIVITY_NO_DATA_RESPONSE = "You haven't completed any recent activities.";
export const RECENT_ACTIVITY_ERROR_RESPONSE = "I'm sorry, I couldn't check your recent activity right now.";

/**
 * Converts activity titles into conversational, dementia-friendly spoken verb phrases.
 */
export function naturalizeActivityTitle(title) {
  if (!title) return 'completed an activity';
  const clean = title.trim().toLowerCase();

  if (clean.includes('memory game')) {
    return 'completed a memory game';
  }
  if (clean.includes('attention game')) {
    return 'completed an attention game';
  }
  if (clean.includes('pattern game')) {
    return 'completed a pattern game';
  }
  if (clean.includes('hydration') || clean.includes('water')) {
    return 'logged your hydration';
  }
  if (clean.includes('morning tablet') || clean.includes('morning medicine')) {
    return 'took your morning medicine';
  }
  if (clean.includes('evening tablet') || clean.includes('night memory medicine')) {
    return 'took your evening medicine';
  }
  if (clean.includes('tablet') || clean.includes('medicine')) {
    return `took your ${clean.replace(/^took\s+/i, '').replace(/^take\s+/i, '')}`;
  }
  if (clean.includes('walk')) {
    return 'went for a walk';
  }
  if (clean.includes('mood')) {
    return 'checked in your mood';
  }
  if (clean.includes('check-up') || clean.includes('checkup')) {
    return 'attended your check-up';
  }

  return clean;
}

/**
 * Formats a dementia-friendly voice response from PostgreSQL recent activities list.
 * Example: "You recently completed a memory game, logged your hydration, and took your morning medicine."
 * Single: "Recently, you completed a memory game."
 * No-data: "You haven't completed any recent activities."
 * 
 * @param {Array<object>} activities - List of recent activity rows from PostgreSQL
 * @returns {string} Spoken activity summary
 */
export function formatRecentActivityVoiceResponse(activities) {
  if (!Array.isArray(activities) || activities.length === 0) {
    return RECENT_ACTIVITY_NO_DATA_RESPONSE;
  }

  const valid = activities.filter((a) => a && a.completed !== false).slice(0, 3);
  if (valid.length === 0) {
    return RECENT_ACTIVITY_NO_DATA_RESPONSE;
  }

  if (valid.length === 1) {
    const actPhrase = naturalizeActivityTitle(valid[0].title);
    return `Recently, you ${actPhrase}.`;
  }

  if (valid.length === 2) {
    const first = naturalizeActivityTitle(valid[0].title);
    const second = naturalizeActivityTitle(valid[1].title);
    return `You recently ${first} and ${second}.`;
  }

  const phrases = valid.map((a) => naturalizeActivityTitle(a.title));
  const last = phrases.pop();
  return `You recently ${phrases.join(', ')}, and ${last}.`;
}

/**
 * Formats a proactive voice announcement for a newly due reminder.
 * Example (medicine): "It's time for your medicine. Morning Blood Pressure Tablet."
 * Example (hydration): "It's time to drink some water. Drink Water & Warm Tea."
 * Example (activity): "It's time for your activity. Gentle Verandah Walk."
 * Example (appointment): "You have an appointment. Neurology Check-up."
 * 
 * @param {object} reminder - { title, type }
 * @returns {string} Short, calm spoken announcement
 */
export function formatProactiveReminderAnnouncement(reminder) {
  if (!reminder) return '';
  const type = (reminder.type || 'medicine').toLowerCase();
  const rawTitle = reminder.title || 'scheduled reminder';
  const title = rawTitle.replace(/[.,!?;:]+$/, '').trim();

  if (type === 'medicine') {
    return `It's time for your medicine. ${title}.`;
  }
  if (type === 'hydration') {
    return `It's time to drink some water. ${title}.`;
  }
  if (type === 'activity') {
    return `It's time for your activity. ${title}.`;
  }
  if (type === 'appointment') {
    return `You have an appointment. ${title}.`;
  }
  return `It's time for your scheduled reminder. ${title}.`;
}

/**
 * Formats a dementia-friendly, calm voice response summarizing the patient's real PostgreSQL progress.
 * Example: "You're doing well. Your memory score is 86 percent, and you've completed 14 activities this week."
 * Empty state: "You haven't completed any activities yet. Let's start when you're ready."
 * 
 * @param {object} progress - { memoryScore, attentionScore, patternScore, overallScore, gamesCompleted, weeklyActivities, hasData }
 * @returns {string} Spoken progress string
 */
export function formatProgressVoiceResponse(progress) {
  if (!progress || progress.hasData === false) {
    return PROGRESS_NO_DATA_RESPONSE;
  }

  const score = progress.memoryScore != null ? progress.memoryScore : progress.overallScore;
  const activities = progress.weeklyActivities != null ? progress.weeklyActivities : progress.gamesCompleted;

  if (score == null && (!activities || activities === 0)) {
    return PROGRESS_NO_DATA_RESPONSE;
  }

  if (score != null && activities > 0) {
    const actWord = activities === 1 ? 'activity' : 'activities';
    return `You're doing well. Your memory score is ${score} percent, and you've completed ${activities} ${actWord} this week.`;
  }

  if (score != null) {
    return `You're doing well. Your memory score is ${score} percent.`;
  }

  const actWord = activities === 1 ? 'activity' : 'activities';
  return `You're doing well. You've completed ${activities} ${actWord} this week.`;
}

/**
 * Standard responses for each intent.
 * Kept short, calm, and dementia-friendly without technical jargon.
 */
export const INTENT_RESPONSES = {
  [INTENTS.GET_TODAY_REMINDERS]: "You asked about today's reminders.",
  [INTENTS.GET_NEXT_REMINDER]: "You asked about your next reminder.",
  [INTENTS.CREATE_REMINDER]: "I understood that you want to create a reminder.",
  [INTENTS.CONFIRM]: "Confirmed.",
  [INTENTS.CANCEL]: "Okay. I won't create that reminder.",
  [INTENTS.START_GAME]: START_MEMORY_GAME_RESPONSE,
  [INTENTS.GET_PROGRESS]: "I understood that you want to see your progress.",
  [INTENTS.GET_RECENT_ACTIVITY]: "I understood that you want to see your recent activity.",
  [INTENTS.HELP]: "I can help you with reminders, games, progress, and more.",
  [INTENTS.UNKNOWN]: "I'm sorry, I didn't understand. Please try again.",
};

export const CREATE_REMINDER_CANCELLED_RESPONSE = "Okay. I won't create that reminder.";
export const CREATE_REMINDER_MISSING_TIME_PROMPT = "What time should I remind you?";
export const CREATE_REMINDER_MISSING_TASK_PROMPT = "What would you like me to remind you about?";
export const CREATE_REMINDER_FAILURE_RESPONSE = "I'm sorry, I couldn't create that reminder right now.";

// Word to number mapping for spoken times and quantities
const WORD_TO_NUMBER = {
  'one': '1', 'two': '2', 'three': '3', 'four': '4', 'five': '5',
  'six': '6', 'seven': '7', 'eight': '8', 'nine': '9', 'ten': '10',
  'eleven': '11', 'twelve': '12', 'thirteen': '13', 'fourteen': '14',
  'fifteen': '15', 'sixteen': '16', 'seventeen': '17', 'eighteen': '18',
  'nineteen': '19', 'twenty': '20', 'thirty': '30', 'forty': '40',
  'fifty': '50', 'half': '30', 'quarter': '15'
};

const NUMBER_WORDS_COUNT = [
  'no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'
];

/**
 * Formats a time string (e.g. "13:00", "08:30:00", "17:00") into calm speech-friendly format ("1 PM", "8:30 AM", "5 PM").
 */
export function formatTimeForSpeech(timeStr) {
  if (!timeStr) return '';
  const clean = timeStr.trim();
  const match = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const meridian = hours >= 12 ? 'PM' : 'AM';
    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;
    if (minutes === '00') {
      return `${hours} ${meridian}`;
    }
    return `${hours}:${minutes} ${meridian}`;
  }
  return clean;
}

export const formatTimeDisplay = formatTimeForSpeech;

/**
 * Extracts a concise speech-friendly label from a reminder object.
 */
function getSpeechFriendlyReminderTitle(reminder) {
  if (!reminder) return 'reminder';
  if (reminder.title) {
    return reminder.title.replace(/[.,!?;:]+$/, '').trim();
  }
  if (reminder.type) {
    return reminder.type;
  }
  return 'reminder';
}

/**
 * Formats database reminders array into a short, calm, dementia-friendly spoken response.
 */
export function formatTodayRemindersVoiceResponse(reminders) {
  if (!Array.isArray(reminders) || reminders.length === 0) {
    return "You have no reminders for today.";
  }

  const count = reminders.length;
  const countWord = NUMBER_WORDS_COUNT[count] || String(count);

  if (count === 1) {
    const item = reminders[0];
    const time = formatTimeForSpeech(item.reminder_time);
    const name = getSpeechFriendlyReminderTitle(item);
    return `You have one reminder today. Your ${name} is at ${time}.`;
  }

  const itemsText = reminders
    .map((item, idx) => {
      const time = formatTimeForSpeech(item.reminder_time);
      const name = getSpeechFriendlyReminderTitle(item);
      if (idx === 0) {
        return `Your ${name} is at ${time}`;
      }
      if (idx === reminders.length - 1) {
        return `and your ${name} is at ${time}`;
      }
      return `${name} is at ${time}`;
    })
    .join(', ');

  return `You have ${countWord} reminders today. ${itemsText}.`;
}

/**
 * Formats a single upcoming reminder into a calm, dementia-friendly spoken response.
 */
export function formatNextReminderVoiceResponse(reminder) {
  if (!reminder) {
    return "You have no more reminders today.";
  }

  const name = getSpeechFriendlyReminderTitle(reminder);
  const time = formatTimeForSpeech(reminder.reminder_time);

  if (reminder.type === 'medicine') {
    return `Your next medicine reminder is ${name} at ${time}.`;
  }

  return `Your next reminder is ${name} at ${time}.`;
}

/**
 * Formats the confirmation question for CREATE_REMINDER.
 * Example: "I'll remind you to drink water at 4 PM. Should I set that reminder?"
 */
export function formatCreateReminderConfirmationPrompt(task, time) {
  const formattedTime = formatTimeForSpeech(time);
  return `I'll remind you to ${task} at ${formattedTime}. Should I set that reminder?`;
}

/**
 * Formats the success message after CREATE_REMINDER is confirmed and saved.
 * Example: "Done. I'll remind you to drink water at 4 PM."
 */
export function formatCreateReminderSuccessResponse(task, time) {
  const formattedTime = formatTimeForSpeech(time);
  return `Done. I'll remind you to ${task} at ${formattedTime}.`;
}

/**
 * Extracts and normalizes a time expression from short voice answers (e.g. "4 PM", "at 4 PM").
 * @param {string} text
 * @returns {string|null} Normalized "HH:MM" or null
 */
export function extractTimeFromUtterance(text) {
  if (!text || typeof text !== 'string') return null;
  const cleaned = text.trim().replace(/^(at|around|for|by)\s+/i, '').trim();
  const normalized = normalizeTime(cleaned);
  if (/^\d{2}:\d{2}$/.test(normalized)) {
    return normalized;
  }
  return null;
}

/**
 * Normalizes speech contractions and typography.
 */
export function normalizeTranscript(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .trim()
    .replace(/\bwhat's\b/gi, 'what is')
    .replace(/\bwhats\b/gi, 'what is')
    .replace(/\bwho's\b/gi, 'who is')
    .replace(/\bwhos\b/gi, 'who is')
    .replace(/\bthere's\b/gi, 'there is')
    .replace(/\blet's\b/gi, 'let us')
    .replace(/\bcan't\b/gi, 'cannot')
    .replace(/\bdon't\b/gi, 'do not')
    .replace(/\bdont\b/gi, 'do not')
    .replace(/\bi'll\b/gi, 'i will');
}

/**
 * Strips wake phrases ("Hey MindCare", "Mind care", "Hi MindCare", etc.) and conversational
 * preambles ONLY when they appear at the start of the utterance.
 * Preserves words like "mind" and "care" when they appear in the actual task.
 * 
 * @param {string} text
 * @returns {string} Text with leading wake phrases removed
 */
export function stripWakePhraseAndPreamble(text) {
  if (!text || typeof text !== 'string') return '';

  let result = text.trim();
  let prev = '';

  // Strip leading punctuation/ellipses/whitespace
  result = result.replace(/^[\s.,!?;:—\-_/\\|]+/, '');

  while (result !== prev) {
    prev = result;

    // 1. Strip Wake Phrase combinations at the beginning of the utterance:
    // Examples: "Hey MindCare", "Hey mind care", "Hi MindCare", "MindCare", "Mind care",
    // "Okay MindCare", "OK MindCare", "Please MindCare", "Hey, MindCare", "MindCare,"
    result = result.replace(
      /^(?:hey|hi|hello|okay|ok|please)?[,\s]*(?:mindcare|mind\s+care)[!.,\s—\-_]*/i,
      ''
    );

    // 2. Strip Conversational Filler Preamble at the beginning of the utterance:
    // Examples: "please", "can you please", "could you", "i don't remember", "i almost forgot", "tell me"
    result = result.replace(
      /^(?:hey|hi|hello|please|can you please|could you please|can you|could you|would you|will you|tell me|can you tell me|could you tell me|please tell me|i almost forgot|almost forgot|i just remembered|i do not remember|i dont remember|i forgot|i do not know|i dont know|do you know|help me know)[!.,\s—\-_]*/i,
      ''
    );

    result = result.replace(/^[\s.,!?;:—\-_/\\|]+/, '');
  }

  return result.trim();
}

/**
 * Strips conversational filler prefixes, expands contractions, and normalizes text for resilient matching.
 */
export function cleanTranscript(text) {
  if (!text || typeof text !== 'string') return '';

  let cleaned = normalizeTranscript(text).toLowerCase();
  cleaned = stripWakePhraseAndPreamble(cleaned);

  // Strip all punctuation, quotes, ellipses, dashes, etc.
  cleaned = cleaned.replace(/[.,?!'":;—\-_/\\]+/g, ' ');

  return cleaned.replace(/\s+/g, ' ').trim();
}

/**
 * Formats ambiguous time clarification question.
 * Example: "Do you mean 8 AM or 8 PM?"
 */
export function formatAmbiguousTimeClarificationPrompt(hour) {
  const h = hour || 8;
  return `Do you mean ${h} AM or ${h} PM?`;
}

/**
 * Resolves user clarification responses for ambiguous hours (e.g. "8 PM", "tonight", "morning", "AM", "PM").
 */
export function resolveAmbiguousTimeAnswer(answerText, ambiguousHour) {
  if (!answerText || typeof answerText !== 'string') return null;
  const clean = answerText.trim().toLowerCase();

  // If full time expression is spoken (e.g. "8 PM", "8:00 PM", "8 tonight")
  const directNorm = normalizeTime(clean);
  if (typeof directNorm === 'string' && /^\d{2}:\d{2}$/.test(directNorm)) {
    return directNorm;
  }

  const h = ambiguousHour ? parseInt(ambiguousHour, 10) : 8;

  // PM / Evening / Tonight / Afternoon
  if (
    /\b(?:pm|p\.m|tonight|evening|this evening|in the evening|night|afternoon)\b/i.test(clean)
  ) {
    const hours = h < 12 ? h + 12 : h;
    return `${String(hours).padStart(2, '0')}:00`;
  }

  // AM / Morning
  if (
    /\b(?:am|a\.m|morning|this morning|in the morning)\b/i.test(clean)
  ) {
    const hours = h === 12 ? 0 : h;
    return `${String(hours).padStart(2, '0')}:00`;
  }

  return null;
}

/**
 * Normalizes time string expressions into 24-hour HH:MM format or flags ambiguous times.
 * Supports:
 * - "8 tonight" / "8:00 tonight" / "eight tonight" -> "20:00"
 * - "8 this evening" / "eight this evening" -> "20:00"
 * - "8 this morning" / "8:00 this morning" / "eight in the morning" -> "08:00"
 * - "2 this afternoon" / "2:00 this afternoon" / "two in the afternoon" -> "14:00"
 * - "12 noon" / "noon" -> "12:00"
 * - "12 midnight" / "midnight" -> "00:00"
 * - "4 PM" / "4 p.m." / "4:00 p.m." -> "16:00"
 * - "8:30 PM" / "eight thirty PM" -> "20:30"
 * - Ambiguous bare times: "8" / "8:00" -> { isAmbiguous: true, hour: 8 }
 */
export function normalizeTime(rawTime) {
  if (!rawTime || typeof rawTime !== 'string') return '';

  // 1. Strip trailing & leading punctuation and spaces
  let text = rawTime
    .trim()
    .toLowerCase()
    .replace(/^[.,!?;:]+|[.,!?;:]+$/g, '')
    .trim();

  // 2. Special cases: Noon and Midnight
  if (/^(?:12(?::00)?\s*)?noon$/.test(text) || text === 'noon' || text === '12 noon' || text === '12:00 noon') {
    return '12:00';
  }
  if (/^(?:12(?::00)?\s*)?midnight$/.test(text) || text === 'midnight' || text === '12 midnight' || text === '12:00 midnight') {
    return '00:00';
  }

  // 3. Time-of-day phrases
  let meridian = '';
  let hasExplicitTimeOfDay = false;

  // Evening / Night / Tonight
  if (/\b(?:tonight|this evening|in the evening|evening|at night|night)\b/i.test(text)) {
    meridian = 'PM';
    hasExplicitTimeOfDay = true;
    text = text.replace(/\b(?:tonight|this evening|in the evening|evening|at night|night)\b/gi, '').trim();
  }
  // Morning
  else if (/\b(?:this morning|in the morning|morning)\b/i.test(text)) {
    meridian = 'AM';
    hasExplicitTimeOfDay = true;
    text = text.replace(/\b(?:this morning|in the morning|morning)\b/gi, '').trim();
  }
  // Afternoon
  else if (/\b(?:this afternoon|in the afternoon|afternoon)\b/i.test(text)) {
    meridian = 'PM';
    hasExplicitTimeOfDay = true;
    text = text.replace(/\b(?:this afternoon|in the afternoon|afternoon)\b/gi, '').trim();
  }

  // 4. Detect and extract AM / PM in all variations
  if (/(?:p\.m\.|p\.m|p\s+m|pm)[.,!?;:]*$/i.test(text) || /\b(?:p\.m\.|p\.m|p\s+m|pm)\b/i.test(text)) {
    meridian = 'PM';
    hasExplicitTimeOfDay = true;
    text = text.replace(/(?:p\.m\.|p\.m|p\s+m|pm)[.,!?;:]*$/i, '').trim();
    text = text.replace(/\b(?:p\.m\.|p\.m|p\s+m|pm)\b/gi, '').trim();
  } else if (/(?:a\.m\.|a\.m|a\s+m|am)[.,!?;:]*$/i.test(text) || /\b(?:a\.m\.|a\.m|a\s+m|am)\b/i.test(text)) {
    meridian = 'AM';
    hasExplicitTimeOfDay = true;
    text = text.replace(/(?:a\.m\.|a\.m|a\s+m|am)[.,!?;:]*$/i, '').trim();
    text = text.replace(/\b(?:a\.m\.|a\.m|a\s+m|am)\b/gi, '').trim();
  }

  // 5. Handle o'clock notation
  if (/\b(?:o'clock|o clock)\b/i.test(text)) {
    text = text.replace(/\b(?:o'clock|o clock)\b/gi, '').trim();
  }

  // 6. Convert spoken number words
  // Composite numbers: "four thirty" -> "4:30"
  text = text.replace(
    /\b(one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+(fifteen|thirty|forty-five|forty five)\b/i,
    (_, h, m) => {
      const hours = WORD_TO_NUMBER[h] || h;
      const minutes = m.includes('fifteen') ? '15' : m.includes('thirty') ? '30' : '45';
      return `${hours}:${minutes}`;
    }
  );

  // Single word numbers: "eight" -> "8", "two" -> "2"
  for (const [word, num] of Object.entries(WORD_TO_NUMBER)) {
    const reg = new RegExp(`\\b${word}\\b`, 'gi');
    text = text.replace(reg, num);
  }

  text = text.replace(/^[.,!?;:]+|[.,!?;:]+$/g, '').trim();

  // 7. Format conversion to 24-hour HH:MM
  // Case A: "8:00" or "8:30" or "16:00"
  const colonMatch = text.match(/^(\d{1,2}):(\d{2})$/);
  if (colonMatch) {
    let hours = parseInt(colonMatch[1], 10);
    const minutes = colonMatch[2];

    // 24-hour unambiguous time e.g. 13:00 -> 23:59
    if (hours >= 13 && hours <= 23) {
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    }

    if (!hasExplicitTimeOfDay && !meridian) {
      // Ambiguous bare time: e.g. "8:00"
      return { isAmbiguous: true, hour: hours, minutes };
    }

    if (meridian === 'PM' && hours < 12) {
      hours += 12;
    } else if (meridian === 'AM' && hours === 12) {
      hours = 0;
    }
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }

  // Case B: Single digit hour e.g. "8", "2", "16"
  const singleNumMatch = text.match(/^(\d{1,2})$/);
  if (singleNumMatch) {
    let hours = parseInt(singleNumMatch[1], 10);

    if (hours >= 13 && hours <= 23) {
      return `${String(hours).padStart(2, '0')}:00`;
    }

    if (!hasExplicitTimeOfDay && !meridian) {
      // Ambiguous bare hour: e.g. "8"
      return { isAmbiguous: true, hour: hours, minutes: '00' };
    }

    if (meridian === 'PM' && hours < 12) {
      hours += 12;
    } else if (meridian === 'AM' && hours === 12) {
      hours = 0;
    }
    return `${String(hours).padStart(2, '0')}:00`;
  }

  return rawTime.trim();
}

/**
 * Extracts reminder parameters (task, time, isAmbiguous, ambiguousHour) from a transcript with robust
 * wake phrase stripping, trigger prefix isolation, and natural time parsing.
 * 
 * @param {string} cleanedText - Transcript with wake phrase already stripped
 * @returns {{ task?: string, time?: string, isAmbiguous?: boolean, ambiguousHour?: number }}
 */
export function extractReminderParameters(cleanedText) {
  const parameters = {};
  if (!cleanedText || typeof cleanedText !== 'string') return parameters;

  // Ensure wake phrases and preambles are stripped from the start
  let text = stripWakePhraseAndPreamble(normalizeTranscript(cleanedText));

  // 1. Strip reminder trigger prefix from the start:
  // "remind me to", "set a reminder to", "set reminder to", "add a reminder for", "create reminder to", etc.
  text = text.replace(
    /^(?:please\s+)?(?:could you\s+|can you\s+|would you\s+)?(?:remind me to|set a reminder to|set a reminder for|set reminder to|set reminder for|add a reminder to|add a reminder for|add reminder to|add reminder for|create a reminder to|create a reminder for|create reminder to|create reminder for|create reminder|remind me about|remind me)[,\s]*/i,
    ''
  ).trim();

  // 2. Identify time expression near the end of the sentence:
  // Matches:
  // - "at noon", "at midnight", "at 12 noon", "at 12 midnight"
  // - "at 8 tonight", "at 8:00 tonight", "at eight tonight", "at 8 this evening"
  // - "at 8 this morning", "at eight in the morning"
  // - "at 2 this afternoon", "at two in the afternoon"
  // - "at 4 PM", "at 4:00 p.m.", "at four thirty PM"
  // - "at 8", "at 8:00", "at eight"
  const timeRegex = /(?:,\s*)?(?:\s+(?:at|around|for|by)\s+|\s+@\s+)(noon|midnight|12(?::00)?\s*(?:noon|midnight)|(?:(?:\d{1,2}(?::\d{2})?|(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)(?:\s+(?:fifteen|thirty|forty-five|forty five))?)\s*(?:(?:am|pm|a\.m\.|p\.m\.|o'clock)|(?:tonight|this evening|in the evening|evening|at night|night|this morning|in the morning|morning|this afternoon|in the afternoon|afternoon))?))[.,!?;:]*$/i;

  const timeMatch = text.match(timeRegex);

  if (timeMatch) {
    const rawTimeCandidate = timeMatch[1].trim();
    const normalized = normalizeTime(rawTimeCandidate);

    // Case A: Unambiguous 24-hour time "HH:MM"
    if (typeof normalized === 'string' && /^\d{2}:\d{2}$/.test(normalized)) {
      parameters.time = normalized;

      let taskPart = text.substring(0, timeMatch.index).trim();
      taskPart = taskPart
        .replace(/^[.,!?;:—\-_/\\|\s]+|[.,!?;:—\-_/\\|\s]+$/g, '')
        .replace(/^(to\s+|for\s+|about\s+)/i, '')
        .replace(/^[.,!?;:—\-_/\\|\s]+|[.,!?;:—\-_/\\|\s]+$/g, '')
        .trim();

      if (taskPart) {
        parameters.task = taskPart;
      }
      return parameters;
    }

    // Case B: Ambiguous time e.g. bare "8" -> require clarification
    if (typeof normalized === 'object' && normalized.isAmbiguous) {
      parameters.isAmbiguous = true;
      parameters.ambiguousHour = normalized.hour;

      let taskPart = text.substring(0, timeMatch.index).trim();
      taskPart = taskPart
        .replace(/^[.,!?;:—\-_/\\|\s]+|[.,!?;:—\-_/\\|\s]+$/g, '')
        .replace(/^(to\s+|for\s+|about\s+)/i, '')
        .replace(/^[.,!?;:—\-_/\\|\s]+|[.,!?;:—\-_/\\|\s]+$/g, '')
        .trim();

      if (taskPart) {
        parameters.task = taskPart;
      }
      return parameters;
    }
  }

  // Fallback 2: General time clause if specific regex missed
  const fallbackTimePattern = /(?:,\s*)?(?:\s+(?:at|around|@)\s+)(.+?)[.,!?;:]*$/i;
  const fallbackTimeMatch = text.match(fallbackTimePattern);
  if (fallbackTimeMatch) {
    const rawTimeCandidate = fallbackTimeMatch[1].trim();
    const normalized = normalizeTime(rawTimeCandidate);

    if (typeof normalized === 'string' && /^\d{2}:\d{2}$/.test(normalized)) {
      parameters.time = normalized;
      let taskPart = text.substring(0, fallbackTimeMatch.index).trim();
      taskPart = taskPart
        .replace(/^[.,!?;:—\-_/\\|\s]+|[.,!?;:—\-_/\\|\s]+$/g, '')
        .replace(/^(to\s+|for\s+|about\s+)/i, '')
        .replace(/^[.,!?;:—\-_/\\|\s]+|[.,!?;:—\-_/\\|\s]+$/g, '')
        .trim();
      if (taskPart) {
        parameters.task = taskPart;
      }
      return parameters;
    }

    if (typeof normalized === 'object' && normalized.isAmbiguous) {
      parameters.isAmbiguous = true;
      parameters.ambiguousHour = normalized.hour;
      let taskPart = text.substring(0, fallbackTimeMatch.index).trim();
      taskPart = taskPart
        .replace(/^[.,!?;:—\-_/\\|\s]+|[.,!?;:—\-_/\\|\s]+$/g, '')
        .replace(/^(to\s+|for\s+|about\s+)/i, '')
        .replace(/^[.,!?;:—\-_/\\|\s]+|[.,!?;:—\-_/\\|\s]+$/g, '')
        .trim();
      if (taskPart) {
        parameters.task = taskPart;
      }
      return parameters;
    }
  }

  // 3. Fallback: Entire cleaned string without trailing punctuation
  let fallbackTask = text
    .replace(/^[.,!?;:—\-_/\\|\s]+|[.,!?;:—\-_/\\|\s]+$/g, '')
    .replace(/^(to\s+|for\s+|about\s+)/i, '')
    .replace(/^[.,!?;:—\-_/\\|\s]+|[.,!?;:—\-_/\\|\s]+$/g, '')
    .trim();

  if (fallbackTask) {
    parameters.task = fallbackTask;
  }

  return parameters;
}

/**
 * Extracts game parameters (gameType) from a transcript.
 */
function extractGameParameters(text) {
  const lower = text.toLowerCase();
  if (lower.includes('pattern')) {
    return { gameType: 'pattern' };
  }
  if (lower.includes('attention') || lower.includes('focus')) {
    return { gameType: 'attention' };
  }
  return { gameType: 'memory' };
}

/**
 * Deterministically processes a voice transcript and returns structured intent object.
 * 
 * Contract:
 * Input: string (transcript)
 * Output: {
 *   intent: string (one of INTENTS),
 *   parameters: Record<string, any>,
 *   rawTranscript: string,
 *   response: string
 * }
 * 
 * @param {string} transcript - Spoken input transcript
 * @returns {{ intent: string, parameters: Record<string, any>, rawTranscript: string, response: string }}
 */
export function processIntent(transcript) {
  if (!transcript || typeof transcript !== 'string' || transcript.trim() === '') {
    return {
      intent: INTENTS.UNKNOWN,
      parameters: {},
      rawTranscript: '',
      response: INTENT_RESPONSES[INTENTS.UNKNOWN],
    };
  }

  const raw = transcript.trim();
  const normalizedRaw = normalizeTranscript(raw);
  const withoutWake = stripWakePhraseAndPreamble(normalizedRaw);
  const normalized = cleanTranscript(withoutWake);

  // ── 0. CONFIRM / CANCEL (Dialog control intents) ───────────────────────────
  if (
    normalized === 'yes' ||
    normalized === 'yes set it' ||
    normalized === 'yes set reminder' ||
    normalized === 'yes please' ||
    normalized === 'okay' ||
    normalized === 'ok' ||
    normalized === 'do it' ||
    normalized === 'set it' ||
    normalized === 'sure' ||
    normalized === 'confirm' ||
    normalized === 'please do' ||
    normalized === 'yes do it' ||
    normalized === 'yep' ||
    normalized === 'yeah' ||
    normalized === 'yes set that' ||
    normalized === 'yes please set it' ||
    normalized === 'yes create it' ||
    normalized === 'yes please do'
  ) {
    return {
      intent: INTENTS.CONFIRM,
      parameters: {},
      rawTranscript: raw,
      response: INTENT_RESPONSES[INTENTS.CONFIRM],
    };
  }

  if (
    normalized === 'no' ||
    normalized === 'cancel' ||
    normalized === 'do not do that' ||
    normalized === 'dont do that' ||
    normalized === 'never mind' ||
    normalized === 'nevermind' ||
    normalized === 'no cancel it' ||
    normalized === 'no cancel' ||
    normalized === 'no thanks' ||
    normalized === 'stop' ||
    normalized === 'do not set it' ||
    normalized === 'dont set it' ||
    normalized === 'do not' ||
    normalized === 'dont' ||
    normalized === 'nope' ||
    normalized === 'no do not' ||
    normalized === 'no do not set that'
  ) {
    return {
      intent: INTENTS.CANCEL,
      parameters: {},
      rawTranscript: raw,
      response: INTENT_RESPONSES[INTENTS.CANCEL],
    };
  }

  // ── 1. CREATE_REMINDER ──────────────────────────────────────────────────────
  // "Remind me to drink water at 4 PM" / "Set reminder..." / "Add reminder..."
  if (
    normalized.startsWith('remind me') ||
    normalized.startsWith('set a reminder') ||
    normalized.startsWith('set reminder') ||
    normalized.startsWith('add a reminder') ||
    normalized.startsWith('add reminder') ||
    normalized.startsWith('create a reminder') ||
    normalized.startsWith('create reminder') ||
    normalized.includes('remind me to') ||
    normalized.includes('set reminder to')
  ) {
    const params = extractReminderParameters(withoutWake);
    return {
      intent: INTENTS.CREATE_REMINDER,
      parameters: params,
      rawTranscript: raw,
      response: INTENT_RESPONSES[INTENTS.CREATE_REMINDER],
    };
  }

  // ── 2. GET_NEXT_REMINDER ────────────────────────────────────────────────────
  // Triggers forward-looking reminder/task queries:
  // "What medicine do I take next?" / "What is my next reminder?" / "What do I need to do next?"
  // "What's coming up next?" / "What tablet do I take next?" / "Tell me my next reminder." / "What comes next?"
  if (
    normalized.includes('next') ||
    normalized.includes('coming up') ||
    normalized.includes('upcoming') ||
    normalized.startsWith('what is next') ||
    normalized.startsWith('whats next') ||
    normalized === 'next'
  ) {
    return {
      intent: INTENTS.GET_NEXT_REMINDER,
      parameters: {},
      rawTranscript: raw,
      response: INTENT_RESPONSES[INTENTS.GET_NEXT_REMINDER],
    };
  }

  // ── 3. GET_RECENT_ACTIVITY (Check before general today query) ──────────────
  // "What did I do recently?" / "What have I done today?" / "Show me my recent activity" / "What have I been doing?"
  if (
    normalized.includes('recently') ||
    normalized.includes('recent activity') ||
    normalized.includes('recent activities') ||
    normalized.includes('what did i do') ||
    normalized.includes('what have i done') ||
    normalized.includes('what have i been doing') ||
    normalized.includes('what i have been doing') ||
    normalized.includes('what i did') ||
    normalized.includes('what i have done') ||
    normalized.includes('activity log') ||
    normalized.includes('history') ||
    (normalized.includes('activity') && (normalized.includes('recent') || normalized.includes('show') || normalized.includes('my')))
  ) {
    return {
      intent: INTENTS.GET_RECENT_ACTIVITY,
      parameters: {},
      rawTranscript: raw,
      response: INTENT_RESPONSES[INTENTS.GET_RECENT_ACTIVITY],
    };
  }

  // ── 4. GET_PROGRESS ─────────────────────────────────────────────────────────
  // "How am I doing?" / "What am I doing?" / "How is my memory?" / "How is my progress?" / "What is my cognitive score?" / "Tell me how I'm doing"
  if (
    normalized.includes('how am i doing') ||
    normalized.includes('how i am doing') ||
    normalized.includes('how i m doing') ||
    normalized.includes('what am i doing') ||
    normalized.includes('what i am doing') ||
    normalized.includes('how did i do') ||
    normalized.includes('progress') ||
    normalized.includes('how is my memory') ||
    normalized.includes('how is my mind') ||
    normalized.includes('how am i doing with my memory') ||
    normalized.includes('how are my scores') ||
    normalized.includes('my scores') ||
    normalized.includes('my score') ||
    normalized.includes('cognitive score') ||
    normalized.includes('cognitive scores') ||
    normalized.includes('my performance') ||
    normalized.includes('accuracy') ||
    normalized.includes('how am i performing') ||
    normalized.includes('how well did i') ||
    (normalized.includes('memory') && (normalized.includes('score') || normalized.includes('how') || normalized.includes('doing')))
  ) {
    return {
      intent: INTENTS.GET_PROGRESS,
      parameters: {},
      rawTranscript: raw,
      response: INTENT_RESPONSES[INTENTS.GET_PROGRESS],
    };
  }

  // ── 5. GET_TODAY_REMINDERS ──────────────────────────────────────────────────
  // "What do I have today?" / "Show today's reminders" / "What are my reminders today?"
  if (
    (normalized.includes('today') &&
      (normalized.includes('what do i have') ||
        normalized.includes('what have i') ||
        normalized.includes('reminder') ||
        normalized.includes('reminders') ||
        normalized.includes('schedule') ||
        normalized.includes('medicine') ||
        normalized.includes('medicines') ||
        normalized.includes('tasks') ||
        normalized.includes('plan') ||
        normalized.includes('list') ||
        normalized.includes('what to do') ||
        normalized.includes('show') ||
        normalized.includes('got'))) ||
    normalized === 'what do i have today' ||
    normalized === 'todays reminders' ||
    normalized === 'today schedule'
  ) {
    return {
      intent: INTENTS.GET_TODAY_REMINDERS,
      parameters: {},
      rawTranscript: raw,
      response: INTENT_RESPONSES[INTENTS.GET_TODAY_REMINDERS],
    };
  }

  // ── 6. START_GAME ───────────────────────────────────────────────────────────
  // "Start a memory game" / "Play game" / "Let's play memory" / "Brain exercise"
  if (
    normalized.includes('game') ||
    normalized.includes('games') ||
    normalized.includes('play memory') ||
    normalized.includes('play pattern') ||
    normalized.includes('play attention') ||
    normalized.includes('brain exercise') ||
    normalized.includes('memory exercise') ||
    normalized.includes('mind exercise')
  ) {
    const params = extractGameParameters(withoutWake);
    return {
      intent: INTENTS.START_GAME,
      parameters: params,
      rawTranscript: raw,
      response: INTENT_RESPONSES[INTENTS.START_GAME],
    };
  }

  // ── 7. HELP ─────────────────────────────────────────────────────────────────
  // "I need help" / "Help me" / "What can you do?" / "Instructions"
  if (
    normalized.includes('help') ||
    normalized.includes('what can you do') ||
    normalized.includes('how do you work') ||
    normalized.includes('commands') ||
    normalized === 'help' ||
    normalized === 'help me'
  ) {
    return {
      intent: INTENTS.HELP,
      parameters: {},
      rawTranscript: raw,
      response: INTENT_RESPONSES[INTENTS.HELP],
    };
  }

  // ── 8. UNKNOWN ──────────────────────────────────────────────────────────────
  return {
    intent: INTENTS.UNKNOWN,
    parameters: {},
    rawTranscript: raw,
    response: INTENT_RESPONSES[INTENTS.UNKNOWN],
  };
}

/**
 * Evaluates an array of transcript alternatives and picks the most meaningful intent.
 * If the primary transcript yields UNKNOWN, checks alternative transcripts.
 * 
 * @param {string[]} transcripts - Array of alternative recognized transcripts
 * @returns {{ intent: string, parameters: Record<string, any>, rawTranscript: string, response: string }}
 */
export function processIntentWithAlternatives(transcripts) {
  if (!Array.isArray(transcripts) || transcripts.length === 0) {
    return processIntent('');
  }

  const primaryResult = processIntent(transcripts[0]);
  if (primaryResult.intent !== INTENTS.UNKNOWN) {
    return primaryResult;
  }

  // Test alternatives for a recognized intent
  for (let i = 1; i < transcripts.length; i++) {
    const altResult = processIntent(transcripts[i]);
    if (altResult.intent !== INTENTS.UNKNOWN) {
      return altResult;
    }
  }

  return primaryResult;
}

/**
 * Async wrapper to mimic future LLM intent processor signature.
 * 
 * @param {string|string[]} transcript
 * @returns {Promise<{ intent: string, parameters: Record<string, any>, rawTranscript: string, response: string }>}
 */
export async function processIntentAsync(transcript) {
  if (Array.isArray(transcript)) {
    return Promise.resolve(processIntentWithAlternatives(transcript));
  }
  return Promise.resolve(processIntent(transcript));
}
