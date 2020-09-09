const db = require('../database/connections');
const ValidateException = require('../controllers/ValidateException');

class UserRepository {
    
    async findAll() {
        try {
            return await db.table('users');
        } catch(e) {
            throw new ValidateException('Erro ao buscas usuários', 400);
        }
    }

    async findById(id) {
        const user = await db.table('users').where({ id });

        if(user.length === 0) {
            throw new ValidateException('Este usuário não existe', 400);
        }
        return user[0];
    }
    
    async findByEmail(email) { 
        try {
            const user = await db.table('users').where({ email });
            
            if(user.length == 0) {
                throw new ValidateException('E-mail inválido.', 400);
            }
            return user[0];

        } catch (e) {
            throw new ValidateException(e.message, e.status);
        }
    }

    async findByCode(code) {
        const user = await db.table('users').where({ code });

        if(user.length === 0) {
            throw new ValidateException('Código inválido.', 400);
        } 
        return user[0];
    }

    async create(user) {
        const { name, lastName, email, password } = user;
        try {
            await db.table('users').insert({
                name,
                last_name: lastName,
                email,
                password: password
            });
        } catch (e) {
            throw new ValidateException('Erro ao inserir realizar cadastro. Tente novamente mais tarde.', 400);
        }
    }

    async update(user, id) {
        try {
            const { name, lastName, email, code, avatar_url } = user;

            await db.table('users').update({
                name,
                email,
                code,
                avatar_url,
                last_name: lastName,
            })
            .where({
                id
            });

        } catch (e) {
            console.log(e);
            throw new ValidateException('Erro ao atualizar dados. Tente novamente mais tarde.', 400);
        }
    }

    async updatePassword(password, id) {
        try {
            await db.table('users').update({ password }).where({ id });
            await db.table('users').update({ code: null }).where({ id });
        } catch (e) {
            throw new ValidateException('Erro ao atualizar senha. Tente novamente mais tarde.', 400)
        }
    }

    async delete(id) {
        try {
            await db.table('users').delete().where({ id });
        } catch (e) {
            throw new ValidateException('Não foi possivel remover este usuário.', 400);
        }
    }
}

module.exports = UserRepository;