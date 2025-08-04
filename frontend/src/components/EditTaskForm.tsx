import React, { useState, useEffect } from 'react';
import { type Task, type UpdatableTask } from '../services/taskService';

interface EditTaskFormProps {
  task: Task;
  onUpdate: (taskData: UpdatableTask) => Promise<boolean>;
  onClose: () => void;
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({ task, onUpdate, onClose }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
  }, [task]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await onUpdate({
      ...task,
      title,
      description,
      priority,
      dueDate,
    });
    if (success) {
      onClose();
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <div>
        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          id="edit-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="edit-description"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input-field"
        />
      </div>
      <div>
        <label htmlFor="edit-priority" className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="edit-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="input-field"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>
      </div>
      <div>
        <label htmlFor="edit-due-date" className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          id="edit-due-date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Task'}
        </button>
      </div>
    </form>
  );
};

export default EditTaskForm;
