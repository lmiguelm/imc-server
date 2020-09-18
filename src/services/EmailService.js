const nodemailer = require('nodemailer');
const ValidateException = require('../controllers/ValidateException');

class EmailService {

    async sendEmailRecuperationPass(code, user) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: process.env.SECURE,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD
                },
                tls: {
                    rejectUnauthorized: process.env.EMAIL_REJECTUNAUTHORIZED
                }
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