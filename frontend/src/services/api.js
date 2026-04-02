// Base URL pointing to our FastAPI backend
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function fetchProperties() {
  const response = await fetch(`${API_BASE_URL}/properties`);
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
}

export async function createProperty(propertyData, token) {
  const response = await fetch(`${API_BASE_URL}/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(propertyData)
  });
  if (!response.ok) {
    throw new Error('Failed to create property');
  }
  return response.json();
}
