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

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  
  // Get user ID from localStorage
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      if (user.id) {
        headers['X-User-ID'] = user.id.toString();
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
  }
  
  return headers;
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch(API_BASE_URL, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  getTaskStats: async (): Promise<TaskStats> => {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  getCompletedTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/completed`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  getPendingTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/pending`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  getHighPriorityTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/high-priority`, {
      headers: getHeaders()
    })
    return handleResponse(response)
  },

  updateTask: async (id: number, taskData: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(taskData),
    });
    return handleResponse(response);
  },

  createTask: async (taskData: { title: string, description: string, priority: string, dueDate: string | null }): Promise<Task> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    })
    return handleResponse(response)
  },

  completeTask: async (taskId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${taskId}/complete`, {
      method: 'PUT',
      headers: getHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
  },

  deleteTask: async (taskId: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }
  }
}