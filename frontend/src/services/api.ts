const API_BASE_URL = 'http://localhost:3001/api';

export const fetchHello = async (): Promise<string> => {
  const response = await fetch(`${API_BASE_URL}/hello`);
  if (!response.ok) {
    throw new Error('Failed to fetch from API');
  }
  const data = await response.json();
  return data.message;
};

export const apiFetch = async (endpoint: string, options?: RequestInit): Promise<Response> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    let errorMessage = `API error: ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      // If parsing fails, use the default error message
    }
    throw new Error(errorMessage);
  }
  return response;
};
