import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('cars', (table) => {
        table.increments('id');
        table.uuid('carId').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('carRegistrationNumber');
        table.string('carPlateNumber');
        table.string('carModel');
        table.string('carColor');
        table.text('carRules');
        table.string('carBrand');
        table.string('carPhoto');
        table.string('carPhotoId');
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
    return knex.schema.dropTableIfExists('cars');
}
