// Live API Gateway endpoint
const API_BASE_URL = "https://quyd2gaji3.execute-api.us-east-1.amazonaws.com/dev";

export async function fetchAuditLogs() {
  const response = await fetch(`${API_BASE_URL}/audit`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("API request failed");
  }

  return response.json();
}
