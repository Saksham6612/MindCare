const API_BASE_URL = "http://localhost:5001/api";

const TOKEN_STORAGE_KEY = "mindcare_auth_token";
const USER_STORAGE_KEY = "mindcare_auth_user";

// Default demo credentials matching backend seed data
const DEFAULT_DEMO_CREDENTIALS = {
  email: "biren.hazarika@example.com",
  password: "password123"
};

/**
 * Health check for backend API
 */
export async function checkBackend() {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) {
    throw new Error("Backend request failed");
  }
  return response.json();
}

/**
 * Health check for PostgreSQL database connection
 */
export async function checkDatabase() {
  const response = await fetch(`${API_BASE_URL}/health/db-test`);
  if (!response.ok) {
    throw new Error("Database request failed");
  }
  return response.json();
}

/**
 * Log in to MindCare backend with email & password.
 * Caches JWT token in localStorage.
 */
export async function loginUser(email = DEFAULT_DEMO_CREDENTIALS.email, password = DEFAULT_DEMO_CREDENTIALS.password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Authentication failed");
  }

  const data = await response.json();
  if (data.token && typeof window !== "undefined") {
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    if (data.user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user));
    }
  }
  return data;
}

/**
 * Retrieves valid JWT token from localStorage or initiates demo authentication.
 */
export async function getValidAuthToken() {
  if (typeof window !== "undefined") {
    const existing = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (existing) {
      return existing;
    }
  }

  // Automatically authenticate with default demo account
  const authResult = await loginUser();
  return authResult.token;
}

/**
 * Fetch reminders for today (or given date) from the PostgreSQL database via API.
 * Uses JWT Bearer authentication.
 * 
 * @param {string} [dateStr] - Optional 'YYYY-MM-DD' date string (defaults to local today)
 * @returns {Promise<{ success: boolean, count: number, reminders: Array, date: string }>}
 */
export async function fetchTodayReminders(dateStr) {
  const targetDate = dateStr || new Date().toLocaleDateString('en-CA'); // 'YYYY-MM-DD'
  let token = await getValidAuthToken();

  let response = await fetch(`${API_BASE_URL}/reminders/today?date=${encodeURIComponent(targetDate)}`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  // If token expired or unauthorized, refresh token once and retry
  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    token = await getValidAuthToken();
    response = await fetch(`${API_BASE_URL}/reminders/today?date=${encodeURIComponent(targetDate)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.message || `Failed to fetch reminders (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetch the next upcoming incomplete reminder for today from the PostgreSQL database via API.
 * Uses JWT Bearer authentication.
 * 
 * @param {string} [dateStr] - Optional 'YYYY-MM-DD' date string
 * @param {string} [timeStr] - Optional 'HH:MM' time string
 * @returns {Promise<{ success: boolean, reminder: object | null }>}
 */
export async function fetchNextReminder(dateStr, timeStr) {
  const targetDate = dateStr || new Date().toLocaleDateString('en-CA');
  const now = new Date();
  const targetTime =
    timeStr ||
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  let token = await getValidAuthToken();

  const url = `${API_BASE_URL}/reminders/next?date=${encodeURIComponent(targetDate)}&time=${encodeURIComponent(targetTime)}`;

  let response = await fetch(url, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  // If token expired or unauthorized, refresh token once and retry
  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    token = await getValidAuthToken();
    response = await fetch(url, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.message || `Failed to fetch next reminder (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Create a new reminder in PostgreSQL via API for the authenticated patient.
 * Uses JWT Bearer authentication.
 * 
 * @param {object} payload - { title, reminder_time, reminder_date?, type?, description? }
 * @returns {Promise<{ success: boolean, message: string, reminder: object }>}
 */
export async function createReminderApi(payload) {
  let token = await getValidAuthToken();

  let response = await fetch(`${API_BASE_URL}/reminders`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  // If 401 unauthorized, refresh token and retry once
  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    token = await getValidAuthToken();
    response = await fetch(`${API_BASE_URL}/reminders`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.message || `Failed to create reminder (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetch patient cognitive progress and activity summary from PostgreSQL database via API.
 * Uses JWT Bearer authentication.
 * 
 * @returns {Promise<{ success: boolean, progress: { memoryScore: number, attentionScore: number, patternScore: number, overallScore: number, gamesCompleted: number, sessionsCompleted: number, weeklyActivities: number, hasData: boolean } }>}
 */
export async function fetchPatientProgress() {
  let token = await getValidAuthToken();

  let response = await fetch(`${API_BASE_URL}/progress`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  // If token expired or unauthorized, refresh token once and retry
  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    token = await getValidAuthToken();
    response = await fetch(`${API_BASE_URL}/progress`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.message || `Failed to fetch progress (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetch recent completed activities for the authenticated patient from PostgreSQL.
 * Uses JWT Bearer authentication.
 * 
 * @returns {Promise<{ success: boolean, count: number, activities: Array<{ id: string, activity_type: string, title: string, description: string, completed: boolean, completed_at: string }> }>}
 */
export async function fetchRecentActivities() {
  let token = await getValidAuthToken();

  let response = await fetch(`${API_BASE_URL}/activity/recent`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  // If token expired or unauthorized, refresh token once and retry
  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    token = await getValidAuthToken();
    response = await fetch(`${API_BASE_URL}/activity/recent`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.message || `Failed to fetch recent activities (HTTP ${response.status})`);
  }

  return response.json();
}

/**
 * Fetch due incomplete reminders from PostgreSQL database via API.
 * Uses JWT Bearer authentication.
 * 
 * @param {string} [dateStr] - Optional 'YYYY-MM-DD' date string (defaults to local today)
 * @param {string} [timeStr] - Optional 'HH:MM' time string (defaults to current local time)
 * @returns {Promise<{ success: boolean, count: number, reminders: Array, date: string, currentTime: string }>}
 */
export async function fetchDueReminders(dateStr, timeStr) {
  const targetDate = dateStr || new Date().toLocaleDateString('en-CA');
  const now = new Date();
  const targetTime =
    timeStr ||
    `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  let token = await getValidAuthToken();

  let response = await fetch(
    `${API_BASE_URL}/reminders/due?date=${encodeURIComponent(targetDate)}&time=${encodeURIComponent(targetTime)}`,
    {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    }
  );

  // If token expired or unauthorized, refresh token once and retry
  if (response.status === 401 && typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    token = await getValidAuthToken();
    response = await fetch(
      `${API_BASE_URL}/reminders/due?date=${encodeURIComponent(targetDate)}&time=${encodeURIComponent(targetTime)}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
  }

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody.message || `Failed to fetch due reminders (HTTP ${response.status})`);
  }

  return response.json();
}