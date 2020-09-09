const nodemailer = require('nodemailer');
const  smtpConfig = require('../config/smtp');
const ValidateException = require('../controllers/ValidateException');

class EmailService {

    async sendEmailRecuperationPass(code, user) {
        try {
            const transporter = nodemailer.createTransport({
                host: smtpConfig.host,
                port: smtpConfig.port,
                secure: smtpConfig.secure,
                auth: smtpConfig.auth,
                tls: smtpConfig.tls
            });

            await transporter.sendMail({
                from: 'IMC <emaildesenvolvedor@gmail.com>',
                to: user.email,
                subject: 'Recuperação de senha',
                html: `
                    <p>Olá, ${user.name}</p>
                    <p>Seu código de recuperação de senha é <b>${code}</b></p>
                    <br><br><br><br><br><br>
                    <p>Atenciosamente</p>
                `
            });
        } catch (e) {
            throw new ValidateException('Erro ao enviar e-mail', 400);
        }
    }
}

module.exports = EmailService;