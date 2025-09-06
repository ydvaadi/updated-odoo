import { API_CONFIG } from '../config/api';

const API_BASE_URL = API_CONFIG.BASE_URL;

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
  };
  accessToken: string;
  refreshToken: string;
}

interface Project {
  id: string;
  name: string;
  description: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  memberships?: Array<{
    id: string;
    role: 'MEMBER' | 'ADMIN';
    user: {
      id: string;
      name: string;
      email: string;
    };
  }>;
  _count?: {
    tasks: number;
    messages: number;
  };
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  dueDate: string | null;
  projectId: string;
  assigneeId: string | null;
  createdAt: string;
  updatedAt: string;
  assignee?: {
    id: string;
    name: string;
    email: string;
  };
  project?: {
    id: string;
    name: string;
    description: string | null;
  };
}

interface Message {
  id: string;
  content: string;
  projectId: string;
  authorId: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

interface Notification {
  id: string;
  type: string;
  message: string;
  userId: string;
  projectId: string | null;
  isRead: boolean;
  createdAt: string;
  project?: {
    id: string;
    name: string;
    description: string | null;
  };
}

class ApiService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    // Load tokens from localStorage
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.accessToken && { Authorization: `Bearer ${this.accessToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        // If token expired, try to refresh
        if (response.status === 401 && this.refreshToken) {
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            // Retry the original request with new token
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${this.accessToken}`,
            };
            const retryResponse = await fetch(url, config);
            return await retryResponse.json();
          }
        }
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.accessToken = data.data.accessToken;
        localStorage.setItem('accessToken', this.accessToken);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    // If refresh fails, clear tokens
    this.logout();
    return false;
  }

  // Auth methods
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });

    if (response.success && response.data) {
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
      return response.data;
    } else {
      throw new Error(response.message || 'Registration failed');
    }
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.accessToken = response.data.accessToken;
      this.refreshToken = response.data.refreshToken;
      localStorage.setItem('accessToken', this.accessToken);
      localStorage.setItem('refreshToken', this.refreshToken);
      return response.data;
    } else {
      throw new Error(response.message || 'Login failed');
    }
  }

  async getCurrentUser(): Promise<{ id: string; name: string; email: string; createdAt: string; updatedAt: string }> {
    const response = await this.request<{ id: string; name: string; email: string; createdAt: string; updatedAt: string }>('/auth/me');
    return response.data!;
  }

  async logout(): Promise<void> {
    if (this.refreshToken) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });
      } catch (error) {
        console.error('Logout request failed:', error);
      }
    }

    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Project methods
  async getProjects(): Promise<Project[]> {
    const response = await this.request<Project[]>('/projects');
    return response.data || [];
  }

  async getProject(id: string): Promise<Project> {
    const response = await this.request<Project>(`/projects/${id}`);
    return response.data!;
  }

  async createProject(name: string, description?: string): Promise<Project> {
    const response = await this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description }),
    });
    return response.data!;
  }

  async updateProject(id: string, name?: string, description?: string): Promise<Project> {
    const response = await this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name, description }),
    });
    return response.data!;
  }

  async deleteProject(id: string): Promise<void> {
    await this.request(`/projects/${id}`, { method: 'DELETE' });
  }

  async inviteMember(projectId: string, email: string, role: 'MEMBER' | 'ADMIN' = 'MEMBER'): Promise<void> {
    await this.request(`/projects/${projectId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    });
  }

  async removeMember(projectId: string, userId: string): Promise<void> {
    await this.request(`/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  async getProjectOverview(projectId: string): Promise<any> {
    const response = await this.request(`/projects/${projectId}/overview`);
    return response.data;
  }

  // Task methods
  async getTasks(projectId: string): Promise<Task[]> {
    const response = await this.request<Task[]>(`/tasks/projects/${projectId}/tasks`);
    return response.data || [];
  }

  async getTask(id: string): Promise<Task> {
    const response = await this.request<Task>(`/tasks/${id}`);
    return response.data!;
  }

  async createTask(
    projectId: string,
    title: string,
    description?: string,
    assigneeId?: string,
    dueDate?: string,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT' = 'MEDIUM'
  ): Promise<Task> {
    const response = await this.request<Task>(`/tasks/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title, description, assigneeId, dueDate, priority }),
    });
    return response.data!;
  }

  async updateTask(
    id: string,
    title?: string,
    description?: string,
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE',
    assigneeId?: string,
    dueDate?: string,
    priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  ): Promise<Task> {
    const response = await this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ title, description, status, assigneeId, dueDate, priority }),
    });
    return response.data!;
  }

  async deleteTask(id: string): Promise<void> {
    await this.request(`/tasks/${id}`, { method: 'DELETE' });
  }

  // Message methods
  async getMessages(projectId: string): Promise<Message[]> {
    const response = await this.request<Message[]>(`/messages/projects/${projectId}/messages`);
    return response.data || [];
  }

  async createMessage(projectId: string, content: string): Promise<Message> {
    const response = await this.request<Message>(`/messages/projects/${projectId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
    return response.data!;
  }

  // Notification methods
  async getNotifications(page: number = 1, limit: number = 10): Promise<{
    data: Notification[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const response = await this.request<{
      data: Notification[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(`/notifications?page=${page}&limit=${limit}`);
    return response.data!;
  }

  async getUnreadCount(): Promise<{ count: number }> {
    const response = await this.request<{ count: number }>('/notifications/unread-count');
    return response.data!;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.request(`/notifications/${id}/read`, { method: 'PUT' });
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.request('/notifications/mark-all-read', { method: 'PUT' });
  }
}

export const apiService = new ApiService();
export type { Project, Task, Message, Notification, AuthResponse };
