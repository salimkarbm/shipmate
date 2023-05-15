import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', (table) => {
        table.string('user_type', 50).notNullable();
        table.boolean('is_active').notNullable().defaultTo('True');
        table
            .specificType('long_lat', 'POINT')
            .defaultTo(knex.raw('POINT (37.3875, -122.0575)'));
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('users', (table) => {
        table.string('user_type').nullable().alter();
        table.boolean('is_active').nullable().alter();
        table.specificType('long_lat', 'POINT').nullable().alter();
    });
}
