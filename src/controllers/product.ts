import { Request, Response } from 'express';
import { AppError } from '../util/error-handler';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Sequelize } from 'sequelize-typescript';
import { Category } from '../models/Category';
import { getUploadedImages } from '../util/common';

/**
 * GET /products/:id
 * Get products.
 */
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = res.locals.user;

  const likedProductsSQL = user
    ? [
        {
          model: User,
          as: 'lovedUsers',
          attributes: ['id'],
          through: {
            attributes: [] as any,
            where: { userId: user.id },
          },
        },
        {
          model: User,
          as: 'cartUsers',
          attributes: ['id'],
          through: {
            attributes: [] as any,
            where: { userId: user.id },
          },
        },
      ]
    : undefined;

  const product: Product = await Product.findByPk(id, {
    include: likedProductsSQL,
  });

  return res.json({
    product,
  });
};

/**
 * GET /products
 * Get products.
 */
export const getProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 6 } = req.query;
  const offset = (page - 1) * +limit;
  const user = res.locals.user;

  const likedProductsSQL = user
    ? [
        {
          model: User,
          as: 'lovedUsers',
          attributes: ['id'],
          through: {
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
 * GET /products/category/:id
 * Get porducts by category.
 */
export const getProductsByCategory = async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const { id } = req.params;
  const offset = (page - 1) * +limit;

  const products = await Product.findAll({
    include: [
      {
        attributes: [],
        model: Category,
        through: {
          attributes: [],
          where: {
            categoryId: +id,
          },
        },
        required: true,
      },
    ],
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
  const { page = 1, limit = 6 } = req.query;
  const offset = req.query.offset ? +req.query.offset : (page - 1) * +limit;

  const user = res.locals.user;

  const products = await user.getLovedProducts({
    order: [[Sequelize.literal('LovedProduct.createdAt'), 'DESC']],
    offset,
    limit: +limit,
  });

  return res.json({
    products,
  });
};

/**
 * GET /products/cart
 * Get my cart products.
 */
export const getCartProducts = async (req: Request, res: Response) => {
  const { page = 1, limit = 6 } = req.query;
  const offset = (page - 1) * +limit;

  const user = res.locals.user;

  const products = await user.getCartProducts({
    order: [['createdAt', 'DESC']],
    offset,
    limit: +limit,
  });

  const total = await user.getCartProducts({
    attributes: [[Sequelize.fn('sum', Sequelize.col('price')), 'total']],
  });

  return res.json({
    total,
    products,
  });
};

/**
 * POST /products
 * Create product.
 */
export const postProduct = async (req: Request, res: Response) => {
  const { name, price, categories, sizes } = req.body;

  if (!name) {
    throw new AppError('Name is empty');
  }

  if (!price) {
    throw new AppError('Price is empty');
  }

  const images = getUploadedImages(req);

  const product: Product = await Product.create({
    name,
    price,
    sizes,
    images,
  });

  if (categories && categories.length) {
    product.$add('categories', categories);
  }

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
  const { name, price, sizes, categories } = req.body;

  const product: Product = await Product.findByPk(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (name) {
    product.name = name;
  }

  if (price) {
    product.price = price;
  }

  if (sizes) {
    product.sizes = sizes;
  }

  if (categories && categories.length) {
    product.$set('categories', categories);
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
 * PUT /products/:id/cart
 * Add or remove from cart product.
 */
export const putCartProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = res.locals.user;

  const product: Product = await Product.findByPk(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  const action = await user.hasCartProducts(product);

  if (action) {
    await user.removeCartProducts(product);
  } else {
    await user.addCartProducts(product);
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
