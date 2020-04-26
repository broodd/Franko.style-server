import { Router } from 'express';
import asyncWrapper from '../util/error-handler';
const auth = Router();

/**
 * Controllers (route handlers)
 */
import * as authController from '../controllers/auth';

auth.post('/login', asyncWrapper(authController.postLogin));
auth.post('/signup', asyncWrapper(authController.postSignup));

export default auth;
