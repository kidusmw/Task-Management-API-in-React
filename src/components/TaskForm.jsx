import { Plus, Save, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../types/task';

const TaskForm = ({ task, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.PENDING,
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
      });
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.trim()) {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim() || '',
      });
    }
  };

  const statusOptions = [
    { value: TASK_STATUS.PENDING, label: TASK_STATUS_LABELS[TASK_STATUS.PENDING], color: 'text-blue-600' },
    { value: TASK_STATUS.IN_PROGRESS, label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS], color: 'text-yellow-600' },
    { value: TASK_STATUS.COMPLETED, label: TASK_STATUS_LABELS[TASK_STATUS.COMPLETED], color: 'text-green-600' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              {task ? 'Edit Task' : 'Create New Task'}
            </h2>
            <button
              onClick={onCancel}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task title"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter task description"
                rows={3}
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.title.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    {task ? <Save size={16} /> : <Plus size={16} />}
                    {task ? 'Save Changes' : 'Create Task'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;