import { CheckCircle, Circle, Clock, Edit, Eye, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../types/task';

const TaskItem = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onViewDetails,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await onDelete(task.id);
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case TASK_STATUS.PENDING:
        return <Circle size={16} className="text-blue-500" />;
      case TASK_STATUS.IN_PROGRESS:
        return <Clock size={16} className="text-yellow-500" />;
      case TASK_STATUS.COMPLETED:
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return <Circle size={16} className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case TASK_STATUS.PENDING:
        return 'bg-blue-100 text-blue-700';
      case TASK_STATUS.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-700';
      case TASK_STATUS.COMPLETED:
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {getStatusIcon(task.status)}
          <h3 className="font-medium text-gray-900 truncate">{task.title}</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => onViewDetails(task)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="View Details"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit Task"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            title="Delete Task"
          >
            {isDeleting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent" />
            ) : (
              <Trash2 size={16} />
            )}
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value)}
          className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${getStatusColor(task.status)} cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <option value={TASK_STATUS.PENDING}>{TASK_STATUS_LABELS[TASK_STATUS.PENDING]}</option>
          <option value={TASK_STATUS.IN_PROGRESS}>{TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS]}</option>
          <option value={TASK_STATUS.COMPLETED}>{TASK_STATUS_LABELS[TASK_STATUS.COMPLETED]}</option>
        </select>

        <div className="text-xs text-gray-500">
          {new Date(task.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TaskItem;