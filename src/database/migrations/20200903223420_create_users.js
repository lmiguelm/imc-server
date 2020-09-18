
exports.up = async (knex) => {
    return knex.schema.createTable('users', users => {
        users.increments('id').primary();
        users.string('name').notNullable();
        users.string('last_name').notNullable();
        users.string('email').unique().notNullable();
        users.string('password').notNullable();
        users.string('avatar_url');
        users.string('key');
        users.integer('code').defaultTo(null).comment('Código informado quando usuário esquecer a senha');

        users.string('created_at').notNullable();
    });
  
};

exports.down = async knex => knex.schema.dropTable('users');

