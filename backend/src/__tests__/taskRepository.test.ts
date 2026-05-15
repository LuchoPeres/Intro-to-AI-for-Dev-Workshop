import { taskRepository } from '../repositories/taskRepository';

describe('TaskRepository', () => {
  beforeEach(() => {
    // Clear the repository before each test
    taskRepository.deleteAll();
  });

  describe('create', () => {
    it('should create a task with minimal data', () => {
      const task = taskRepository.create({
        title: 'Test Task',
      });

      expect(task.id).toBe(1);
      expect(task.title).toBe('Test Task');
      expect(task.description).toBeUndefined();
      expect(task.status).toBe('todo');
      expect(task.priority).toBe('medium');
      expect(task.createdAt).toBeDefined();
      expect(task.updatedAt).toBeDefined();
    });

    it('should create a task with all fields', () => {
      const task = taskRepository.create({
        title: 'Complete Task',
        description: 'Task description',
        status: 'in-progress',
        priority: 'high',
      });

      expect(task.title).toBe('Complete Task');
      expect(task.description).toBe('Task description');
      expect(task.status).toBe('in-progress');
      expect(task.priority).toBe('high');
    });

    it('should trim title and description', () => {
      const task = taskRepository.create({
        title: '  Spaced Title  ',
        description: '  Spaced Description  ',
      });

      expect(task.title).toBe('Spaced Title');
      expect(task.description).toBe('Spaced Description');
    });

    it('should auto-increment IDs', () => {
      const task1 = taskRepository.create({ title: 'Task 1' });
      const task2 = taskRepository.create({ title: 'Task 2' });

      expect(task1.id).toBe(1);
      expect(task2.id).toBe(2);
    });
  });

  describe('findAll', () => {
    beforeEach(() => {
      taskRepository.create({ title: 'Task 1', status: 'todo', priority: 'low' });
      taskRepository.create({ title: 'Task 2', status: 'done', priority: 'high' });
      taskRepository.create({ title: 'Task 3', status: 'todo', priority: 'medium' });
    });

    it('should return all tasks', () => {
      const tasks = taskRepository.findAll();
      expect(tasks).toHaveLength(3);
    });

    it('should filter by status', () => {
      const tasks = taskRepository.findAll({ status: 'todo' });
      expect(tasks).toHaveLength(2);
      expect(tasks.every(t => t.status === 'todo')).toBe(true);
    });

    it('should filter by priority', () => {
      const tasks = taskRepository.findAll({ priority: 'high' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].priority).toBe('high');
    });

    it('should filter by both status and priority', () => {
      const tasks = taskRepository.findAll({ status: 'todo', priority: 'low' });
      expect(tasks).toHaveLength(1);
      expect(tasks[0].status).toBe('todo');
      expect(tasks[0].priority).toBe('low');
    });

    it('should return empty array when no filters match', () => {
      const tasks = taskRepository.findAll({ status: 'in-progress' });
      expect(tasks).toHaveLength(0);
    });
  });

  describe('findById', () => {
    it('should find task by ID', () => {
      const created = taskRepository.create({ title: 'Test Task' });
      const found = taskRepository.findById(created.id);

      expect(found).toEqual(created);
    });

    it('should return undefined for non-existent ID', () => {
      const found = taskRepository.findById(999);
      expect(found).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update task fields', () => {
      const task = taskRepository.create({ title: 'Original Title' });
      const updated = taskRepository.update(task.id, {
        title: 'Updated Title',
        status: 'done',
      });

      expect(updated).toBeDefined();
      expect(updated?.title).toBe('Updated Title');
      expect(updated?.status).toBe('done');
      expect(updated?.id).toBe(task.id);
    });

    it('should trim updated title and description', () => {
      const task = taskRepository.create({ title: 'Original' });
      const updated = taskRepository.update(task.id, {
        title: '  Updated  ',
        description: '  Description  ',
      });

      expect(updated?.title).toBe('Updated');
      expect(updated?.description).toBe('Description');
    });

    it('should update updatedAt timestamp', () => {
      const task = taskRepository.create({ title: 'Test' });
      const originalUpdatedAt = task.updatedAt;

      // Wait a bit to ensure timestamp difference
      setTimeout(() => {
        const updated = taskRepository.update(task.id, { title: 'Updated' });
        expect(updated?.updatedAt).not.toBe(originalUpdatedAt);
      }, 10);
    });

    it('should return undefined for non-existent ID', () => {
      const updated = taskRepository.update(999, { title: 'Updated' });
      expect(updated).toBeUndefined();
    });

    it('should handle partial updates', () => {
      const task = taskRepository.create({
        title: 'Test',
        description: 'Original',
        status: 'todo',
        priority: 'low',
      });

      const updated = taskRepository.update(task.id, { status: 'done' });

      expect(updated?.title).toBe('Test');
      expect(updated?.description).toBe('Original');
      expect(updated?.status).toBe('done');
      expect(updated?.priority).toBe('low');
    });
  });

  describe('delete', () => {
    it('should delete task and return it', () => {
      const task = taskRepository.create({ title: 'To Delete' });
      const deleted = taskRepository.delete(task.id);

      expect(deleted).toEqual(task);
      expect(taskRepository.findById(task.id)).toBeUndefined();
    });

    it('should return undefined for non-existent ID', () => {
      const deleted = taskRepository.delete(999);
      expect(deleted).toBeUndefined();
    });

    it('should remove task from repository', () => {
      const task = taskRepository.create({ title: 'To Delete' });
      taskRepository.delete(task.id);

      const allTasks = taskRepository.findAll();
      expect(allTasks).toHaveLength(0);
    });
  });

  describe('deleteAll', () => {
    it('should delete all tasks and return count', () => {
      taskRepository.create({ title: 'Task 1' });
      taskRepository.create({ title: 'Task 2' });
      taskRepository.create({ title: 'Task 3' });

      const count = taskRepository.deleteAll();

      expect(count).toBe(3);
      expect(taskRepository.findAll()).toHaveLength(0);
    });

    it('should reset ID counter', () => {
      taskRepository.create({ title: 'Task 1' });
      taskRepository.deleteAll();

      const newTask = taskRepository.create({ title: 'New Task' });
      expect(newTask.id).toBe(1);
    });

    it('should return 0 when repository is empty', () => {
      const count = taskRepository.deleteAll();
      expect(count).toBe(0);
    });
  });
});
