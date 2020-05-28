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
product.get('/cart', authGuard, asyncWrapper(productController.getCartProducts));
product.get('/category/:id', authGuard, asyncWrapper(productController.getProductsByCategory));
product.get('/', asyncWrapper(productController.getProducts));
product.get('/:id', asyncWrapper(productController.getProduct));

product.post(
  '/',
  authGuard,
  checkRole('createAny', 'product'),
  asyncWrapper(productController.postProduct)
);
product.post('/:id/cart', authGuard, asyncWrapper(productController.postCartProduct));

product.put(
  '/:id',
  authGuard,
  checkRole('updateAny', 'product'),
  asyncWrapper(productController.putProduct)
);
product.put('/:id/loved', authGuard, asyncWrapper(productController.putLovedProduct));
product.put('/cart/:id/count', authGuard, asyncWrapper(productController.putCartProductCount));

product.delete(
  '/:id',
  authGuard,
  checkRole('deleteAny', 'product'),
  asyncWrapper(productController.deleteProduct)
);
product.delete('/cart/:id', authGuard, asyncWrapper(productController.deleteCartProduct));

export default product;
