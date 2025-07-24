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
      const allTasks = await taskService.getTasks();
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

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your Task Manager</h1>
        <p className="text-lg opacity-90">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-blue-800">Total Tasks</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">{stats.total}</p>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-green-800">Completed</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">{stats.completed}</p>
        </div>
        <div className="bg-yellow-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-yellow-800">Pending</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
        </div>
        <div className="bg-red-100 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-lg font-semibold text-red-800">High Priority</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{stats.highPriority}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
