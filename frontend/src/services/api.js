// Base URL pointing to our FastAPI backend
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export async function fetchProperties(location = '', type = '') {
  let url = `${API_BASE_URL}/properties`;
  const params = new URLSearchParams();
  
  if (location && location !== 'Any') params.append('location', location);
  if (type && type !== 'Any Type') params.append('type', type);
  
  if (params.toString()) {
    url += '?' + params.toString();
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch properties');
  }
  return response.json();
}

export async function sendInquiry(propertyId, userEmail, message) {
  const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/inquire`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_email: userEmail, message: message })
  });
  if (!response.ok) {
    throw new Error('Failed to send inquiry');
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
