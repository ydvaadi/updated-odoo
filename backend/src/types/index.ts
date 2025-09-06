import { User, Project, Task, Message, Notification, Membership, RefreshToken, Role, TaskStatus, Priority, NotificationType } from '@prisma/client';

// Base types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Auth types
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: Omit<User, 'passwordHash'>;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Project types
export interface CreateProjectRequest {
  name: string;
  description?: string;
}

export interface UpdateProjectRequest {
  name?: string;
  description?: string;
}

export interface InviteMemberRequest {
  email: string;
  role?: Role;
}

export interface ProjectWithMembers extends Project {
  memberships: (Membership & {
    user: Omit<User, 'passwordHash'>;
  })[];
}

export interface ProjectOverview {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  completionPercentage: number;
  workloadDistribution: {
    userId: string;
    userName: string;
    taskCount: number;
  }[];
}

// Task types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  assigneeId?: string;
  dueDate?: string;
  priority?: Priority;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
  priority?: Priority;
}

export interface TaskWithDetails extends Task {
  assignee?: Omit<User, 'passwordHash'>;
  project: Project;
}

// Message types
export interface CreateMessageRequest {
  content: string;
}

export interface MessageWithAuthor extends Message {
  author: Omit<User, 'passwordHash'>;
}

// Notification types
export interface NotificationWithProject extends Notification {
  project?: {
    id: string;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
  };
}

// JWT Payload
export interface JWTPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

// Request with user
export interface AuthenticatedRequest<P = any, ResBody = any, ReqBody = any, ReqQuery = any> extends Request<P, ResBody, ReqBody, ReqQuery> {
  user?: Omit<User, 'passwordHash'>;
}

// Pagination
export interface PaginationQuery {
  page?: string;
  limit?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Re-export Prisma types
export {
  User,
  Project,
  Task,
  Message,
  Notification,
  Membership,
  RefreshToken,
  Role,
  TaskStatus,
  Priority,
  NotificationType,
};
