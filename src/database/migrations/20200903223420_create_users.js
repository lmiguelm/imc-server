
exports.up = async (knex) => {
    return knex.schema.createTable('users', users => {
        users.increments('id').primary();
        users.string('name').notNullable();
        users.string('last_name').notNullable();
        users.string('email').unique().notNullable();
        users.string('password').notNullable();
        users.string('avatar_url');
        users.integer('code').defaultTo(null).comment('Código informado quando usuário esquecer a senha');

        users.timestamp('created_at').defaultTo(knex.fn.now());
    });
  
};

exports.down = async knex => knex.schema.dropTable('users');

