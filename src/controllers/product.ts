import { Request, Response } from 'express';
import { AppError } from '../util/error-handler';
import { Product } from '../models/Product';
import { User } from '../models/User';

/**
 * GET /products/:id
 * Get products.
 */
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;

  const product: Product = await Product.findByPk(id, {});

  return res.json({
    product,
  });
};

/**
 * GET /products
 * Get products.
 */
export const getProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * +limit;
  const user = res.locals.user;

  const likedProductsSQL = user
    ? [
        {
          model: User,
          as: 'lovedUsers',
          attributes: ['id'],
          through: {
            // attributes: [[fn('COUNT', col('lovedUsers')), 'loved']],
            attributes: [] as any,
            where: { userId: user.id },
          },
        },
      ]
    : undefined;

  const products = await Product.findAll({
    include: likedProductsSQL,
    order: [['createdAt', 'DESC']],
    offset,
    limit: +limit,
  });

  return res.json({
    products,
  });
};

/**
 * GET /products/loved
 * Get my loved products.
 */
export const getLovedProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * +limit;

  const user = res.locals.user;

  const products = await user.getLovedProducts({
    order: [['createdAt', 'DESC']],
    offset,
    limit: +limit,
  });

  return res.json({
    products,
  });
};

/**
 * POST /products
 * Create product.
 */
export const postProduct = async (req: Request, res: Response) => {
  const { name } = req.body;

  if (!name) {
    throw new AppError('Name is empty');
  }

  const product: Product = await Product.create({
    name,
  });

  return res.json({
    product,
  });
};

/**
 * PUT /products/:id
 * Update product.
 */
export const putProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;

  const product: Product = await Product.findByPk(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (name) {
    product.name = name;
  }

  await product.save();

  return res.json({
    product,
  });
};

/**
 * PUT /products/:id/loved
 * Add or remove from loved product.
 */
export const putLovedProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = res.locals.user;

  const product: Product = await Product.findByPk(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const action = await user.hasLovedProducts(product);

  if (action) {
    await user.removeLovedProducts(product);
  } else {
    await user.addLovedProducts(product);
  }

  return res.json({
    action: !action,
    product,
  });
};

/**
 * DELETE /products/:id
 * Delete product.
 */
export const deleteProduct = async (req: Request, res: Response) => {
  // const user = res.locals.user;
  const { id } = req.params;

  const product: Product = await Product.findByPk(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  await product.destroy();

  return res.json({
    product,
  });
};
