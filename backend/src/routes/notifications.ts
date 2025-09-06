import { Router } from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
} from '../controllers/notificationController';
import { authenticateToken } from '../middleware/auth';
import { validateParams, validateQuery } from '../middleware/validation';
import {
  idSchema,
  paginationSchema,
} from '../utils/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Notification routes
router.get('/', validateQuery(paginationSchema), getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', validateParams(idSchema), markAsRead);
router.put('/mark-all-read', markAllAsRead);

export default router;
