import React from 'react';
import { Task } from '../types/task';
import { Pencil, Trash2 } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onDelete }) => {
  const getStatusColor = (status: Task['status']): string => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'done':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors"
            aria-label="Edit task"
          >
            <Pencil size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
            aria-label="Delete task"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {task.description && <p className="text-gray-600 text-sm mb-3">{task.description}</p>}

      <div className="flex items-center space-x-2">
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}
        >
          {task.status === 'in-progress'
            ? 'In Progress'
            : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}
        >
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>
      </div>

      <div className="mt-2 text-xs text-gray-400">
        Created: {new Date(task.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TaskItem;
