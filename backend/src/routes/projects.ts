import { Router } from 'express';
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  inviteMember,
  removeMember,
  deleteProject,
  getProjectOverview,
} from '../controllers/projectController';
import { authenticateToken } from '../middleware/auth';
import { validate, validateParams } from '../middleware/validation';
import {
  createProjectSchema,
  updateProjectSchema,
  inviteMemberSchema,
  idSchema,
} from '../utils/validation';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

// Project CRUD
router.post('/', validate(createProjectSchema), createProject);
router.get('/', getProjects);
router.get('/:id', validateParams(idSchema), getProject);
router.put('/:id', validateParams(idSchema), validate(updateProjectSchema), updateProject);
router.delete('/:id', validateParams(idSchema), deleteProject);

// Project members
router.post('/:id/invite', validateParams(idSchema), validate(inviteMemberSchema), inviteMember);
router.delete('/:id/members/:userId', validateParams(idSchema), removeMember);

// Project analytics
router.get('/:id/overview', validateParams(idSchema), getProjectOverview);

export default router;
