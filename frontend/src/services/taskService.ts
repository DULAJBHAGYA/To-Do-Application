import type { Task } from '../types/Task';

const API_BASE_URL = '/api/tasks';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
      throw new Error('Unauthorized');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    const response = await fetch(API_BASE_URL, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  createTask: async (task: Omit<Task, 'id' | 'completed' | 'createdAt'>): Promise<Task> => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(task)
    });
    return handleResponse(response);
  },

  completeTask: async (id: number): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}/complete`, {
      method: 'PUT',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  deleteTask: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        throw new Error('Unauthorized');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  },

  getTaskById: async (id: number): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getCompletedTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/completed`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  getAllTasks: async (): Promise<Task[]> => {
    const response = await fetch(`${API_BASE_URL}/all`, {
      method: 'GET',
      headers: getHeaders()
    });
    return handleResponse(response);
  },

  updateTask: async (id: number, updatedData: Partial<Task>): Promise<Task> => {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updatedData)
    });
    return handleResponse(response);
  }
};