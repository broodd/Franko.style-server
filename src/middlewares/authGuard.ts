import { Request, Response, NextFunction } from 'express';
import { AppError } from '../util/error-handler';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (res.locals.user && res.locals.user.id) return next();
    else next(new AppError('you_are_not_authorized', 401));
  } catch (err) {
    return next(err);
  }
};
