import { Router } from 'express';
import asyncWrapper from '../util/error-handler';
const product = Router();

import authGuard from '../middlewares/authGuard';
import checkRole from '../middlewares/checkRole';

/**
 * Controllers (route handlers)
 */
import * as productController from '../controllers/product';

product.get('/loved', authGuard, asyncWrapper(productController.getLovedProducts));
product.get('/', asyncWrapper(productController.getProducts));
product.get('/:id', asyncWrapper(productController.getProduct));

product.post(
  '/',
  authGuard,
  checkRole('createAny', 'product'),
  asyncWrapper(productController.postProduct)
);

product.put(
  '/:id',
  authGuard,
  checkRole('updateAny', 'product'),
  asyncWrapper(productController.putProduct)
);
product.put('/:id/loved', authGuard, asyncWrapper(productController.putLovedProduct));

product.delete(
  '/:id',
  authGuard,
  checkRole('deleteAny', 'product'),
  asyncWrapper(productController.deleteProduct)
);

export default product;
