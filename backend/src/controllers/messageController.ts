import { Request, Response } from 'express';
import { prisma } from '../utils/database';
import { CreateMessageRequest, MessageWithAuthor, ApiResponse, AuthenticatedRequest } from '../types';

export const createMessage = async (req: AuthenticatedRequest<{ id: string }, ApiResponse, CreateMessageRequest>, res: Response) => {
  try {
    const { id: projectId } = req.params;
    const { content } = req.body;
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

    const message = await prisma.message.create({
      data: {
        content,
        projectId,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Create notification for all other project members
    const projectMembers = await prisma.membership.findMany({
      where: {
        projectId,
        userId: {
          not: userId,
        },
      },
    });

    const notifications = projectMembers.map(member => ({
      type: 'MESSAGE_POSTED' as const,
      message: `New message in project: "${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"`,
      userId: member.userId,
      projectId,
    }));

    await prisma.notification.createMany({
      data: notifications,
    });

    res.status(201).json({
      success: true,
      message: 'Message created successfully',
      data: message,
    });
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getMessages = async (req: AuthenticatedRequest<{ id: string }>, res: Response) => {
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

    const messages = await prisma.message.findMany({
      where: { projectId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    res.json({
      success: true,
      message: 'Messages retrieved successfully',
      data: messages,
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};
