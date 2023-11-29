import knex from 'knex';
import type { Knex } from 'knex';
import { Model } from 'objection';
import config from './knexfile';

const { NODE_ENV } = process.env;
let db: any;
const Dev = (): Promise<{ [key: string]: Knex.Config }> => {
    db = knex(config.development);
    Model.knex(db);
    return db as any;
};
const Prod = (): Knex<{ [key: string]: Knex.Config }> => {
    db = knex(config.production);
    Model.knex(db);
    return db as any;
};

const dbSetup = () => {
    return NODE_ENV === 'production' ? Prod() : Dev();
};

const onDatabaseConnect = async () => db.raw('SELECT 1');

export default {
    dbSetup,
    onDatabaseConnect
};
