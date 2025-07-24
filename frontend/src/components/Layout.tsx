import React, { useState, useEffect } from 'react';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import Dashboard from './Dashboard';
import Sidebar from './Sidebar';
import type { Task } from '../services/taskService';
import { taskService } from '../services/taskService';

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

const Layout: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const fetchTasks = async () => {
    try {
      const tasks = await taskService.getTasks();
      setTasks(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
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
        <div className="container mx-auto px-4 py-8">
          {/* Dashboard Section */}
          <div className="mb-8">
            <Dashboard />
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-3">
              <Sidebar
                onFilterChange={setSelectedFilter}
                selectedFilter={selectedFilter}
                onSearchChange={setSearchQuery}
                searchQuery={searchQuery}
                tasks={tasks}
              />
            </div>

            {/* Main Content */}
            <div className="col-span-9 space-y-6">
              <TaskForm onTaskAdded={fetchTasks} />
              <TaskList 
                tasks={filterTasks(tasks)} 
                onTasksUpdated={fetchTasks}
              />
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default Layout; 