import { apiFetch } from './api';
import { Task, TaskStatus, TaskPriority } from '../types/task';

export const getTasks = async (filters?: {
  status?: TaskStatus;
  priority?: TaskPriority;
}): Promise<Task[]> => {
  const params = new URLSearchParams();
  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);

  const queryString = params.toString();
  const endpoint = `/tasks${queryString ? `?${queryString}` : ''}`;

  const response = await apiFetch(endpoint);
  return response.json();
};

export const getTaskById = async (id: number): Promise<Task> => {
  const response = await apiFetch(`/tasks/${id}`);
  return response.json();
};

export const createTask = async (taskData: {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}): Promise<Task> => {
  const response = await apiFetch('/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const updateTask = async (
  id: number,
  taskData: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
  }>
): Promise<Task> => {
  const response = await apiFetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const patchTask = async (
  id: number,
  taskData: Partial<{
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
  }>
): Promise<Task> => {
  const response = await apiFetch(`/tasks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  });
  return response.json();
};

export const deleteTask = async (id: number): Promise<void> => {
  await apiFetch(`/tasks/${id}`, {
    method: 'DELETE',
  });
};

export const deleteAllTasks = async (): Promise<void> => {
  await apiFetch('/tasks', {
    method: 'DELETE',
  });
};
