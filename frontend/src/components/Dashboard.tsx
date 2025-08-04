import React, { useEffect, useState } from 'react';
import { taskService } from '../services/taskService';

interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
}

interface DashboardProps {
  refreshTrigger?: number;
}

const Dashboard: React.FC<DashboardProps> = ({ refreshTrigger }) => {
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    completed: 0,
    pending: 0,
    highPriority: 0
  });

  const fetchTaskStats = async () => {
    try {
      console.log('Fetching task stats...');
      // Use getAllTasks instead of getTasks to get all tasks (completed and incomplete)
      const allTasks = await taskService.getAllTasks();
      console.log('All tasks:', allTasks);
      
      // Calculate stats from tasks
      const stats = {
        total: allTasks.length,
        completed: allTasks.filter(task => task.completed).length,
        pending: allTasks.filter(task => !task.completed).length,
        highPriority: allTasks.filter(task => task.priority?.toLowerCase() === 'high').length
      };

      console.log('Calculated stats:', stats);
      setStats(stats);
    } catch (error) {
      console.error('Error fetching task stats:', error);
    }
  };

  useEffect(() => {
    fetchTaskStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchTaskStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Refresh stats when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger && refreshTrigger > 0) {
      fetchTaskStats();
    }
  }, [refreshTrigger]);

  const getCompletionPercentage = () => {
    return stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-2xl shadow-2xl">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 dark:bg-blue-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-400 dark:bg-indigo-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-500 dark:bg-blue-700 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome to DoTask</h1>
              <p className="text-xl opacity-90 mb-4">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm opacity-90">Active Session</span>
                </div>
                <span className="text-sm opacity-75">•</span>
                <span className="text-sm opacity-90">Ready to be productive!</span>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid with Enhanced Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Tasks Card */}
        <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-200 dark:border-gray-600">
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">Total Tasks</h3>
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{stats.total}</p>
            <p className="text-sm text-blue-600 dark:text-blue-300 opacity-75">All your tasks</p>
          </div>
        </div>

        {/* Completed Tasks Card */}
        <div className="group relative bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-200 dark:border-gray-600">
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">Completed</h3>
            <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{stats.completed}</p>
            <p className="text-sm text-green-600 dark:text-green-300 opacity-75">{getCompletionPercentage()}% done</p>
          </div>
        </div>

        {/* Pending Tasks Card */}
        <div className="group relative bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-yellow-200 dark:border-gray-600">
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Pending</h3>
            <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">{stats.pending}</p>
            <p className="text-sm text-yellow-600 dark:text-yellow-300 opacity-75">Still to do</p>
          </div>
        </div>

        {/* High Priority Tasks Card */}
        <div className="group relative bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-red-200 dark:border-gray-600">
          <div className="absolute top-4 right-4">
            <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">High Priority</h3>
            <p className="text-4xl font-bold text-red-600 dark:text-red-400 mb-2">{stats.highPriority}</p>
            <p className="text-sm text-red-600 dark:text-red-300 opacity-75">Urgent tasks</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {stats.total > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Overall Progress</h3>
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{getCompletionPercentage()}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${getCompletionPercentage()}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mt-2">
            <span>{stats.completed} completed</span>
            <span>{stats.pending} remaining</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
