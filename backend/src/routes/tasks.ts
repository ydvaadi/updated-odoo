import { Router } from 'express';
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController';
import { authenticateToken } from '../middleware/auth';
import { validate, validateParams } from '../middleware/validation';
import {
  createTaskSchema,
  updateTaskSchema,
  idSchema,
} from '../utils/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Task CRUD
router.post('/projects/:id/tasks', validateParams(idSchema), validate(createTaskSchema), createTask);
router.get('/projects/:id/tasks', validateParams(idSchema), getTasks);
router.get('/:id', validateParams(idSchema), getTask);
router.put('/:id', validateParams(idSchema), validate(updateTaskSchema), updateTask);
router.delete('/:id', validateParams(idSchema), deleteTask);

export default router;
