import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('deliveries', (table) => {
        table.increments('id').primary();
        table.string('reciever_number', 50).notNullable();
        table.string('item', 50).notNullable();
        table.string('destination', 100).notNullable();
        table.string('sender_number', 20);
        table.string('reciever_name', 20);
        table.string('sender_name').notNullable().defaultTo('false');
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
    return knex.schema.dropTableIfExists('deliveries');
}
