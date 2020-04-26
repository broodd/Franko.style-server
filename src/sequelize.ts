import { Sequelize } from 'sequelize-typescript';
import { DB_NAME, DB_USER, DB_PASS, DB_HOST } from './util/secrets';

// export default new Sequelize(DB_NAME, DB_USER, DB_PASS, {
//   dialect: 'mysql'
//   // storage: ':memory:',
//   // models: [__dirname + '/models']
// });

export const sequelize = new Sequelize({
  dialect: 'mysql',
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASS,
  host: DB_HOST,
  // storage: ':memory:',
  models: [__dirname + '/models'],
  // logging: false,
});
