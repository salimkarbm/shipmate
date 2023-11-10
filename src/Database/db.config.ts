import knex from 'knex';
import { Model } from 'objection';
import knexfile from './knexfile';

const { NODE_ENV } = process.env;

const Dev = () => {
    const db = knex(knexfile.development);
    Model.knex(db);
};
const Prod = () => {
    const db = knex(knexfile.production);
    Model.knex(db);
};

const DBsetup = () => {
    return NODE_ENV === 'production' ? Prod() : Dev();
};

export default DBsetup;
