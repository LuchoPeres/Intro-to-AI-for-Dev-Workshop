import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  patchTask,
  deleteTask,
  deleteAllTasks,
} from '../services/taskService';
import { apiFetch } from '../services/api';

// Mock the apiFetch function
jest.mock('../services/api');

describe('taskService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should fetch all tasks without filters', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', status: 'todo', priority: 'medium' },
        { id: 2, title: 'Task 2', status: 'done', priority: 'high' },
      ];
      (apiFetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockTasks),
      });

      const tasks = await getTasks();

      expect(apiFetch).toHaveBeenCalledWith('/tasks');
      expect(tasks).toEqual(mockTasks);
    });

    it('should fetch tasks with status filter', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1', status: 'todo', priority: 'medium' }];
      (apiFetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockTasks),
      });

      const tasks = await getTasks({ status: 'todo' });

      expect(apiFetch).toHaveBeenCalledWith('/tasks?status=todo');
      expect(tasks).toEqual(mockTasks);
    });

    it('should fetch tasks with priority filter', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1', status: 'todo', priority: 'high' }];
      (apiFetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockTasks),
      });

      const tasks = await getTasks({ priority: 'high' });

      expect(apiFetch).toHaveBeenCalledWith('/tasks?priority=high');
      expect(tasks).toEqual(mockTasks);
    });

    it('should fetch tasks with both filters', async () => {
      const mockTasks = [{ id: 1, title: 'Task 1', status: 'todo', priority: 'high' }];
      (apiFetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockTasks),
      });

      const tasks = await getTasks({ status: 'todo', priority: 'high' });

      expect(apiFetch).toHaveBeenCalledWith('/tasks?status=todo&priority=high');
      expect(tasks).toEqual(mockTasks);
    });
  });

  describe('getTaskById', () => {
    it('should fetch a single task by ID', async () => {
      const mockTask = { id: 1, title: 'Task 1', status: 'todo', priority: 'medium' };
      (apiFetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockTask),
      });

      const task = await getTaskById(1);

      expect(apiFetch).toHaveBeenCalledWith('/tasks/1');
      expect(task).toEqual(mockTask);
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Description',
        status: 'todo' as const,
        priority: 'high' as const,
      };
      const mockTask = { id: 1, ...taskData };
      (apiFetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockTask),
      });

      const task = await createTask(taskData);

      expect(apiFetch).toHaveBeenCalledWith('/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      expect(task).toEqual(mockTask);
    });

    it('should create a task with minimal data', async () => {
      const taskData = { title: 'Minimal Task' };
      const mockTask = { id: 1, title: 'Minimal Task', status: 'todo', priority: 'medium' };
      (apiFetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockTask),
      });

      const task = await createTask(taskData);

      expect(task).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    it('should update a task with PUT', async () => {
      const updateData = { title: 'Updated Task', status: 'done' as const };
      const mockTask = { id: 1, ...updateData };
      (apiFetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockTask),
      });

      const task = await updateTask(1, updateData);

      expect(apiFetch).toHaveBeenCalledWith('/tasks/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      expect(task).toEqual(mockTask);
    });
  });

  describe('patchTask', () => {
    it('should partially update a task with PATCH', async () => {
      const updateData = { status: 'done' as const };
      const mockTask = { id: 1, title: 'Task', ...updateData };
      (apiFetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockTask),
      });

      const task = await patchTask(1, updateData);

      expect(apiFetch).toHaveBeenCalledWith('/tasks/1', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      expect(task).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      (apiFetch as jest.Mock).mockResolvedValue({});

      await deleteTask(1);

      expect(apiFetch).toHaveBeenCalledWith('/tasks/1', {
        method: 'DELETE',
      });
    });
  });

  describe('deleteAllTasks', () => {
    it('should delete all tasks', async () => {
      (apiFetch as jest.Mock).mockResolvedValue({});

      await deleteAllTasks();

      expect(apiFetch).toHaveBeenCalledWith('/tasks', {
        method: 'DELETE',
      });
    });
  });

  describe('error handling', () => {
    it('should throw error when API call fails', async () => {
      (apiFetch as jest.Mock).mockRejectedValue(new Error('API error'));

      await expect(getTasks()).rejects.toThrow('API error');
    });
  });
});
