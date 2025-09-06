import { Router } from 'express';
import authRoutes from './auth';
import projectRoutes from './projects';
import taskRoutes from './tasks';
import messageRoutes from './messages';
import notificationRoutes from './notifications';

const router = Router();

// API routes
router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/tasks', taskRoutes);
router.use('/messages', messageRoutes);
router.use('/notifications', notificationRoutes);

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'SynergySphere API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
