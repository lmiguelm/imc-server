const express = require('express'); 

const multerConfig = require('./middlewares/multer');

const UserController = require('./controllers/UserController');
const ImcController = require('./controllers/ImcController');
const AuthController = require('./controllers/AuthController');

const routes = express.Router();

const authMiddleware = require('./middlewares/auth');
routes.use(authMiddleware);

const multer = require('multer');
routes.use(multer(multerConfig).single('avatar'));

const userController = new UserController();
const imcController = new ImcController();
const authController = new AuthController();


// Auth
routes.post('/auth/login', authController.login);
routes.post('/auth/forgotPassword', authController.forgotPassword);
routes.post('/auth/authenticateCode', authController.authenticateCode);
routes.post('/auth/:id/changePassword', authController.changePassword);
routes.post('/auth/resetPassword', authController.resetPassword);
routes.post('/auth/authenticateToken', authController.authenticateToken);

// User
routes.get('/users', userController.findAll);
routes.get('/users/:id', userController.findById);
routes.post('/users/new', userController.create);
routes.put('/users/:id', userController.update);
routes.delete('/users/:id', userController.delete);
routes.post('/users/:id/avatar', userController.avatar);

// Imc
routes.get('/imcs', imcController.findAll);
routes.get('/imcs/:userId', imcController.findByUser);
routes.post('/imcs/new', imcController.create);
routes.put('/imcs/:id', imcController.update);
routes.delete('/imcs/:id', imcController.delete);
routes.get('/imcs/:id/filter', imcController.filter);

// Connections

module.exports = routes;

