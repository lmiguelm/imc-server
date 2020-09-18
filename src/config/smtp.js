module.exports = {
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    },
    secure: false,
    tls: {
        rejectUnauthorized: false
    }
}