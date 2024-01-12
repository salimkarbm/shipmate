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
        table.string('itemImage').notNullable();
        table.string('itemImageId').notNullable();
        table.json('itemDimension');
        table.string('itemSize');
        table.string('specialHandlingInstructions');
        table.boolean('hasInsuranceCoverage').defaultTo(false);
        table.dateTime('deliveryDeadline').notNullable();
        table
            .enu('itemStatus', [
                'pending',
                'inProgress',
                'completed',
                'cancelled',
                'delivered'
            ])
            .defaultTo('pending');
        table
            .uuid('userId')
            .references('users.userId')
            .notNullable()
            .onDelete('CASCADE');
        table
            .uuid('tripId')
            .references('trips.tripId')
            .notNullable()
            .onDelete('CASCADE');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('items');
}
