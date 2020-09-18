const db = require('../database/connections');

const ValidationException = require('../controllers/ValidateException');
const utilDate = require('../utils/date');

class ImcRepository {
    
    async findAll() {  
        const imcs = await db.table('historic_imcs');
        if(imcs.length === 0) {
            throw new ValidationException('Nenhum Imc encontrado', 400);
        }
        return imcs;
    }

    async findByUser(id) {
        const imcs = await db.table('historic_imcs').where({ user_id: id });

        if(imcs.length === 0) {
            throw new ValidationException('Nenhum Imc encontrado.', 400);
        }
        return imcs;
    }

    async findByFilter(id, date, imc) {
        const imcs = await db.table('historic_imcs')
            .where('title', 'like', `%${imc}%`)
            .andWhere('created_at', '=', date)
            .andWhere('user_id', '=', id);
        return imcs;
    }

    async findById(id) {
        const imc = await db.table('historic_imcs').where({ id });
        return imc[0];
    }

    async create(imc) {

        imc.created_at = utilDate.formatDate(new Date());

        try {
            await db.table('historic_imcs').insert( imc );
             
        } catch (e) {
            console.log(e);
            throw new ValidationException('Erro ao inserir Imc. Tente novamente mais tarde.', 400);
        }
    }

    async update(imc, id) {
        try {
            await db.table('historic_imcs').update( imc ).where({ id });
        } catch (e) {
            throw new ValidationException('Erro ao atualizar Imc', 400);
        }
    }

    async delete(id) {
        try {
            await db.table('historic_imcs').delete().where({ id })
        } catch (e) {
            throw new ValidationException('Não foi possível deletar este Imc', 400);
        }
    }
}

module.exports = ImcRepository;