import { useState, useEffect, useCallback } from 'react'
import { taskService } from '../services/taskService'

export const useTaskManager = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const fetchedTasks = await taskService.getTasks()
      setTasks(fetchedTasks)
      setError(null)
    } catch (err) {
      setError('Failed to fetch tasks. Please try again.')
      console.error('Error fetching tasks:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleTaskCreate = async (taskData) => {
    try {
      const newTask = await taskService.createTask(taskData)
      setTasks(prevTasks => [newTask, ...prevTasks.slice(0, 4)])
      setError(null)
      return true
    } catch (err) {
      setError('Failed to create task. Please try again.')
      console.error('Error creating task:', err)
      return false
    }
  }

  const handleTaskComplete = async (taskId) => {
    try {
      await taskService.completeTask(taskId)
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId))
      setError(null)
    } catch (err) {
      setError('Failed to complete task. Please try again.')
      console.error('Error completing task:', err)
    }
  }
  
  return {
    tasks,
    loading,
    error,
    fetchTasks,
    handleTaskCreate,
    handleTaskComplete,
  }
} 