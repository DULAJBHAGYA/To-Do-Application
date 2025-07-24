import React, { useState } from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import type { Task } from '../services/taskService';
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
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <Droppable droppableId="taskList">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="divide-y divide-gray-200"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-medium">{task.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority || 'No Priority'}
                          </span>
                          {task.completed && (
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mt-1">{task.description}</p>
                        {task.dueDate && (
                          <p className="text-sm text-gray-500 mt-1">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {!task.completed && (
                          <>
                            <button
                              onClick={() => handleTaskComplete(task.id)}
                              className="text-green-600 hover:text-green-700 font-medium"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => handleTaskEdit(task)}
                              className="text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Edit
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {tasks.length === 0 && (
              <div className="p-4 text-center text-gray-500">
                No tasks found
              </div>
            )}
          </div>
        )}
      </Droppable>

      {isEditModalOpen && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          onUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
};

export default TaskList;