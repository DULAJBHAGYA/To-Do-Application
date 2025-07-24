import React, { useState, useEffect } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import type { Task } from '../services/taskService';
import { taskService } from '../services/taskService';
import type { User } from '../services/authService';

interface SidebarProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tasks: Task[];
}

interface TaskFormProps {
  onTaskAdded: () => Promise<void>;
}

interface TaskListProps {
  tasks: Task[];
  onTasksUpdated: () => Promise<void>;
}

interface LayoutProps {
  currentUser: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ currentUser, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dashboardRefreshTrigger, setDashboardRefreshTrigger] = useState<number>(0);

  const fetchTasks = async () => {
    try {
      const tasks = await taskService.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  // Function to refresh both tasks and dashboard stats
  const refreshAll = async () => {
    await fetchTasks();
    setDashboardRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  const filterTasks = (tasks: Task[]): Task[] => {
    let filteredTasks = tasks;

    // Apply search filter
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status/priority filter
    switch (selectedFilter) {
      case 'completed':
        return filteredTasks.filter(task => task.completed);
      case 'pending':
        return filteredTasks.filter(task => !task.completed);
      case 'high':
        return filteredTasks.filter(task => task.priority?.toLowerCase() === 'high');
      case 'medium':
        return filteredTasks.filter(task => task.priority?.toLowerCase() === 'medium');
      case 'low':
        return filteredTasks.filter(task => task.priority?.toLowerCase() === 'low');
      case 'recent':
        return [...filteredTasks].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ).slice(0, 5);
      default:
        return filteredTasks;
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-100">
        {/* Header with user info and logout */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
              <div className="flex items-center space-x-4">
                <span className="text-blue-600 font-medium">
                  Welcome, {currentUser?.username || 'User'}!
                </span>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Dashboard Section */}
          <div className="mb-8">
            <Dashboard refreshTrigger={dashboardRefreshTrigger} />
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-3">
              <Sidebar
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                tasks={tasks}
              />
            </div>

            {/* Main Content */}
            <div className="col-span-9">
              <div className="bg-white rounded-lg shadow p-6">
                <TaskForm onTaskAdded={refreshAll} />
                <TaskList tasks={filterTasks(tasks)} onTasksUpdated={refreshAll} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Layout; 