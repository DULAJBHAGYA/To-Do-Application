import React, { useState, useEffect } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import type { Task } from '../types/Task';
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
      // Use getAllTasks instead of getTasks to get all tasks (completed and incomplete)
      const tasks = await taskService.getAllTasks();
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        {/* Enhanced Header */}
        <div className="bg-white dark:bg-gray-800 shadow-lg border-b border-blue-200 dark:border-gray-700 transition-colors duration-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    DoTask
                  </h1>
                </div>
                <div className="hidden md:block">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Active</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden md:flex items-center space-x-3 bg-blue-50 dark:bg-gray-700 px-4 py-2 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Welcome, {currentUser?.username || 'User'}!
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Ready to be productive</p>
                  </div>
                </div>
                
                {/* Theme Toggle */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block">Theme</span>
                  <ThemeToggle />
                </div>
                
                <button
                  onClick={onLogout}
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8">
          {/* Dashboard Section */}
          <div className="mb-8">
            <Dashboard refreshTrigger={dashboardRefreshTrigger} />
          </div>

          <div className="grid grid-cols-12 gap-8">
            {/* Enhanced Sidebar */}
            <div className="col-span-12 lg:col-span-3">
              <div className="sticky top-8">
                <Sidebar
                  selectedFilter={selectedFilter}
                  onFilterChange={setSelectedFilter}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  tasks={tasks}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 overflow-hidden transition-colors duration-300">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 px-6 py-4 border-b border-blue-200 dark:border-gray-600">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Task Management</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Create, organize, and complete your tasks</p>
                </div>
                <div className="p-6">
                  <TaskForm onTaskAdded={refreshAll} />
                  <div className="mt-8">
                    <TaskList tasks={filterTasks(tasks)} onTasksUpdated={refreshAll} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Layout; 