const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

const ValidateException = require('../controllers/ValidateException');

const UserRepository = require('../repositories/UserRepository');
const userRepository = new UserRepository();

class AuthService {

    async validateLogin(emailReq, passowordReq) {
        try {
            const user = await userRepository.findByEmail(emailReq);

            if(user.length === 0) {
                throw new ValidateException('E-mail incorreto', 400);
            }

            const { id } = user;
            
            const isPassword = await this.decrypt(passowordReq, id);


            if(!isPassword) {
                throw new ValidateException('Senha inválida!', 400);
            }

            return this.generateToken(id);
           
        } catch (e) {
            throw new ValidateException(e.message, e.status);
        }
    }

    generateToken(id) {
        // 1- identificador do usuário
        // 2- palavra secreta
        // 3- expiração
        const token = jwt.sign({ id }, authConfig.secret, {
            expiresIn: 172800
        });

        return `Bearer ${token}`;
    }

    async encrypt(password) {
        try {
            const salt = await bcrypt.genSaltSync();
            const passEncrypted = await bcrypt.hash(password, salt);
            return passEncrypted;
        } catch (e) {
            throw new ValidateException('Erro genérico', 500);
        }
    }

    async decrypt(passwordClear, id) {
        const { password } = await userRepository.findById(id);
        const isPassword = bcrypt.compareSync(passwordClear, password);

        if(!isPassword) {
            throw new ValidateException('Senha inválida!', 400);
        }

        return isPassword;
    }

    async changePassword(id, password) {
        try {
            const passEncrypted = await this.encrypt(password);
            await userRepository.updatePassword( passEncrypted, id);
        } catch (e) {
            throw new ValidateException('Erro ao atualizar senha. Tente novamente mais tarde.', 400);
        }
    }

    async generateCode(id) {
        try {
            const users = await userRepository.findAll();

            let flag, code;
            
            do {
                flag = false;
                code = Math.floor(Math.random() * 999999);

                users.forEach(user => {
                    if(user.code == code) {
                        flag = true;
                    }
                });

            } while (flag);

            await userRepository.update({ code }, id);
            return code;
        } catch (e) {  
            throw new ValidateException('Erro ao gerar code', 400);
        }
    }
}

module.exports = AuthService;