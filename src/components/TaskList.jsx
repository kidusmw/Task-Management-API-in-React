import { Plus, Search } from 'lucide-react';
import React, { useState } from 'react';
import { TASK_STATUS } from '../types/task';
import TaskFilter from './TaskFilter';
import TaskItem from './TaskItem';

const TaskList = ({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onStatusChange,
  onViewDetails,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getTaskCountByStatus = (status) => {
    return tasks.filter(task => task.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Management</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <span>Total: {tasks.length}</span>
            <span>Pending: {getTaskCountByStatus(TASK_STATUS.PENDING)}</span>
            <span>In Progress: {getTaskCountByStatus(TASK_STATUS.IN_PROGRESS)}</span>
            <span>Completed: {getTaskCountByStatus(TASK_STATUS.COMPLETED)}</span>
          </div>
        </div>
        <button
          onClick={onAddTask}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Add Task
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <TaskFilter
          currentFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />
      </div>

      {/* Task Grid */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No tasks found' : 'No tasks yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Get started by creating your first task'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={onAddTask}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={16} />
              Create Task
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
              onViewDetails={onViewDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;