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

const API_BASE_URL = '/api/tasks'

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch(API_BASE_URL)
    return handleResponse(response)
  },

  getTaskStats: async (): Promise<TaskStats> => {
    const response = await fetch(`${API_BASE_URL}/stats`)
    return handleResponse(response)
  },

  getCompletedTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/completed`)
    return handleResponse(response)
  },

  getPendingTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/pending`)
    return handleResponse(response)
  },

  getHighPriorityTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/high-priority`)
    return handleResponse(response)
  },

  updateTask: async (id: number, taskData: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  createTask: async (taskData: { title: string, description: string, priority: string, dueDate: string | null }): Promise<Task> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(taskData)
    })
    return handleResponse(response)
  },

  completeTask: async (taskId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${taskId}/complete`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
  },

  deleteTask: async (taskId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
  }
}