import dotenv from 'dotenv';
import type { Knex } from 'knex';
import appPath from 'app-root-path';

dotenv.config({ path: `${appPath}/.env` });

// Update with your config settings.
import { knexSnakeCaseMappers } from 'objection';

dotenv.config({ path: '.env' });

const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, DBURL } = process.env;
const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'postgresql',
    connection: {
      database: `${POSTGRES_DB}`,
      user: `${POSTGRES_USER}`,
      password: `${POSTGRES_PASSWORD}`
    },

    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${appPath}/src/Database/migrations`
    },
    seeds: {
      directory: `${appPath}/src/Database/seeds`
    },
    ...knexSnakeCaseMappers
  },
  production: {
    client: 'postgresql',
    connection: `${DBURL}`,
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: `${appPath}/src/Database/migrations`
    },
    seeds: {
      directory: `${appPath}/src/Database/seeds`
    },
    ...knexSnakeCaseMappers
  }
};

export default config;
