import { Sequelize } from 'sequelize-typescript';
import { DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT } from './util/secrets';

// import sequelizeHierarchy from 'sequelize-hierarchy';

// export default new Sequelize(DB_NAME, DB_USER, DB_PASS, {
//   dialect: 'mysql'
//   // storage: ':memory:',
//   // models: [__dirname + '/models']
// });

// sequelizeHierarchy(Sequelize);

export const sequelize = new Sequelize({
  dialect: 'postgres',
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASS,
  host: DB_HOST,
  port: parseInt(DB_PORT),
  // storage: ':memory:',
  models: [__dirname + '/models'],
  // logging: false,
});
