import { render, waitFor } from '@testing-library/react';
import App from '../App';
import * as taskService from '../services/taskService';

// Mock the task service
jest.mock('../services/taskService');
const mockGetTasks = taskService.getTasks as jest.MockedFunction<typeof taskService.getTasks>;

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', async () => {
    mockGetTasks.mockResolvedValue([]);
    render(<App />);

    await waitFor(() => {
      const container = document.querySelector('.min-h-screen');
      expect(container).toBeInTheDocument();
    });
  });
});
