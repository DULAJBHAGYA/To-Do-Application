import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTaskManager } from './useTaskManager'
import { taskService, type Task } from '../services/taskService'

// Mock the taskService
vi.mock('../services/taskService', () => ({
  taskService: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    completeTask: vi.fn()
  }
}))

describe('useTaskManager', () => {
  it('should fetch tasks on initial render', async () => {
    const mockTasks: Task[] = [{ id: 1, title: 'Test Task', description: 'Test Description', completed: false, createdAt: new Date().toISOString(), completedAt: null, priority: 'Medium', dueDate: null }]
    vi.spyOn(taskService, 'getTasks').mockResolvedValue(mockTasks)

    const { result, rerender } = renderHook(() => useTaskManager())

    expect(result.current.loading).toBe(true)

    await act(async () => {
      rerender()
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.tasks).toEqual(mockTasks)
    expect(result.current.error).toBe(null)
  })

  it('should handle task creation', async () => {
    const { result, rerender } = renderHook(() => useTaskManager())

    await act(async () => {
      rerender()
    })

    const newTaskData = { title: 'New Task', description: 'New Description', priority: 'High', dueDate: null }
    const createdTask: Task = { id: 2, ...newTaskData, completed: false, createdAt: new Date().toISOString(), completedAt: null }
    vi.spyOn(taskService, 'createTask').mockResolvedValue(createdTask)

    let success
    await act(async () => {
      success = await result.current.handleTaskCreate(newTaskData)
    })

    expect(success).toBe(true)
    expect(result.current.tasks[0]).toEqual(createdTask)
  })

  it('should handle task completion', async () => {
    const mockTasks: Task[] = [{ id: 1, title: 'Test Task', description: 'Test Description', completed: false, createdAt: new Date().toISOString(), completedAt: null, priority: 'Medium', dueDate: null }]
    vi.spyOn(taskService, 'getTasks').mockResolvedValue(mockTasks)

    const { result, rerender } = renderHook(() => useTaskManager())

    await act(async () => {
      rerender()
    })

    await act(async () => {
      await result.current.handleTaskComplete(1)
    })

    expect(result.current.tasks).toEqual([])
  })

  it('should set an error when fetching tasks fails', async () => {
    vi.spyOn(taskService, 'getTasks').mockRejectedValue(new Error('Network error'))

    const { result, rerender } = renderHook(() => useTaskManager())

    await act(async () => {
      rerender()
    })

    expect(result.current.error).toBe('Failed to fetch tasks. Please try again.')
  })
}) 