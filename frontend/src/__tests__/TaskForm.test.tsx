import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import TaskForm from '../components/TaskForm'

describe('TaskForm', () => {
  it('submits the form with title and description', async () => {
    const onTaskCreate = vi.fn().mockImplementation(async () => true)
    render(<TaskForm onTaskCreate={onTaskCreate} />)

    fireEvent.change(screen.getByLabelText('Task Title *'), {
      target: { value: 'New Task' },
    })
    fireEvent.change(screen.getByLabelText('Description *'), {
      target: { value: 'New Description' },
    })

    fireEvent.click(screen.getByText('Add Task'))

    await waitFor(() => {
      expect(onTaskCreate).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'New Description',
      })
    })
  })

  it('disables submit button when submitting', async () => {
    const onTaskCreate = vi.fn().mockImplementation(async () => new Promise(resolve => setTimeout(() => resolve(true), 100)))
    render(<TaskForm onTaskCreate={onTaskCreate} />)

    fireEvent.change(screen.getByLabelText('Task Title *'), {
      target: { value: 'New Task' },
    })
    fireEvent.change(screen.getByLabelText('Description *'), {
      target: { value: 'New Description' },
    })

    fireEvent.click(screen.getByText('Add Task'))

    expect(screen.getByText('Creating...')).toBeInTheDocument()
    await waitFor(() => {
      expect(screen.queryByText('Creating...')).not.toBeInTheDocument()
    })
  })
})