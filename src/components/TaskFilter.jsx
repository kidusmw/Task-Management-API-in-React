import React from 'react';
import { TASK_STATUS, TASK_STATUS_LABELS } from '../types/task';

const TaskFilter = ({ currentFilter, onFilterChange }) => {
  const filters = [
    { key: 'all', label: 'All Tasks', color: 'bg-gray-100 text-gray-700' },
    { key: TASK_STATUS.PENDING, label: TASK_STATUS_LABELS[TASK_STATUS.PENDING], color: 'bg-blue-100 text-blue-700' },
    { key: TASK_STATUS.IN_PROGRESS, label: TASK_STATUS_LABELS[TASK_STATUS.IN_PROGRESS], color: 'bg-yellow-100 text-yellow-700' },
    { key: TASK_STATUS.COMPLETED, label: TASK_STATUS_LABELS[TASK_STATUS.COMPLETED], color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
            currentFilter === filter.key
              ? filter.color + ' shadow-md transform scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default TaskFilter;