import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema
        .createTable('wallets', (table) => {
            table.increments('id');
            table
                .uuid('walletId')
                .primary()
                .defaultTo(knex.raw('uuid_generate_v4()'));
            table.bigInteger('balance').defaultTo(0.0);
            table.string('currency');
            table.string('bankAccountNumber');
            table
                .enum('status', ['Active', 'Inactive'])
                .notNullable()
                .defaultTo('Active');
            table
                .uuid('userId')
                .references('users.userId')
                .notNullable()
                .onDelete('CASCADE');
            table.timestamp('createdAt').defaultTo(knex.fn.now());
            table.timestamp('updatedAt').defaultTo(null);
        })
        .createTable('transactions', (table) => {
            table.increments('id');
            table
                .uuid('transactionId')
                .primary()
                .defaultTo(knex.raw('uuid_generate_v4()'));
            table.bigInteger('amount');
            table.enum('transactionType', ['Credit', 'Debit']);
            table.text('description');
            table.string('transactionReference');
            table.bigInteger('transactionFee');
            table.enum('transactionStatus', ['Complete', 'Pending']);
            table.enum('transactionMethod', ['card', 'bank transfer']);
            table
                .uuid('walletId')
                .references('wallets.walletId')
                .notNullable()
                .onDelete('CASCADE');
            table.timestamp('transactionDate').defaultTo(knex.fn.now());
        });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema
        .dropTableIfExists('transactions')
        .dropTableIfExists('wallets');
}
