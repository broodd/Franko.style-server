import { Router } from 'express';
import asyncWrapper from '../util/error-handler';
const category = Router();

import authGuard from '../middlewares/authGuard';
import checkRole from '../middlewares/checkRole';

/**
 * Controllers (route handlers)
 */
import * as categoryController from '../controllers/category';

category.get('/', asyncWrapper(categoryController.getCategories));

category.post(
  '/',
  authGuard,
  checkRole('createAny', 'category'),
  asyncWrapper(categoryController.postCategory)
);

category.put(
  '/:id',
  authGuard,
  checkRole('updateAny', 'category'),
  asyncWrapper(categoryController.putCategory)
);

category.delete(
  '/:id',
  authGuard,
  checkRole('deleteAny', 'category'),
  asyncWrapper(categoryController.deleteCategory)
);

export default category;
