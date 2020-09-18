const db = require('../database/connections');
const ValidateException = require('../controllers/ValidateException');

const utilDate = require('../utils/date');

const aws = require('aws-sdk');
const s3 = new aws.S3();

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
            return user[0];

        } catch (e) {
            console.log(e)
            throw new ValidateException('Erro ao verificar e-mail', 400);
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
        try {
            user.created_at = utilDate.formatDate(new Date());
            await db.table('users').insert( user );
        } catch (e) {
            console.log(e);
            throw new ValidateException('Erro ao inserir realizar cadastro. Tente novamente mais tarde.', 400);
        }
    }

    async update(user, id) {
        try {
            await db.table('users').update( user )
            .where({
                id
            });

        } catch (e) {
            console.log(e);
            throw new ValidateException('Erro ao atualizar dados. Tente novamente mais tarde.', 400);
        }
    }

    async updateAvatar(img, key_img, id) {
        try {
            const { key } = await this.findById(id);
            
            await this.update({avatar_url: img, key: key_img}, id);

            if(key != 'sem_foto.png') {
                if(process.env.STORAGE_TYPE == 's3') {
                    return s3.deleteObject({
                        Bucket: process.env.BUCKET_NAME,
                        Key: key
                    })
                    .promise()
                    .then(response => {
                        console.log('certo');
                        console.log(response.status)
                    })
                    .catch(response => {
                        console.log('erro');
                        console.log(response.status)
                    });
                }
            }
        } catch(e) {
            console.log(e);
            throw new ValidateException('Erro ao alterar imagem.', 400);
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
            const { key } = await this.findById(id);
    
            await db.table('users').delete().where({ id });

            if(key !== 'sem_foto.png') {
                if(process.env.STORAGE_TYPE == 's3') {
                    return s3.deleteObject({
                        Bucket: process.env.BUCKET_NAME,
                        Key: process.env.AWS_SECRET_ACCESS_KEY,
                    })
                    .promise()
                    .then(response => {
                        console.log('certo');
                        console.log(response.status)
                    })
                    .catch(response => {
                        console.log('erro');
                        console.log(response.status)
                    });
                }
            } 

        } catch (e) {
            throw new ValidateException('Não foi possivel remover este usuário.', 400);
        }
    }
}

module.exports = UserRepository;