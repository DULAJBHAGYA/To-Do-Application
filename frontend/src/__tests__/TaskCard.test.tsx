import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import TaskCard from '../components/TaskCard'
import { type Task } from '../services/taskService'
import userEvent from '@testing-library/user-event'

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test Description',
  completed: false,
  createdAt: new Date().toISOString(),
  completedAt: null,
  priority: 'Medium',
  dueDate: null,
}

describe('TaskCard', () => {
  it('renders task details correctly', () => {
    render(<TaskCard task={mockTask} onComplete={() => {}} onEdit={() => {}} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('calls onComplete when the complete button is clicked', async () => {
    const handleComplete = vi.fn();
    render(<TaskCard task={mockTask} onComplete={handleComplete} onEdit={() => {}} />);
    
    const completeButton = screen.getByText('Mark as Complete');
    await userEvent.click(completeButton);

    expect(handleComplete).toHaveBeenCalledTimes(1);
  });

  it('disables the complete button while completing', async () => {
    const handleComplete = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    render(<TaskCard task={mockTask} onComplete={handleComplete} onEdit={() => {}} />);
    
    const completeButton = screen.getByText('Mark as Complete');
    await userEvent.click(completeButton);

    expect(completeButton).toBeDisabled();
    await screen.findByText('Completing...');
  });
});