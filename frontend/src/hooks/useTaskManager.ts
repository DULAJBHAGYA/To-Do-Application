import { useState, useEffect, useCallback } from 'react'
import { taskService, type Task, type UpdatableTask } from '../services/taskService'

export function useTaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      // Use getAllTasks instead of getTasks to get all tasks (completed and incomplete)
      const allTasks = await taskService.getAllTasks();
      const pending = allTasks.filter(task => !task.completed);
      const completed = allTasks.filter(task => task.completed);
      
      setTasks(pending);
      setCompletedTasks(completed.sort((a, b) => {
        if (a.completedAt && b.completedAt) {
          return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
        }
        return 0;
      }));
      setError(null);
    } catch (e) {
      setError('Failed to fetch tasks. Please try again.')
      // Ensure state is clean on error
      setTasks([])
      setCompletedTasks([])
      console.error('Error fetching tasks:', e)
    } finally {
      setLoading(false)
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleTaskCreate = async (taskData: { title: string, description: string, priority: string, dueDate: string | null }) => {
    try {
      await taskService.createTask(taskData)
      // Refetch tasks to show the new one
      await fetchTasks()
      return true
    } catch (e) {
      console.error('Failed to create task:', e);
      setError('Failed to create task. Please try again.');
      return false;
    }
  }

  const handleTaskComplete = async (taskId: number) => {
    try {
      await taskService.completeTask(taskId);
      // Refetch tasks to update the lists
      await fetchTasks();
    } catch (e) {
      console.error('Failed to complete task:', e);
      setError('Failed to mark task as complete. Please try again.');
    }
  }
  
  const handleTaskUpdate = async (taskId: number, taskData: UpdatableTask) => {
    try {
      await taskService.updateTask(taskId, taskData);
      await fetchTasks();
      return true;
    } catch (e) {
      console.error('Failed to update task:', e);
      setError('Failed to update task. Please try again.');
      return false;
    }
  };
  
  return {
    tasks,
    setTasks,
    completedTasks,
    loading,
    error,
    handleTaskCreate,
    handleTaskComplete,
    handleTaskUpdate,
  };
} 