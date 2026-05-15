import { render, screen, fireEvent } from '@testing-library/react';
import TaskItem from '../components/TaskItem';
import { Task } from '../types/task';

describe('TaskItem', () => {
  const mockTask: Task = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description',
    status: 'todo',
    priority: 'high',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render task details', () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('should render without description', () => {
    const taskWithoutDescription: Task = {
      ...mockTask,
      description: undefined,
    };

    render(<TaskItem task={taskWithoutDescription} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.queryByText('Test Description')).not.toBeInTheDocument();
  });

  it('should display correct status badge', () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Todo')).toBeInTheDocument();
  });

  it('should display correct priority badge', () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const editButton = screen.getByLabelText('Edit task');
    fireEvent.click(editButton);

    expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
  });

  it('should call onDelete when delete button is clicked', () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    const deleteButton = screen.getByLabelText('Delete task');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTask.id);
  });

  it('should display creation date', () => {
    render(<TaskItem task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText(/Created:/)).toBeInTheDocument();
  });

  it('should display In Progress status correctly', () => {
    const inProgressTask: Task = {
      ...mockTask,
      status: 'in-progress',
    };

    render(<TaskItem task={inProgressTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('In Progress')).toBeInTheDocument();
  });

  it('should display Done status correctly', () => {
    const doneTask: Task = {
      ...mockTask,
      status: 'done',
    };

    render(<TaskItem task={doneTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Done')).toBeInTheDocument();
  });

  it('should display Low priority correctly', () => {
    const lowPriorityTask: Task = {
      ...mockTask,
      priority: 'low',
    };

    render(<TaskItem task={lowPriorityTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Low')).toBeInTheDocument();
  });

  it('should display Medium priority correctly', () => {
    const mediumPriorityTask: Task = {
      ...mockTask,
      priority: 'medium',
    };

    render(<TaskItem task={mediumPriorityTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

    expect(screen.getByText('Medium')).toBeInTheDocument();
  });
});
