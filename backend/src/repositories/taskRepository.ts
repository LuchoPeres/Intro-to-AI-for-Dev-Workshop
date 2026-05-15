import { Task, TaskStatus, TaskPriority } from '../types/task';

class TaskRepository {
  private tasks: Task[] = [];
  private nextId: number = 1;

  findAll(filters?: { status?: TaskStatus; priority?: TaskPriority }): Task[] {
    let filteredTasks = [...this.tasks];

    if (filters?.status) {
      filteredTasks = filteredTasks.filter(t => t.status === filters.status);
    }

    if (filters?.priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === filters.priority);
    }

    return filteredTasks;
  }

  findById(id: number): Task | undefined {
    return this.tasks.find(t => t.id === id);
  }

  create(taskData: {
    title: string;
    description?: string;
    status?: TaskStatus;
    priority?: TaskPriority;
  }): Task {
    const newTask: Task = {
      id: this.nextId++,
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : undefined,
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.tasks.push(newTask);
    return newTask;
  }

  update(
    id: number,
    updates: Partial<{
      title: string;
      description: string;
      status: TaskStatus;
      priority: TaskPriority;
    }>
  ): Task | undefined {
    const taskIndex = this.tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return undefined;
    }

    const task = this.tasks[taskIndex];

    if (updates.title !== undefined) {
      task.title = updates.title.trim();
    }
    if (updates.description !== undefined) {
      task.description = updates.description.trim();
    }
    if (updates.status !== undefined) {
      task.status = updates.status;
    }
    if (updates.priority !== undefined) {
      task.priority = updates.priority;
    }

    task.updatedAt = new Date().toISOString();

    return task;
  }

  delete(id: number): Task | undefined {
    const taskIndex = this.tasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      return undefined;
    }

    const deletedTask = this.tasks[taskIndex];
    this.tasks.splice(taskIndex, 1);
    return deletedTask;
  }

  deleteAll(): number {
    const count = this.tasks.length;
    this.tasks = [];
    this.nextId = 1;
    return count;
  }
}

// Export a singleton instance
export const taskRepository = new TaskRepository();
