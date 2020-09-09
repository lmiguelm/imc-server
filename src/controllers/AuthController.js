const { request, response } = require('express');

const AuthService = require('../services/AuthService');
const authService = new AuthService();

const UserRepository = require('../repositories/UserRepository');
const userRepository = new UserRepository();

const EmailService = require('../services/EmailService');
const emailService = new EmailService();

class AuthController {
    
    async login(req = request, res = response) {
       try {
            const { email, password } = req.body;

            const token = await authService.validateLogin(email, password);
            const user = await userRepository.findByEmail(email);
            delete user.password;
            
            return res
                    .status(200)
                    .set({ 'Authorization': token })
                    .set({'access-control-expose-headers': 'Authorization'})
                    .json(user);
       } catch (e) {
           return res.status(e.status).json(e);
       }
    }

    async forgotPassword(req = request, res = response ) {
        try {
            // buscar o usuário...
            const emailReq = req.body.email;
            const { id, name, last_name, email } = await userRepository.findByEmail(emailReq);
            // setar o código..
            const code = await authService.generateCode(id);
            // enviar email...
            await emailService.sendEmailRecuperationPass(code, { id, name, last_name, email });
            
            return res.status(200).send();
        } catch (e) {
            res.status(e.status).json(e);
        }
    }

    async authenticateCode(req = request, res = response) {
        try {
            const { code } = req.body;
            const user = await userRepository.findByCode(code);
            delete user.password
            return res.status(200).json(user);
        } catch (e) {
            return res.status(e.status).json(e);
        }
    }

    async resetPassword(req = request, res = response) {
        try {
            const { id } = req.body;
            const { password } = req.body;

            await authService.changePassword(id, password);

            res.send(200).send();
        } catch (e) {
            return res.status(e.status).json(e);
        }
    }

    async changePassword(req = request, res = response) {
        try {
            const { id } = req.params;

            const { oldPassword } = req.body;
            await authService.decrypt(oldPassword, id);

            const { newPassword } = req.body;
            await authService.changePassword(id, newPassword);

            return res.status(204).send();
        } catch (e) {
            return res.status(e.status).json(e);
        }
    }
}

module.exports = AuthController;