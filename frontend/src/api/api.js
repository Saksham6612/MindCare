const API_BASE_URL = "http://localhost:5001/api";

export async function checkBackend() {
  const response = await fetch(`${API_BASE_URL}/health`);

  if (!response.ok) {
    throw new Error("Backend request failed");
  }

  return response.json();
}

export async function checkDatabase() {
  const response = await fetch(`${API_BASE_URL}/health/db-test`);

  if (!response.ok) {
    throw new Error("Database request failed");
  }

  return response.json();
}