import { Router } from 'express';
import {
  createMessage,
  getMessages,
} from '../controllers/messageController';
import { authenticateToken } from '../middleware/auth';
import { validate, validateParams } from '../middleware/validation';
import {
  createMessageSchema,
  idSchema,
} from '../utils/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Message CRUD
router.post('/projects/:id/messages', validateParams(idSchema), validate(createMessageSchema), createMessage);
router.get('/projects/:id/messages', validateParams(idSchema), getMessages);

export default router;
