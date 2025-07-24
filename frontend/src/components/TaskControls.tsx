import React from 'react';

interface TaskControlsProps {
  onSearch: (query: string) => void;
  onSortChange: (sortBy: string) => void;
}

const TaskControls: React.FC<TaskControlsProps> = ({ onSearch, onSortChange }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="w-1/2">
        <input
          type="text"
          placeholder="Search tasks..."
          className="input-field"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="w-1/2 flex justify-end">
        <select
          className="input-field"
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="createdAt">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
        </select>
      </div>
    </div>
  );
};

export default TaskControls;
