import { Calendar, CheckCircle, Circle, Clock, X } from 'lucide-react';
import React from 'react';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../types/task';

const TaskDetails = ({ task, onClose, onEdit }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case TASK_STATUS.PENDING:
        return <Circle size={20} className="text-blue-500" />;
      case TASK_STATUS.IN_PROGRESS:
        return <Clock size={20} className="text-yellow-500" />;
      case TASK_STATUS.COMPLETED:
        return <CheckCircle size={20} className="text-green-500" />;
      default:
        return <Circle size={20} className="text-gray-500" />;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Task Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {task.title}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              {getStatusIcon(task.status)}
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                {TASK_STATUS_LABELS[task.status]}
              </span>
            </div>

            {task.description && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-md">
                  {task.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created
                </label>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">
                    {new Date(task.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => onEdit(task)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Edit Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetails;