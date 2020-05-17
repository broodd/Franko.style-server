import { Request, Response, NextFunction } from 'express';
import { AppError } from '../util/error-handler';
import fs from 'fs';
import path from 'path';
import { Category } from '../models/Category';
import { getUploadedImage } from '../util/common';

/**
 * GET /categories
 * Get categories.
 */
export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  const categories = await Category.findAll({
    include: [
      {
        model: Category,
        as: 'children',
      },
    ],
  });
  // hierarchy: true,

  return res.json({
    categories,
  });
};

/**
 * POST /categories
 * Create categories.
 */
export const postCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { name, parentId } = req.body;

  if (!name) {
    throw new AppError('Name is empty');
  }
  let parent: Category;
  if (parentId) {
    parent = await Category.findByPk(+parentId);
  }

  const image = getUploadedImage(req);

  const category: Category = await Category.create({
    name,
    parentId: parent && parent.id ? parent.id : undefined,
    image,
  });

  return res.json({
    category,
  });
};

/**
 * PUT /categories/:id
 * Update category.
 */
export const putCategory = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { name, parentId } = req.body;

  const category: Category = await Category.findByPk(id);

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  if (name) {
    category.name = name;
  }
  if (parentId) {
    category.parentId = parentId;
  }

  const image = getUploadedImage(req);

  if (image) {
    if (category.image) {
      const filePath = path.join(__dirname, '../../static/images', category.image);
      fs.unlink(filePath, () => {});
    }

    category.image = image;
  }

  await category.save();

  return res.json({
    category,
  });
};

/**
 * DELETE /categories/:id
 * Delete category.
 */
export const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
  // const user = res.locals.user;
  const { id } = req.params;

  const category: Category = await Category.findByPk(id);

  if (!category) {
    throw new AppError('Book not found', 404);
  }

  if (category.image) {
    const filePath = path.join(__dirname, '../../static/images', category.image);
    fs.unlink(filePath, () => {});
  }

  await category.destroy();

  return res.json({
    category,
  });
};
