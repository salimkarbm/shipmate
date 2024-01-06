import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('trips', (table) => {
        table.increments('id');
        table
            .uuid('tripId')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('departureCity');
        table.string('departureLocation');
        table.string('destinationCity');
        table.string('destinationLocation');
        table.date('departureDate');
        table.string('estimatedTimeOfArrival');
        table.string('transportationMode');
        table.string('preferredItemType');
        table.string('acceptableLuggageSize');
        table.string('emergencyContactName');
        table.string('emergencyContactPhoneNumber');
        table.boolean('wePickupFromCustomerAddress').defaultTo(false);
        table
            .boolean('weDeliverToCustomerAddress')
            .notNullable()
            .defaultTo(false);
        table.string('arrivalPickupAddress');
        table.dateTime('acceptingDeliveryFrom');
        table.dateTime('acceptingDeliveryTo');
        table.boolean('isApproved').notNullable().defaultTo(true);
        table
            .uuid('userId')
            .references('users.userId')
            .notNullable()
            .onDelete('CASCADE');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('trips');
}
