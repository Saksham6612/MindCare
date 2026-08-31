const API_BASE_URL = "http://localhost:5001/api";

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("mindcare_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid response from server");
  }

  if (!response.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export async function checkBackend() {
  return apiRequest("/health");
}

export async function checkDatabase() {
  return apiRequest("/health/db-test");
}

export async function getGames() {
  return apiRequest("/games");
}

export async function login(email, password) {
  const data = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!data.token) {
    throw new Error("No authentication token received");
  }

  localStorage.setItem("mindcare_token", data.token);

  if (data.user) {
    localStorage.setItem("mindcare_user", JSON.stringify(data.user));
  }

  return data;
}

export async function getMe() {
  return apiRequest("/auth/me");
}

export function logout() {
  localStorage.removeItem("mindcare_token");
  localStorage.removeItem("mindcare_user");
}

export function isAuthenticated() {
  return Boolean(localStorage.getItem("mindcare_token"));
}
