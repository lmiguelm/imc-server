
exports.up = async knex => {
    return knex.schema.createTable('historic_imcs', table => {
        table.increments('id').primary();
        table.decimal('imc').notNullable();
        table.decimal('height').notNullable();
        table.decimal('weight').notNullable();
        table.string('color').notNullable();
        table.string('title').notNullable();

        table.timestamp('created_at').defaultTo(knex.fn.now());

        table.integer('user_id').unsigned().notNullable()
            .references('id').inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');

      
    });
}

exports.down = async knex => knex.schema.dropTable('historic_imcs');
