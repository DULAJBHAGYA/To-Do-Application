import React from 'react';
import type { Task } from '../services/taskService';

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

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Filter List */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'all' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
          onClick={() => onFilterChange('all')}
        >
          All Tasks
          <span className="float-right">{taskCounts.all}</span>
        </button>

        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'recent' ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'
          }`}
          onClick={() => onFilterChange('recent')}
        >
          Recent Tasks
          <span className="float-right">{taskCounts.recent}</span>
        </button>

        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'completed' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
          }`}
          onClick={() => onFilterChange('completed')}
        >
          Completed
          <span className="float-right">{taskCounts.completed}</span>
        </button>

        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'hover:bg-gray-100'
          }`}
          onClick={() => onFilterChange('pending')}
        >
          Pending
          <span className="float-right">{taskCounts.pending}</span>
        </button>

        <h3 className="text-lg font-semibold mt-6 mb-4">Priority</h3>

        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'high' ? 'bg-red-100 text-red-700' : 'hover:bg-gray-100'
          }`}
          onClick={() => onFilterChange('high')}
        >
          High Priority
          <span className="float-right">{taskCounts.high}</span>
        </button>

        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'medium' ? 'bg-orange-100 text-orange-700' : 'hover:bg-gray-100'
          }`}
          onClick={() => onFilterChange('medium')}
        >
          Medium Priority
          <span className="float-right">{taskCounts.medium}</span>
        </button>

        <button
          className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
            selectedFilter === 'low' ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'
          }`}
          onClick={() => onFilterChange('low')}
        >
          Low Priority
          <span className="float-right">{taskCounts.low}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar; 