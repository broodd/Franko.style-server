import { Router } from 'express';
import asyncWrapper from '../util/error-handler';
const user = Router();

import authGuard from '../middlewares/authGuard';
import checkRole from '../middlewares/checkRole';

/**
 * Controllers (route handlers)
 */
import * as userController from '../controllers/user';

user.get('/:id', authGuard, asyncWrapper(userController.getUserInfo));
user.get('/', authGuard, checkRole('readAny', 'user'), asyncWrapper(userController.getUsers));

export default user;
