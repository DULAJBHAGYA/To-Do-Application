export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
}

const API_BASE_URL = '/api/auth';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    // Handle validation errors (object with field names as keys)
    if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
      const errorMessages = Object.values(errorData).join(', ');
      throw new Error(errorMessages);
    }
    
    // Handle other error formats
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const authService = {
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(response);
  },

  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  logout: (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  getUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
}; 