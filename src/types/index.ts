export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  taskCount: number;
  memberCount: number;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  assignee: User;
  dueDate: string;
  projectId: string;
}

export interface Message {
  id: string;
  content: string;
  sender: User;
  timestamp: string;
  projectId: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'task' | 'project' | 'mention' | 'system';
}