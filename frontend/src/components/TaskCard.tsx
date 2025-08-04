import React, { useState } from 'react'
import { type Task } from '../services/taskService'

interface TaskCardProps {
  task: Task;
  onComplete: () => void;
  onEdit: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onEdit }) => {
  const [isCompleting, setIsCompleting] = useState(false)

  const handleComplete = async () => {
    setIsCompleting(true)
    try {
      await onComplete()
    } finally {
      setIsCompleting(false)
    }
  }

  const getStatusInfo = () => {
    return {
      label: task.completed ? 'Completed' : 'Pending',
      color: task.completed ? 'text-green-600' : 'text-yellow-600',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {task.completed 
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          }
        </svg>
      )
    }
  }

  const status = getStatusInfo()

    const getPriorityInfo = () => {
        switch (task.priority) {
            case 'High':
                return { color: 'text-red-800', bgColor: 'bg-red-100' };
            case 'Medium':
                return { color: 'text-yellow-800', bgColor: 'bg-yellow-100' };
            case 'Low':
            default:
                return { color: 'text-green-800', bgColor: 'bg-green-100' };
        }
    }

  const priority = getPriorityInfo()

  return (
    <div className={`card p-5 flex items-start space-x-4 ${isCompleting ? 'opacity-50' : ''}`}>
      <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
        <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      </div>

      <div className="flex-grow">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
          <div className={`flex items-center text-sm font-medium ${status.color}`}>
            {status.icon}
            <span className="ml-1.5">{status.label}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mt-1 mb-4 text-sm">
          {task.description}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
          <span>
            Created: {new Date(task.createdAt).toLocaleDateString()}
          </span>
            {task.dueDate && (
                <span className="font-medium">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
            )}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${priority.bgColor} ${priority.color}`}>
              {task.priority} Priority
            </span>
          </div>
          {!task.completed && (
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="btn-secondary btn-sm"
              >
                Edit
              </button>
            <button
              onClick={handleComplete}
              disabled={isCompleting}
                className="btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCompleting ? 'Completing...' : 'Mark as Complete'}
            </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskCard