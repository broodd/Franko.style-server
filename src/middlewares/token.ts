import { Request, Response, NextFunction } from 'express';
import { verifyJWTToken } from '../util/auth';
import { User } from '../models/User';

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string = req.headers['authorization'];

    if (token) {
      if (token.includes('Bearer ')) {
        token = token.split(' ')[1];
      }

      const decoded: any = await verifyJWTToken(token);
      const user: User = await User.findByPk(decoded.userId);

      res.locals.user = user;
    }
    return next();
  } catch (err) {
    return next();
  }
};
