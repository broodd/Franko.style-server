import { Request, Response, NextFunction } from 'express';
import { AppError } from '../util/error-handler';
import fs from 'fs';
import path from 'path';
import { Sprint } from '../models/Sprint';

/**
 * GET /sprints
 * Get sprints.
 */
export const getSprints = async (req: Request, res: Response, next: NextFunction) => {
  const sprints = await Sprint.findAll({
    order: [
      ['order', 'DESC'],
      ['createdAt', 'DESC'],
    ],
  });

  return res.json({
    sprints,
  });
};

/**
 * POST /sprints
 * Create sprint.
 */
export const postSprint = async (req: Request, res: Response, next: NextFunction) => {
  const { title, subtitle, link, order } = req.body;
  // const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  // const image = files['image'] && files['image'][0] ? files['image'][0].filename : undefined;

  if (!title) {
    throw new AppError('Title is empty');
  }
  if (!subtitle) {
    throw new AppError('Subtitle is empty');
  }
  // if (!image) {
  //   throw new AppError('Image is empty');
  // }

  const sprint: Sprint = await Sprint.create({
    title,
    subtitle,
    link,
    order,
    // image,
  });

  return res.json({
    sprint,
  });
};

/**
 * PUT /sprints/:id
 * Update sprint.
 */
export const putSprint = async (req: Request, res: Response, next: NextFunction) => {
  // const user = res.locals.user;
  const { id } = req.params;
  const { title, subtitle, link, order } = req.body;
  // const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  // const image = files['image'] && files['image'][0] ? files['image'][0].filename : undefined;

  const sprint: Sprint = await Sprint.findByPk(id);

  if (!sprint) {
    throw new AppError('Sprint not found', 404);
  }

  if (title) {
    sprint.title = title;
  }
  if (subtitle) {
    sprint.subtitle = subtitle;
  }
  if (link) {
    sprint.link = link;
  }
  if (order != undefined) {
    sprint.order = order;
  }
  // if (image) {
  //   if (category.image) {
  //     const filePath = path.join(__dirname, '../../static/images', category.image);
  //     fs.unlink(filePath, () => {});
  //   }

  //   category.image = image;
  // }

  await sprint.save();

  return res.json({
    sprint,
  });
};

/**
 * DELETE /categories/:id
 * Delete category.
 */
export const deleteSprint = async (req: Request, res: Response, next: NextFunction) => {
  // const user = res.locals.user;
  const { id } = req.params;

  const sprint: Sprint = await Sprint.findByPk(id);

  if (!sprint) {
    throw new AppError('Sprint not found', 404);
  }

  // if (category.image) {
  //   const filePath = path.join(__dirname, '../../static/images', category.image);
  //   fs.unlink(filePath, () => {});
  // }

  await sprint.destroy();

  return res.json({
    sprint,
  });
};
