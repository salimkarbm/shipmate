import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('trips', (table) => {
        table.increments('id');
        table
            .uuid('tripId')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('departureCity');
        table.string('arrivalCity');
        table.string('departureDate');
        table.string('departureLocation');
        table.string('destinationLocation');
        table.string('estimatedDurationOfTrip');
        table.string('arrivalDate');
        table.string('travelMode');
        table.string('preferredItemType');
        table.string('acceptableLuggageSize');
        table.string('emergencyContactName');
        table.string('emergencyContactPhoneNumber');
        table.string('insuranceCoverage');
        table.string('isPickupFromCustomerAddress');
        table
            .boolean('isdeliverToCustomerAddress')
            .notNullable()
            .defaultTo(false);
        table.string('arrivalPickupAddress');
        table.boolean('itemPickupAddress').notNullable().defaultTo(false);
        table.boolean('isApproved').notNullable().defaultTo(true);
        table.text('specialHandlingRequirements');
        table.uuid('userId').references('users.userId').notNullable();
        table.string('acceptableDeliveryDeadline');
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(null);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users').dropTable('trips');
}
