import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('items', function (table) {
        table.increments('id');
        table
            .uuid('itemId')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table.text('description').notNullable();
        table.string('pickUpAddress').notNullable();
        table.string('dropOffAddress').notNullable();
        table.string('itemCategory').notNullable();
        table.string('ItemImage').notNullable();
        table.string('ItemImageId').notNullable();
        table.string('itemSize');
        table.string('specialHandlingInstructions');
        table.boolean('isDelivered').defaultTo(false);
        table.dateTime('deliveryDeadline').notNullable();
        table
            .uuid('userId')
            .unsigned()
            .notNullable()
            .references('userId')
            .inTable('users');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users').dropTableIfExists('items');
}
