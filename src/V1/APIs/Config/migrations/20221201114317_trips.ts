import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('trips', (table) => {
        table.increments('id').primary();
        table.string('departure_date', 50).notNullable();
        table.string('departure_time', 50).notNullable();
        table.string('duration_of_trip_in_hours', 50).notNullable();
        table.string('duration_of_trip_in_mins', 20);
        table.string('departure_state', 20);
        table.string('departure_city', 20).notNullable();
        table.string('pickup_address', 150).notNullable();
        table.string('destination_state', 20).notNullable();
        table.string('destination_city', 20).notNullable();
        table.string('delivery_address', 150).notNullable();
        table.string('estimated_price').notNullable();
        table.integer('userId').unsigned();
        table
            .foreign('userId')
            .references('id')
            .inTable('users')
            .onDelete('CASCADE');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('trips');
}
