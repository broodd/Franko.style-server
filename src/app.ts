import express, { Request, Response, NextFunction } from 'express';
import { sequelize } from './sequelize';
import compression from 'compression';
import bodyParser from 'body-parser';
import logger from './util/logger';
import { ENVIRONMENT } from './util/secrets';
import lusca from 'lusca';
import path from 'path';
// import { User } from './models/User';

/**
 * Create Express server
 */
const app = express();

/**
 * Connect to DB
 */
sequelize
  // .sync({ force: ENVIRONMENT !== 'production' && true })
  .sync()
  .catch((err: Error) => {
    logger.error(
      `Error occurred during an attempt to establish connection with the database: %O`,
      err
    );
    console.log('DB connection error. Please make sure DB is running. ' + err);
    process.exit();
  });

/**
 * Express configuration
 */
app.set('port', process.env.PORT || 3000);
app.use(compression());
// app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use('/static', express.static(path.join(__dirname, '../static')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/**
 * JWT token Headers
 */
import token from './middlewares/token';
app.use(token);

/**
 * Uploading files
 */
import multer from './middlewares/upload';
app.use(multer);

/**
 * Passport slack auth
 */
// import passport from './middlewares/password';
// app.use(passport.initialize());

/**
 * Routes
 */
import auth from './routes/auth';
import user from './routes/user';
import product from './routes/product';
import category from './routes/category';
import sprint from './routes/sprint';

app.use('/auth', auth);
app.use('/users', user);
app.use('/products', product);
app.use('/categories', category);
app.use('/sprints', sprint);

/**
 * Error handler
 */
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.statusCode || 500;
  const error = typeof err === 'object' ? err.message : err;

  logger.error(`[${status}]: `, error);
  res.status(status).json({
    success: false,
    error,
  });
});

export default app;
