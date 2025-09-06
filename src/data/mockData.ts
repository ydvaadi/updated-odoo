import { User, Project, Task, Message, Notification } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@synergysphere.com',
    initials: 'AJ',
  },
  {
    id: '2',
    name: 'Sarah Chen',
    email: 'sarah@synergysphere.com',
    initials: 'SC',
  },
  {
    id: '3',
    name: 'Mike Rodriguez',
    email: 'mike@synergysphere.com',
    initials: 'MR',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@synergysphere.com',
    initials: 'ED',
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design and improved UX',
    taskCount: 12,
    memberCount: 4,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms',
    taskCount: 8,
    memberCount: 3,
    createdAt: '2024-01-10',
  },
  {
    id: '3',
    name: 'Marketing Campaign Q1',
    description: 'Digital marketing strategy and execution for Q1 2024',
    taskCount: 15,
    memberCount: 5,
    createdAt: '2024-01-05',
  },
  {
    id: '4',
    name: 'API Integration',
    description: 'Third-party API integrations and microservices architecture',
    taskCount: 6,
    memberCount: 2,
    createdAt: '2024-01-20',
  },
];

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design user interface mockups',
    description: 'Create high-fidelity mockups for the main landing page and key user flows',
    status: 'in-progress',
    assignee: mockUsers[0],
    dueDate: '2024-02-15',
    projectId: '1',
  },
  {
    id: '2',
    title: 'Implement responsive navigation',
    description: 'Build responsive navigation component with mobile drawer functionality',
    status: 'todo',
    assignee: mockUsers[1],
    dueDate: '2024-02-20',
    projectId: '1',
  },
  {
    id: '3',
    title: 'Content strategy review',
    description: 'Review and update content strategy based on user research findings',
    status: 'done',
    assignee: mockUsers[2],
    dueDate: '2024-02-10',
    projectId: '1',
  },
  {
    id: '4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure automated testing and deployment pipeline',
    status: 'in-progress',
    assignee: mockUsers[3],
    dueDate: '2024-02-25',
    projectId: '2',
  },
  {
    id: '5',
    title: 'Database schema design',
    description: 'Design and implement database schema for user management',
    status: 'todo',
    assignee: mockUsers[1],
    dueDate: '2024-03-01',
    projectId: '2',
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hey team, I\'ve uploaded the latest design mockups. Please review and let me know your thoughts!',
    sender: mockUsers[0],
    timestamp: '2024-02-14T10:30:00Z',
    projectId: '1',
  },
  {
    id: '2',
    content: 'Looks great! I have some feedback on the navigation structure. Should we schedule a quick call?',
    sender: mockUsers[1],
    timestamp: '2024-02-14T11:15:00Z',
    projectId: '1',
  },
  {
    id: '3',
    content: 'The color scheme is perfect. How about we discuss the mobile breakpoints?',
    sender: mockUsers[2],
    timestamp: '2024-02-14T14:20:00Z',
    projectId: '1',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Task assigned',
    message: 'You have been assigned to "Design user interface mockups"',
    timestamp: '2024-02-14T09:00:00Z',
    read: false,
    type: 'task',
  },
  {
    id: '2',
    title: 'Project update',
    message: 'Website Redesign project has been updated',
    timestamp: '2024-02-13T16:30:00Z',
    read: true,
    type: 'project',
  },
  {
    id: '3',
    title: 'New mention',
    message: 'Sarah Chen mentioned you in a comment',
    timestamp: '2024-02-13T11:45:00Z',
    read: false,
    type: 'mention',
  },
  {
    id: '4',
    title: 'System update',
    message: 'SynergySphere will undergo maintenance tonight from 2-4 AM',
    timestamp: '2024-02-12T18:00:00Z',
    read: true,
    type: 'system',
  },
];