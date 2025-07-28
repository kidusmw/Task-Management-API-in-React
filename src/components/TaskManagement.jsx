import React, { useState } from 'react';
import { useTasks } from '../hooks/useTasks';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import TaskDetails from './TaskDetails';
import Header from './layout/Header';
import ProductManagement from './products/ProductManagement';
import CartManagement from './cart/CartManagement';
import ProductDetailPage from './products/ProductDetailPage';

const TaskManagement = () => {
  const {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    patchTask,
    deleteTask,
  } = useTasks();

  const [activeTab, setActiveTab] = useState('tasks');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
    setSelectedTask(null);
  };

  const handleFormSubmit = async (taskData) => {
    setFormLoading(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
      } else {
        await createTask(taskData);
      }
      setShowForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await patchTask(id, { status });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleViewDetails = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
  };

  const handleViewProductDetails = (product) => {
    setSelectedProduct(product);
  };

  const handleBackToProducts = () => {
    setSelectedProduct(null);
  };

  const handleContinueShopping = () => {
    setActiveTab('products');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProduct ? (
          <ProductDetailPage
            product={selectedProduct}
            onBack={handleBackToProducts}
          />
        ) : activeTab === 'tasks' ? (
          <>
            {error && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <TaskList
              tasks={tasks}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
              loading={loading}
            />

            {showForm && (
              <TaskForm
                task={editingTask}
                onSubmit={handleFormSubmit}
                onCancel={handleFormCancel}
                isLoading={formLoading}
              />
            )}

            {selectedTask && (
              <TaskDetails
                task={selectedTask}
                onClose={handleCloseDetails}
                onEdit={handleEditTask}
              />
            )}
          </>
        ) : activeTab === 'products' ? (
          <ProductManagement onViewDetails={handleViewProductDetails} />
        ) : activeTab === 'cart' ? (
          <CartManagement onContinueShopping={handleContinueShopping} />
        ) : null}
      </div>
    </div>
  );
};

export default TaskManagement;
