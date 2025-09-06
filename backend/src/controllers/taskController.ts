import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { CreateTaskRequest, UpdateTaskRequest, TaskWithDetails, ApiResponse, AuthenticatedRequest } from '../types';
import { TaskStatus, Priority } from '@prisma/client';

export const createTask = async (req: AuthenticatedRequest<{ id: string }, ApiResponse, CreateTaskRequest>, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { title, description, assigneeId, dueDate, priority = 'MEDIUM' } = req.body;
    const userId = req.user!.id;

    // Check if user is a member of the project
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        projectId,
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project.',
      });
    }

    // If assignee is specified, check if they are a member of the project
    if (assigneeId) {
      const assigneeMembership = await prisma.membership.findFirst({
        where: {
          userId: assigneeId,
          projectId,
        },
      });

      if (!assigneeMembership) {
        return res.status(400).json({
          success: false,
          message: 'Assignee must be a member of the project',
        });
      }
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        assigneeId: assigneeId || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        priority: priority as Priority,
        projectId,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    // Create notification for assignee
    if (assigneeId) {
      await prisma.notification.create({
        data: {
          type: 'TASK_ASSIGNED',
          message: `You have been assigned a new task: "${title}"`,
          userId: assigneeId,
          projectId,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task,
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getTasks = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const userId = req.user!.id;

    // Check if user is a member of the project
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        projectId,
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project.',
      });
    }

    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    res.json({
      success: true,
      message: 'Tasks retrieved successfully',
      data: tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getTask = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user is a member of the project
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        projectId: task.projectId,
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project.',
      });
    }

    res.json({
      success: true,
      message: 'Task retrieved successfully',
      data: task,
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateTask = async (req: AuthenticatedRequest<{ id: string }, ApiResponse, UpdateTaskRequest>, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, status, assigneeId, dueDate, priority } = req.body;
    const userId = req.user!.id;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user is a member of the project
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        projectId: task.projectId,
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project.',
      });
    }

    // If assignee is being changed, check if they are a member of the project
    if (assigneeId && assigneeId !== task.assigneeId) {
      const assigneeMembership = await prisma.membership.findFirst({
        where: {
          userId: assigneeId,
          projectId: task.projectId,
        },
      });

      if (!assigneeMembership) {
        return res.status(400).json({
          success: false,
          message: 'Assignee must be a member of the project',
        });
      }
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        status: status as TaskStatus,
        assigneeId: assigneeId || task.assigneeId,
        dueDate: dueDate ? new Date(dueDate) : task.dueDate,
        priority: priority as Priority,
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            description: true,
          },
        },
      },
    });

    // Create notifications for status changes and assignments
    if (status === 'DONE' && task.status !== 'DONE') {
      await prisma.notification.create({
        data: {
          type: 'TASK_COMPLETED',
          message: `Task "${title}" has been completed`,
          userId: task.assigneeId || userId,
          projectId: task.projectId,
        },
      });
    }

    if (assigneeId && assigneeId !== task.assigneeId) {
      await prisma.notification.create({
        data: {
          type: 'TASK_ASSIGNED',
          message: `You have been assigned a new task: "${title}"`,
          userId: assigneeId,
          projectId: task.projectId,
        },
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask,
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteTask = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: true,
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found',
      });
    }

    // Check if user is a member of the project
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        projectId: task.projectId,
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project.',
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
