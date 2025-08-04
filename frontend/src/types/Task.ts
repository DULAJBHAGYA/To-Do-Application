export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  priority: string;
  dueDate: string | null;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  highPriority: number;
}

export type UpdatableTask = Omit<Task, 'id' | 'createdAt' | 'completedAt'>; 