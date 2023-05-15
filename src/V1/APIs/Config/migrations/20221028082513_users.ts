import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id').primary();
        table.string('first_name', 50).notNullable();
        table.string('last_name', 50).notNullable();
        table.string('password_digest', 100).notNullable();
        table.bigInteger('phone_number').notNullable();
        table.string('email', 100).unique().notNullable();
        table.integer('verification_code', 10);
        table.boolean('is_verified').notNullable().defaultTo('false');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTableIfExists('users')
        .dropTableIfExists('deliveries')
        .dropTableIfExists('trips');
}
