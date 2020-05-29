import { Request, Response, NextFunction } from 'express';
import { AppError } from '../util/error-handler';

import roles from '../roles';

export default (action: string, resource: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const permission = roles.can(res.locals.user.role || 'CLIENT')[action](resource);
      if (!permission.granted) {
        return next(new AppError(`you_not_have_enough_permission`, 403));
      }
      return next();
    } catch (err) {
      return next(err);
    }
  };
};
