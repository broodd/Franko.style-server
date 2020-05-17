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
  checkRole('createAny', 'sprint'),
  asyncWrapper(sprintController.postSprint)
);

sprint.put(
  '/:id',
  authGuard,
  checkRole('updateAny', 'sprint'),
  asyncWrapper(sprintController.putSprint)
);

sprint.delete(
  '/:id',
  authGuard,
  checkRole('deleteAny', 'sprint'),
  asyncWrapper(sprintController.deleteSprint)
);

export default sprint;
