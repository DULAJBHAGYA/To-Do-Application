import React from 'react';
import type { Task } from '../types/Task';

interface SidebarProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  tasks: Task[];
}

const Sidebar: React.FC<SidebarProps> = ({
  selectedFilter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  tasks
}) => {
  const getTaskCounts = () => {
    return {
      all: tasks.length,
      completed: tasks.filter(task => task.completed).length,
      pending: tasks.filter(task => !task.completed).length,
      high: tasks.filter(task => task.priority?.toLowerCase() === 'high').length,
      medium: tasks.filter(task => task.priority?.toLowerCase() === 'medium').length,
      low: tasks.filter(task => task.priority?.toLowerCase() === 'low').length,
      recent: Math.min(tasks.length, 5)
    };
  };

  const taskCounts = getTaskCounts();

  const filterButtons = [
    {
      id: 'all',
      label: 'All Tasks',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      count: taskCounts.all,
      color: 'blue'
    },
    {
      id: 'recent',
      label: 'Recent Tasks',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      count: taskCounts.recent,
      color: 'indigo'
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      count: taskCounts.completed,
      color: 'green'
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      count: taskCounts.pending,
      color: 'yellow'
    }
  ];

  const priorityButtons = [
    {
      id: 'high',
      label: 'High Priority',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      count: taskCounts.high,
      color: 'red'
    },
    {
      id: 'medium',
      label: 'Medium Priority',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      count: taskCounts.medium,
      color: 'orange'
    },
    {
      id: 'low',
      label: 'Low Priority',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      count: taskCounts.low,
      color: 'green'
    }
  ];

  const getButtonClasses = (isSelected: boolean, color: string) => {
    const baseClasses = "w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center justify-between group";
    
    if (isSelected) {
      const colorClasses = {
        blue: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-2 border-blue-200 dark:border-blue-700 shadow-md',
        indigo: 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 border-2 border-indigo-200 dark:border-indigo-700 shadow-md',
        green: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-2 border-green-200 dark:border-green-700 shadow-md',
        yellow: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-2 border-yellow-200 dark:border-yellow-700 shadow-md',
        red: 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-700 shadow-md',
        orange: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 border-2 border-orange-200 dark:border-orange-700 shadow-md'
      };
      return `${baseClasses} ${colorClasses[color as keyof typeof colorClasses]}`;
    }
    
    return `${baseClasses} hover:bg-gray-50 dark:hover:bg-gray-700 border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-600`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700 p-6 transition-colors duration-300">
      {/* Enhanced Search Box */}
      <div className="mb-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 dark:bg-gray-700 hover:bg-white dark:hover:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Sections */}
      <div className="space-y-6">
        {/* Status Filters */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
            </svg>
            Status
          </h3>
          <div className="space-y-2">
            {filterButtons.map((button) => (
              <button
                key={button.id}
                className={getButtonClasses(selectedFilter === button.id, button.color)}
                onClick={() => onFilterChange(button.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-${button.color}-600 dark:text-${button.color}-400 group-hover:text-${button.color}-700 dark:group-hover:text-${button.color}-300`}>
                    {button.icon}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{button.label}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-${button.color}-100 dark:bg-${button.color}-900 text-${button.color}-700 dark:text-${button.color}-300`}>
                  {button.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Priority Filters */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Priority
          </h3>
          <div className="space-y-2">
            {priorityButtons.map((button) => (
              <button
                key={button.id}
                className={getButtonClasses(selectedFilter === button.id, button.color)}
                onClick={() => onFilterChange(button.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-${button.color}-600 dark:text-${button.color}-400 group-hover:text-${button.color}-700 dark:group-hover:text-${button.color}-300`}>
                    {button.icon}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{button.label}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-${button.color}-100 dark:bg-${button.color}-900 text-${button.color}-700 dark:text-${button.color}-300`}>
                  {button.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 