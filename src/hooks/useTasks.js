import { useCallback, useEffect, useState } from 'react';
import { taskApi } from '../services/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTasks = await taskApi.getAllTasks();
      setTasks(fetchedTasks);
    } catch (err) {
      setError('Failed to fetch tasks');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    try {
      setError(null);
      const newTask = await taskApi.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError('Failed to create task');
      console.error('Error creating task:', err);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    try {
      setError(null);
      const updatedTask = await taskApi.updateTask(id, taskData);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? updatedTask : task
        ));
        return updatedTask;
      }
      throw new Error('Task not found');
    } catch (err) {
      setError('Failed to update task');
      console.error('Error updating task:', err);
      throw err;
    }
  }, []);

  const patchTask = useCallback(async (id, taskData) => {
    try {
      setError(null);
      const updatedTask = await taskApi.patchTask(id, taskData);
      if (updatedTask) {
        setTasks(prev => prev.map(task => 
          task.id === id ? updatedTask : task
        ));
        return updatedTask;
      }
      throw new Error('Task not found');
    } catch (err) {
      setError('Failed to update task');
      console.error('Error patching task:', err);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      setError(null);
      const success = await taskApi.deleteTask(id);
      if (success) {
        setTasks(prev => prev.filter(task => task.id !== id));
        return true;
      }
      throw new Error('Task not found');
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
      throw err;
    }
  }, []);

  const getTaskById = useCallback(async (id) => {
    try {
      setError(null);
      return await taskApi.getTaskById(id);
    } catch (err) {
      setError('Failed to fetch task');
      console.error('Error fetching task:', err);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    patchTask,
    deleteTask,
    getTaskById,
  };
};