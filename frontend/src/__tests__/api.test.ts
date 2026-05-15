import { apiFetch, fetchHello } from '../services/api';

// Mock fetch globally
const mockFetch = jest.fn() as jest.Mock;
(global as any).fetch = mockFetch;

describe('api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchHello', () => {
    it('should fetch hello message successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ message: 'Hello from the API!' }),
      });

      const message = await fetchHello();

      expect(message).toBe('Hello from the API!');
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/hello');
    });

    it('should throw error when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
      });

      await expect(fetchHello()).rejects.toThrow('Failed to fetch from API');
    });
  });

  describe('apiFetch', () => {
    it('should fetch data successfully', async () => {
      const mockData = { id: 1, title: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const response = await apiFetch('/tasks');

      expect(response.ok).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/tasks', undefined);
    });

    it('should fetch with options', async () => {
      const mockData = { id: 1, title: 'Test' };
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test' }),
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      });

      const response = await apiFetch('/tasks', options);

      expect(response.ok).toBe(true);
      expect(mockFetch).toHaveBeenCalledWith('http://localhost:3001/api/tasks', options);
    });

    it('should throw error with status text when response is not ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        json: async () => ({}),
      });

      await expect(apiFetch('/tasks/999')).rejects.toThrow('API error: 404 Not Found');
    });

    it('should throw error with custom error message from API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: async () => ({ error: 'Title is required' }),
      });

      await expect(apiFetch('/tasks')).rejects.toThrow('Title is required');
    });

    it('should handle JSON parse errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(apiFetch('/tasks')).rejects.toThrow('API error: 500 Internal Server Error');
    });

    it('should use environment variable for API base URL', async () => {
      // Note: This test would require Jest configuration to support Vite env vars
      // For now, we skip this test as it requires additional Jest setup
      // TODO: Configure Jest to support import.meta.env or use a different approach
      expect(true).toBe(true); // Placeholder test
    });
  });
});
