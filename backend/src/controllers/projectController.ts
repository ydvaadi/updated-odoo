import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { CreateProjectRequest, UpdateProjectRequest, InviteMemberRequest, ProjectWithMembers, ProjectOverview, ApiResponse, AuthenticatedRequest } from '../types';
import { Role } from '@prisma/client';

export const createProject = async (req: AuthenticatedRequest<{}, ApiResponse, CreateProjectRequest>, res: Response) => {
  try {
    const { name, description } = req.body;
    const userId = req.user!.id;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        createdBy: userId,
        memberships: {
          create: {
            userId,
            role: 'ADMIN',
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const projects = await prisma.project.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            messages: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({
      success: true,
      message: 'Projects retrieved successfully',
      data: projects,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getProject = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user is a member of the project
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        projectId: id,
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You are not a member of this project.',
      });
    }

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
        _count: {
          select: {
            tasks: true,
            messages: true,
          },
        },
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    res.json({
      success: true,
      message: 'Project retrieved successfully',
      data: project,
    });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateProject = async (req: AuthenticatedRequest<{ id: string }, ApiResponse, UpdateProjectRequest>, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const userId = req.user!.id;

    // Check if user is admin of the project
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        projectId: id,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only project admins can update the project.',
      });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        name,
        description,
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const inviteMember = async (req: AuthenticatedRequest<{ id: string }, ApiResponse, InviteMemberRequest>, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { email, role = 'MEMBER' } = req.body;
    const userId = req.user!.id;

    // Check if user is admin of the project
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        projectId,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only project admins can invite members.',
      });
    }

    // Find user by email
    const userToInvite = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToInvite) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is already a member
    const existingMembership = await prisma.membership.findFirst({
      where: {
        userId: userToInvite.id,
        projectId,
      },
    });

    if (existingMembership) {
      return res.status(409).json({
        success: false,
        message: 'User is already a member of this project',
      });
    }

    // Add user to project
    await prisma.membership.create({
      data: {
        userId: userToInvite.id,
        projectId,
        role: role as Role,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'PROJECT_INVITED',
        message: `You have been invited to join the project "${req.body.name || 'Unknown Project'}"`,
        userId: userToInvite.id,
        projectId,
      },
    });

    res.json({
      success: true,
      message: 'Member invited successfully',
    });
  } catch (error) {
    console.error('Invite member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const removeMember = async (req: AuthenticatedRequest<{ id: string; userId: string }>, res: Response) => {
  try {
    const { id: projectId, userId: memberId } = req.params;
    const userId = req.user!.id;

    // Check if user is admin of the project
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        projectId,
        role: 'ADMIN',
      },
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only project admins can remove members.',
      });
    }

    // Check if trying to remove the project creator
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (project?.createdBy === memberId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot remove the project creator',
      });
    }

    // Remove membership
    await prisma.membership.deleteMany({
      where: {
        userId: memberId,
        projectId,
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        type: 'PROJECT_MEMBER_REMOVED',
        message: `You have been removed from the project "${project?.name || 'Unknown Project'}"`,
        userId: memberId,
        projectId,
      },
    });

    res.json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteProject = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    // Check if user is the project creator
    const project = await prisma.project.findUnique({
      where: { id },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (project.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only the project creator can delete the project.',
      });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getProjectOverview = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
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

    // Get project tasks
    const tasks = await prisma.task.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'DONE').length;
    const overdueTasks = tasks.filter(task => 
      task.dueDate && 
      task.status !== 'DONE' && 
      new Date(task.dueDate) < new Date()
    ).length;
    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Calculate workload distribution
    const workloadDistribution = tasks.reduce((acc, task) => {
      if (task.assignee) {
        const existing = acc.find(w => w.userId === task.assignee!.id);
        if (existing) {
          existing.taskCount++;
        } else {
          acc.push({
            userId: task.assignee.id,
            userName: task.assignee.name,
            taskCount: 1,
          });
        }
      }
      return acc;
    }, [] as { userId: string; userName: string; taskCount: number }[]);

    const overview: ProjectOverview = {
      totalTasks,
      completedTasks,
      overdueTasks,
      completionPercentage,
      workloadDistribution,
    };

    res.json({
      success: true,
      message: 'Project overview retrieved successfully',
      data: overview,
    });
  } catch (error) {
    console.error('Get project overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
