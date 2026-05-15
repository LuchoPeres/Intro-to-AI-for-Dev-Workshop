import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '../components/TaskForm';
import { Task } from '../types/task';

describe('TaskForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Create mode', () => {
    it('should render form with empty fields', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByText('Create New Task')).toBeInTheDocument();
      expect(screen.getByLabelText('Title *')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Status')).toBeInTheDocument();
      expect(screen.getByLabelText('Priority')).toBeInTheDocument();
      expect(screen.getByText('Create Task')).toBeInTheDocument();
    });

    it('should have default values for status and priority', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement;
      const prioritySelect = screen.getByLabelText('Priority') as HTMLSelectElement;

      expect(statusSelect.value).toBe('todo');
      expect(prioritySelect.value).toBe('medium');
    });

    it('should show validation error for empty title', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error for title that is only whitespace', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText('Title *');
      fireEvent.change(titleInput, { target: { value: '   ' } });

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title is required')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error for title too long', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText('Title *');
      fireEvent.change(titleInput, { target: { value: 'a'.repeat(101) } });

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Title must be less than 100 characters')).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show validation error for description too long', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText('Title *');
      const descriptionInput = screen.getByLabelText('Description');

      fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
      fireEvent.change(descriptionInput, { target: { value: 'a'.repeat(501) } });

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Description must be less than 500 characters')
        ).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should call onSubmit with trimmed data', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText('Title *');
      const descriptionInput = screen.getByLabelText('Description');
      const statusSelect = screen.getByLabelText('Status');
      const prioritySelect = screen.getByLabelText('Priority');

      fireEvent.change(titleInput, { target: { value: '  Test Task  ' } });
      fireEvent.change(descriptionInput, { target: { value: '  Test Description  ' } });
      fireEvent.change(statusSelect, { target: { value: 'in-progress' } });
      fireEvent.change(prioritySelect, { target: { value: 'high' } });

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Test Task',
          description: 'Test Description',
          status: 'in-progress',
          priority: 'high',
        });
      });
    });

    it('should call onSubmit with minimal data', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText('Title *');
      fireEvent.change(titleInput, { target: { value: 'Minimal Task' } });

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Minimal Task',
          description: undefined,
          status: 'todo',
          priority: 'medium',
        });
      });
    });

    it('should call onCancel when Cancel button is clicked', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should disable buttons when isLoading is true', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />);

      const submitButton = screen.getByText('Saving...');
      const cancelButton = screen.getByText('Cancel');

      expect(submitButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it('should display character count for description', () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const descriptionInput = screen.getByLabelText('Description');
      fireEvent.change(descriptionInput, { target: { value: 'Test' } });

      expect(screen.getByText('4/500 characters')).toBeInTheDocument();
    });

    it('should handle empty description by setting to undefined', async () => {
      render(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText('Title *');
      const descriptionInput = screen.getByLabelText('Description');

      fireEvent.change(titleInput, { target: { value: 'Test Task' } });
      fireEvent.change(descriptionInput, { target: { value: '  ' } });

      const submitButton = screen.getByText('Create Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Test Task',
          description: undefined,
          status: 'todo',
          priority: 'medium',
        });
      });
    });
  });

  describe('Edit mode', () => {
    const mockTask: Task = {
      id: 1,
      title: 'Existing Task',
      description: 'Existing Description',
      status: 'in-progress',
      priority: 'high',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z',
    };

    it('should render form with existing task data', () => {
      render(<TaskForm task={mockTask} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByText('Edit Task')).toBeInTheDocument();

      const titleInput = screen.getByLabelText('Title *') as HTMLInputElement;
      const descriptionInput = screen.getByLabelText('Description') as HTMLInputElement;
      const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement;
      const prioritySelect = screen.getByLabelText('Priority') as HTMLSelectElement;

      expect(titleInput.value).toBe('Existing Task');
      expect(descriptionInput.value).toBe('Existing Description');
      expect(statusSelect.value).toBe('in-progress');
      expect(prioritySelect.value).toBe('high');
    });

    it('should update form when task prop changes', () => {
      const { rerender } = render(
        <TaskForm task={mockTask} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
      );

      const updatedTask: Task = {
        ...mockTask,
        title: 'Updated Task',
        status: 'done',
      };

      rerender(<TaskForm task={updatedTask} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText('Title *') as HTMLInputElement;
      const statusSelect = screen.getByLabelText('Status') as HTMLSelectElement;

      expect(titleInput.value).toBe('Updated Task');
      expect(statusSelect.value).toBe('done');
    });

    it('should display Update Task button in edit mode', () => {
      render(<TaskForm task={mockTask} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByText('Update Task')).toBeInTheDocument();
      expect(screen.queryByText('Create Task')).not.toBeInTheDocument();
    });

    it('should call onSubmit with updated data', async () => {
      render(<TaskForm task={mockTask} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      const titleInput = screen.getByLabelText('Title *');
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });

      const submitButton = screen.getByText('Update Task');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'Updated Title',
          description: 'Existing Description',
          status: 'in-progress',
          priority: 'high',
        });
      });
    });
  });
});
