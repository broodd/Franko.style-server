import { Request, Response, NextFunction } from 'express';
import { AppError } from '../util/error-handler';
// import fs from 'fs';
// import path from 'path';
import { Sprint } from '../models/Sprint';
import { getUploadedImage } from '../util/common';

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

  const image = getUploadedImage(req);

  if (!image) {
    throw new AppError('image_is_empty');
  }

  const sprint: Sprint = await Sprint.create({
    title,
    subtitle,
    link,
    order,
    image,
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
  const { id } = req.params;
  const { title, subtitle, link, order } = req.body;

  const sprint: Sprint = await Sprint.findByPk(id);

  if (!sprint) {
    throw new AppError('not_found', 404);
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

  const image = getUploadedImage(req);

  if (image) {
    sprint.image = image;
  }

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
    throw new AppError('not_found', 404);
  }

  await sprint.destroy();

  return res.json({
    sprint,
  });
};
