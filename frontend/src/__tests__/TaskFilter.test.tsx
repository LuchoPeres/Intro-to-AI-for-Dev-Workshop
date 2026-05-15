import { render, screen, fireEvent } from '@testing-library/react';
import TaskFilter from '../components/TaskFilter';

describe('TaskFilter', () => {
  const mockOnStatusChange = jest.fn();
  const mockOnPriorityChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render filter controls', () => {
    render(
      <TaskFilter
        statusFilter="all"
        priorityFilter="all"
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
      />
    );

    expect(screen.getByLabelText('Filter by Status')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter by Priority')).toBeInTheDocument();
  });

  it('should call onStatusChange when status filter changes', () => {
    render(
      <TaskFilter
        statusFilter="all"
        priorityFilter="all"
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
      />
    );

    const statusSelect = screen.getByLabelText('Filter by Status');
    fireEvent.change(statusSelect, { target: { value: 'todo' } });

    expect(mockOnStatusChange).toHaveBeenCalledWith('todo');
  });

  it('should call onPriorityChange when priority filter changes', () => {
    render(
      <TaskFilter
        statusFilter="all"
        priorityFilter="all"
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
      />
    );

    const prioritySelect = screen.getByLabelText('Filter by Priority');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    expect(mockOnPriorityChange).toHaveBeenCalledWith('high');
  });

  it('should show clear filters button when filters are active', () => {
    render(
      <TaskFilter
        statusFilter="todo"
        priorityFilter="all"
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
      />
    );

    expect(screen.getByText('Clear filters')).toBeInTheDocument();
  });

  it('should not show clear filters button when no filters are active', () => {
    render(
      <TaskFilter
        statusFilter="all"
        priorityFilter="all"
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
      />
    );

    expect(screen.queryByText('Clear filters')).not.toBeInTheDocument();
  });

  it('should clear both filters when clear button is clicked', () => {
    render(
      <TaskFilter
        statusFilter="todo"
        priorityFilter="high"
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
      />
    );

    const clearButton = screen.getByText('Clear filters');
    fireEvent.click(clearButton);

    expect(mockOnStatusChange).toHaveBeenCalledWith('all');
    expect(mockOnPriorityChange).toHaveBeenCalledWith('all');
  });

  it('should have correct default values', () => {
    render(
      <TaskFilter
        statusFilter="all"
        priorityFilter="all"
        onStatusChange={mockOnStatusChange}
        onPriorityChange={mockOnPriorityChange}
      />
    );

    const statusSelect = screen.getByLabelText('Filter by Status') as HTMLSelectElement;
    const prioritySelect = screen.getByLabelText('Filter by Priority') as HTMLSelectElement;

    expect(statusSelect.value).toBe('all');
    expect(prioritySelect.value).toBe('all');
  });
});
