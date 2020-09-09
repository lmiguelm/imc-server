
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('historic_imcs').del()
    .then(function () {
      // Inserts seed entries
      return knex('historic_imcs').insert([
        { imc: 19.82 , height: 1.83, weight: 53, title: 'Muito abaixo do peso', color: '#ffa500', user_id: 1 },
        { imc: 20.9, height: 1.83, weight: 70, title: 'Normal', color: '#04d361', user_id: 1 },
        { imc: 29.25, height: 1.83, weight: 98, title: 'Acima do peso', color: '#9ACD32', user_id: 2 },
      ]);
    });
};
