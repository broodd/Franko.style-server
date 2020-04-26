import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { AppError } from '../util/error-handler';

/**
 * GET /user/:id
 * Get user info.
 */
export const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const user: User = await User.findByPk(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return res.json({
    data: user,
  });
};

/**
 * GET /users
 * Get user info.
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  const users: User[] = await User.findAll({
    order: [['createdAt', 'DESC']],
  });

  return res.json({
    data: users,
  });
};
