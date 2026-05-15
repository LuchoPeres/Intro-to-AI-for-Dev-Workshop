import { Router, Request, Response } from 'express';
import { taskRepository } from '../repositories/taskRepository';
import { TaskStatus, TaskPriority } from '../types/task';

const router = Router();

// Constants for validation
const VALID_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];
const VALID_PRIORITIES: TaskPriority[] = ['low', 'medium', 'high'];
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

// Validation functions
const validateTitle = (title: string): string | null => {
  if (!title || title.trim().length === 0) {
    return 'Title is required';
  }
  if (title.length > MAX_TITLE_LENGTH) {
    return `Title must be less than ${MAX_TITLE_LENGTH} characters`;
  }
  return null;
};

const validateDescription = (description: string): string | null => {
  if (description && description.length > MAX_DESCRIPTION_LENGTH) {
    return `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
  }
  return null;
};

const validateStatus = (status: string): string | null => {
  if (!VALID_STATUSES.includes(status as TaskStatus)) {
    return `Invalid status. Must be: ${VALID_STATUSES.join(', ')}`;
  }
  return null;
};

const validatePriority = (priority: string): string | null => {
  if (!VALID_PRIORITIES.includes(priority as TaskPriority)) {
    return `Invalid priority. Must be: ${VALID_PRIORITIES.join(', ')}`;
  }
  return null;
};

// Shared validation function for task data
const validateTaskData = (
  title?: string,
  description?: string,
  status?: string,
  priority?: string
): string | null => {
  if (title !== undefined) {
    const titleError = validateTitle(title);
    if (titleError) return titleError;
  }

  if (description !== undefined) {
    const descriptionError = validateDescription(description);
    if (descriptionError) return descriptionError;
  }

  if (status !== undefined) {
    const statusError = validateStatus(status);
    if (statusError) return statusError;
  }

  if (priority !== undefined) {
    const priorityError = validatePriority(priority);
    if (priorityError) return priorityError;
  }

  return null;
};

// Helper function to parse and validate task ID
const parseTaskId = (idParam: string): number | null => {
  const id = parseInt(idParam);
  return isNaN(id) ? null : id;
};

// GET /api/tasks - Get all tasks
router.get('/', (req: Request, res: Response) => {
  const status = req.query.status as TaskStatus | undefined;
  const priority = req.query.priority as TaskPriority | undefined;

  const filters: { status?: TaskStatus; priority?: TaskPriority } = {};
  if (status && VALID_STATUSES.includes(status)) {
    filters.status = status;
  }
  if (priority && VALID_PRIORITIES.includes(priority)) {
    filters.priority = priority;
  }

  const tasks = taskRepository.findAll(filters);
  res.json(tasks);
});

// GET /api/tasks/:id - Get single task
router.get('/:id', (req: Request, res: Response) => {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const task = taskRepository.findById(id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(task);
});

// POST /api/tasks - Create new task
router.post('/', (req: Request, res: Response) => {
  const { title, description, status, priority } = req.body;

  // Validation
  const titleError = validateTitle(title);
  if (titleError) {
    return res.status(400).json({ error: titleError });
  }

  const descriptionError = validateDescription(description || '');
  if (descriptionError) {
    return res.status(400).json({ error: descriptionError });
  }

  if (status) {
    const statusError = validateStatus(status);
    if (statusError) {
      return res.status(400).json({ error: statusError });
    }
  }

  if (priority) {
    const priorityError = validatePriority(priority);
    if (priorityError) {
      return res.status(400).json({ error: priorityError });
    }
  }

  const newTask = taskRepository.create({
    title,
    description,
    status: status as TaskStatus,
    priority: priority as TaskPriority,
  });

  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update task
router.put('/:id', (req: Request, res: Response) => {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const { title, description, status, priority } = req.body;

  // Validation
  const validationError = validateTaskData(title, description, status, priority);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const updatedTask = taskRepository.update(id, {
    title,
    description,
    status: status as TaskStatus,
    priority: priority as TaskPriority,
  });

  if (!updatedTask) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(updatedTask);
});

// PATCH /api/tasks/:id - Partial update
router.patch('/:id', (req: Request, res: Response) => {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const { title, description, status, priority } = req.body;

  // Validation (only for provided fields)
  const validationError = validateTaskData(title, description, status, priority);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const updatedTask = taskRepository.update(id, {
    title,
    description,
    status: status as TaskStatus,
    priority: priority as TaskPriority,
  });

  if (!updatedTask) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json(updatedTask);
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', (req: Request, res: Response) => {
  const id = parseTaskId(req.params.id);
  if (id === null) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  const deletedTask = taskRepository.delete(id);
  if (!deletedTask) {
    return res.status(404).json({ error: 'Task not found' });
  }

  res.json({ message: 'Task deleted successfully', task: deletedTask });
});

// DELETE /api/tasks - Delete all tasks (for testing purposes only - should be protected in production)
router.delete('/', (req: Request, res: Response) => {
  const count = taskRepository.deleteAll();
  res.json({ message: `Deleted ${count} tasks` });
});

export default router;
