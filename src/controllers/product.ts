import { Sequelize } from 'sequelize-typescript';
import { Request, Response } from 'express';
import { AppError } from '../util/error-handler';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { CartProduct } from '../models/CartProduct';
import { getUploadedImages } from '../util/common';
import path from 'path';
import fs from 'fs';

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
  const products = await CartProduct.findAll({
    include: [Product],
    order: [['createdAt', 'DESC']],
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
    price: +price,
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
  const { name, price, sizes, categories, images } = req.body;

  const product: Product = await Product.findByPk(id);

  if (!product) {
    throw new AppError('Product not found', 404);
  }

  if (name) {
    product.name = name;
  }

  if (price) {
    product.price = +price;
  }

  if (sizes) {
    product.sizes = sizes;
  }

  if (categories && categories.length) {
    product.$set('categories', categories);
  }

  const uploadImages = getUploadedImages(req);

  if (uploadImages || images === 'false') {
    const productImages = product.images as string[];
    if (productImages && productImages.length) {
      productImages.map((img) => {
        const imageName = img.slice(img.lastIndexOf('images/') + 7);
        const filePath = path.join(__dirname, '../../static/images', imageName);
        fs.unlink(filePath, () => {});
      });
    }
    product.images = [];
  }
  if (uploadImages) {
    product.images = uploadImages;
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
 * POST /products/:id/cart
 * Add to cart product.
 */
export const postCartProduct = async (req: Request, res: Response) => {
  const user = res.locals.user;
  const id = req.params.id;
  let size = req.body.size || 'UNIVERSAL';
  size = size.toUpperCase();
  let cartProduct;

  const product: Product = await Product.findByPk(id);

  if (!product) {
    throw new AppError('product_not_found', 404);
  }

  if (!Object.keys(product.sizes).includes(size)) {
    throw new AppError('product_not_have_this_size', 403);
  }

  cartProduct = await CartProduct.findOne({
    where: {
      productId: product.id,
      userId: user.id,
      selectedSize: size,
    },
  });

  if (cartProduct) {
    throw new AppError('product_already_in_cart', 403);
  }

  const totalCartProducts = await CartProduct.count({
    where: {
      userId: user.id,
    },
  });

  if (totalCartProducts >= 10) {
    throw new AppError('max_cart_size', 403);
  }

  cartProduct = await CartProduct.create({
    productId: product.id,
    userId: user.id,
    selectedSize: size,
  });

  cartProduct.product = product;

  return res.json({
    cartProduct,
    product,
  });
};

/**
 * PUT products/cart/:id/count
 * Update count in cart product.
 */
export const putCartProductCount = async (req: Request, res: Response) => {
  const id = req.params.id;
  const count = +req.body.count;

  const cartProduct = await CartProduct.findByPk(id, {
    include: [Product],
  });

  if (!cartProduct) {
    throw new AppError('product_not_found', 404);
  }

  if (count && count >= 1) {
    const sizes: any = cartProduct.product.sizes;
    const selectedSize: string = cartProduct.selectedSize;
    const maxCount: number = sizes[selectedSize];

    if (maxCount >= count)
      cartProduct.update({
        count,
      });
    else throw new AppError('not_have_more_product_with_this_size', 404);
  } else {
    throw new AppError('not_valid', 403);
  }

  return res.json({
    // cartProduct,
    count,
  });
};

/**
 * DELETE /products/cart/:id
 * Delete from cart product.
 */
export const deleteCartProduct = async (req: Request, res: Response) => {
  const id = req.params.id;

  const cartProduct = await CartProduct.findByPk(id);

  if (!cartProduct) {
    throw new AppError('product_not_found', 404);
  }

  cartProduct.destroy();

  return res.json({
    cartProduct,
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
