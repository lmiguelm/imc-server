const { request, response } = require('express');
const jwt = require('jsonwebtoken');
const authConfig = require('../config/auth.json');

const ValidationException = require('../controllers/ValidateException');

module.exports = async (req = request, res = response, next) => {
    try {
        const publicRoutes = [
            '/auth/login',
            '/auth/forgotPassword',
            '/users/new',
            '/auth/authenticateCode',
            '/auth/resetPassword',
            '/auth/authenticateToken'
        ];
        const url = req.url;
        
        // verificando se a rota passada na request é publica ...
        if(publicRoutes.some(p => p === url)) {
            return next();
        }
        
        const authHeader = req.headers.authorization;
    
        if(!authHeader){
            throw new ValidationException('Nenhum token informado.', 401);
        }

        const parts = authHeader.split(' ');

        if(!parts.length === 2) {
            throw new ValidationException('Token erro');
        }

        const [scheme, token ] = parts;

        if(!/^Bearer$/i.test(scheme)) {
            throw new ValidationException('Token mal formatado', 401);
        }

        jwt.verify(token, authConfig.secret, (err, decoded) => {
            if(err) {
                throw new ValidationException('Token inválido', 401);
            }
            req.userId = decoded.id;
            return next();
        });
        
    } catch (e) {
        res.status(e.status).json(e);
    }
};