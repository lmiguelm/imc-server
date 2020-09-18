
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {email: 'luismiguelfernandes.marcelo@gmail.com', name: 'Luis Miguel', last_name: 'Marcelo', password: '12345', created_at: '13/09/2020'},
        {email: 'celina.benite18@gmail.com', name: 'Celina', last_name: 'Benite', password: '12345', created_at: '13/09/2020'}
      ]);
    });
};
