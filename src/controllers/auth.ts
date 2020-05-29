import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { isEmail, isLength } from 'validator';
import bcrypt from 'bcrypt-nodejs';
import { createJWToken } from '../util/auth';
import { AppError } from '../util/error-handler';

/**
 * POST /login
 * Sign in using email and password.
 */
export const postLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const errors = {} as any;

  if (!email || !isEmail(email)) {
    errors.email = 'email_not_valid';
  }
  if (!password || !isLength(password, { min: 5 })) {
    errors.password = 'password_to_short';
  }

  if (Object.keys(errors).length) {
    throw new AppError(errors, 400);
  }

  const user: User = await User.findOne({
    where: {
      email,
    },
    attributes: {
      include: ['password'],
    },
  });

  if (!user) {
    throw new AppError('user_not_found', 404);
  }

  const passwordCheck = bcrypt.compareSync(password, user.password);

  if (passwordCheck) {
    const token = createJWToken({
      userId: user.id,
      email: user.email,
    });

    return res.status(200).send({
      token: `Bearer ${token}`,
      user,
    });
  } else {
    throw new AppError('user_not_found', 404);
  }
};

/**
 * POST /signup
 * Create a new account.
 */
export const postSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { phone, email, password } = req.body;
  const errors = {} as any;

  if (!email) {
    errors.email = 'email_not_valid';
  }
  if (!password || !isLength(password, { min: 5 })) {
    errors.password = 'password_to_short';
  }

  if (Object.keys(errors).length) {
    throw new AppError(errors, 400);
  }

  const existingUser: User = await User.findOne({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new AppError({ email: 'user_with_that_email_already_exists' }, 403);
  }

  const user: User = await User.create({
    phone,
    email,
    password,
    role: 'ADMIN', // temp
  });

  const token = createJWToken({
    userId: user.id,
    email: user.email,
  });

  return res.json({
    token: `Bearer ${token}`,
    user,
  });
};
