import React, { useEffect, useState } from 'react';
import type { Task } from '../services/taskService';
import { taskService } from '../services/taskService';
import EditTaskModal from './EditTaskModal';

const RecentTasks: React.FC = () => {
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchRecentTasks = async () => {
    try {
      setLoading(true);
      // Use getAllTasks instead of getTasks to get all tasks (completed and incomplete)
      const tasks = await taskService.getAllTasks();
      const recentTasks = tasks
        .filter(task => !task.completed)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentTasks(recentTasks);
    } catch (error) {
      console.error('Error fetching recent tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentTasks();
  }, []);

  const handleComplete = async (taskId: number) => {
    try {
      await taskService.completeTask(taskId);
      await fetchRecentTasks(); // Refresh the list
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (taskId: number, updatedData: Partial<Task>) => {
    try {
      await taskService.updateTask(taskId, {
        title: updatedData.title || '',
        description: updatedData.description || '',
        priority: updatedData.priority || 'Medium',
        dueDate: updatedData.dueDate || null
      });
      await fetchRecentTasks(); // Refresh the list
      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading tasks...</p>
        ) : recentTasks.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No recent tasks found</p>
        ) : (
          recentTasks.map((task) => (
            <div
              key={task.id}
              className={`border-l-4 ${
                task.completed ? 'border-green-500' : 'border-blue-500'
              } bg-gray-50 p-4 rounded-r-lg`}
            >
              <h3 className={`font-semibold text-gray-800 ${
                task.completed ? 'line-through' : ''
              }`}>
                {task.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              <div className="flex justify-between items-center mt-2">
                <span className={`text-sm px-2 py-1 rounded ${
                  task.priority === 'High' 
                    ? 'bg-red-100 text-red-800' 
                    : task.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {task.priority}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex gap-2 mt-3">
                {!task.completed && (
                  <button
                    onClick={() => handleComplete(task.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                  >
                    Complete
                  </button>
                )}
                <button
                  onClick={() => handleEdit(task)}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isEditModalOpen && editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingTask(null);
          }}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default RecentTasks; 