import knex from 'knex';
import knexfile from '../knexfile';
import { Model } from 'objection';

const { NODE_ENV } = process.env;

const Dev = () => {
    const db = knex(knexfile.development);
    Model.knex(db);
};
const Prod = () => {
    const db = knex(knexfile.production);
    Model.knex(db);
};

const setupDb = () => {
    return NODE_ENV === 'production' ? Prod() : Dev();
};

export default setupDb;
