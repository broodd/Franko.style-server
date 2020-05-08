import { Router } from 'express';
import asyncWrapper from '../util/error-handler';
const sprint = Router();

import authGuard from '../middlewares/authGuard';
import checkRole from '../middlewares/checkRole';

/**
 * Controllers (route handlers)
 */
import * as sprintController from '../controllers/sprint';

sprint.get('/', asyncWrapper(sprintController.getSprints));

sprint.post(
  '/',
  authGuard,
  checkRole('createAny', 'sprints'),
  asyncWrapper(sprintController.postSprint)
);

sprint.put(
  '/:id',
  authGuard,
  checkRole('updateAny', 'sprints'),
  asyncWrapper(sprintController.putSprint)
);

sprint.delete(
  '/:id',
  authGuard,
  checkRole('deleteAny', 'sprints'),
  asyncWrapper(sprintController.deleteSprint)
);

export default sprint;
