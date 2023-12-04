import dotenv from 'dotenv';
import type { Knex } from 'knex';
import appPath from 'app-root-path';

// Update with your config settings.
import { knexSnakeCaseMappers } from 'objection';

dotenv.config({ path: `${appPath}/.env` });

const { POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, PROD_DB_URL } = process.env;

export interface KnexPostgreSQLConfig {
    client: 'postgresql';
    connection: {
        port: number;
        user: string;
        password: string;
        database: string;
    };
}
const config: { [key: string]: Knex.Config } = {
    development: {
        client: 'postgresql',
        connection: {
            database: `${POSTGRES_DB}`,
            user: `${POSTGRES_USER}`,
            password: `${POSTGRES_PASSWORD}`
        },
        useNullAsDefault: true,
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations',
            directory: `${appPath.path}/src/Database/migrations`
        },
        seeds: {
            directory: `${appPath.path}/src/Database/seeds`
        },
        ...knexSnakeCaseMappers
    },
    production: {
        client: 'postgresql',
        connection: `${PROD_DB_URL}`,
        pool: {
            min: 2,
            max: 10
        },
        useNullAsDefault: true,
        migrations: {
            tableName: 'knex_migrations',
            directory: `${appPath.path}/src/Database/migrations`
        },
        seeds: {
            directory: `${appPath.path}/src/Database/seeds`
        },
        ...knexSnakeCaseMappers
    }
};

export default config;

// const environment = process.env.NODE_ENV || 'development';
// const knexConfig: Knex.Config = config[environment];

// if (!knexConfig.client) {
//   throw new Error("Knex configuration error: 'client' option is missing.");
// }

// const knexInstance = Knex(knexConfig);

// export default knexInstance;
