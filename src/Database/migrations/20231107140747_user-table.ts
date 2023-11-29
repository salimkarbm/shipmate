import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.increments('id');
        table
            .uuid('userId')
            .primary()
            .defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('firstName', 50).notNullable();
        table.string('lastName', 50).notNullable();
        table.string('passwordDigest', 100).notNullable();
        table.string('email', 100).unique().notNullable();
        table.string('OTP');
        table.boolean('isEmailVerified').notNullable().defaultTo(false);
        table.boolean('isUserVerified').notNullable().defaultTo(false);
        table.string('otherName', 50);
        table.text('bio');
        table.text('address');
        table.string('userType', 50);
        table.boolean('isProfileComplete').notNullable().defaultTo(false);
        table.string('gender', 50);
        table.string('NIN', 50);
        table.string('phoneNumber', 20);
        table.string('profilePicture');
        table.string('profilePictureId');
        table.string('role', 20).notNullable().defaultTo('user');
        table.boolean('isActive').notNullable().defaultTo(true);
        table.bigInteger('otpExpiresAt');
        table.timestamps(true, true);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTableIfExists('users');
}
