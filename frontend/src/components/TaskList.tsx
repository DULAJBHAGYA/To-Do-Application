import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import type { Task } from '../types/Task';
import { taskService } from '../services/taskService';
import EditTaskModal from './EditTaskModal';

interface TaskListProps {
  tasks: Task[];
  onTasksUpdated: () => Promise<void>;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTasksUpdated }) => {
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleTaskComplete = async (taskId: number) => {
    try {
      await taskService.completeTask(taskId);
      await onTasksUpdated();
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleTaskUpdate = async (taskId: number, updatedData: Partial<Task>) => {
    try {
      await taskService.updateTask(taskId, updatedData);
      await onTasksUpdated();
      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'medium':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'low':
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Your Tasks</h3>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}</span>
        </div>
      </div>

      <Droppable droppableId="taskList">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-4"
          >
            {tasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No tasks found</h3>
                <p className="text-gray-600 dark:text-gray-300">Create your first task to get started!</p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 transition-all duration-200 ${
                        snapshot.isDragging ? 'shadow-xl transform rotate-2' : 'hover:shadow-lg hover:-translate-y-1'
                      } ${task.completed ? 'opacity-75' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-start space-x-4">
                            {/* Task Status Indicator */}
                            <div className="flex-shrink-0 mt-1">
                              {task.completed ? (
                                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="w-6 h-6 border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-blue-500 dark:hover:border-blue-400 transition-colors"></div>
                              )}
                            </div>

                            {/* Task Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-900 dark:text-white'}`}>
                                  {task.title}
                                </h3>
                                
                                {/* Priority Badge */}
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                                  {getPriorityIcon(task.priority)}
                                  <span className="ml-1">{task.priority || 'No Priority'}</span>
                                </span>

                                {/* Completed Badge */}
                                {task.completed && (
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-700">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Completed
                                  </span>
                                )}
                              </div>

                              <p className={`text-gray-600 dark:text-gray-300 mb-3 ${task.completed ? 'line-through' : ''}`}>
                                {task.description}
                              </p>

                              {/* Task Metadata */}
                              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                {task.dueDate && (
                                  <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!task.completed && (
                            <button
                              onClick={() => handleTaskComplete(task.id)}
                              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                              <div className="flex items-center space-x-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Complete</span>
                              </div>
                            </button>
                          )}
                          <button
                            onClick={() => handleTaskEdit(task)}
                            className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200"
                          >
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              <span>Edit</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {isEditModalOpen && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default TaskList;