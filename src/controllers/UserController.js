const { request, response } = require('express');

const UserService = require('../services/UserService');
const UserRepository = require('../repositories/UserRepository');
const AuthService = require('../services/AuthService');

const userService = new UserService();
const userRepository = new UserRepository();
const authService = new AuthService();

class UserController {
    
    // GET
    async findAll(req = request, res = response) {
        const users = await userRepository.findAll();
        users.map(user => delete user.password);
        return res.status(200).json(users);
    }

    async findById(req = request, res = response) { 
        try {
            const { id } = req.params;
            const user = await userRepository.findById(id);
            delete user.password;
            return res.status(200).json(user);
        } catch (e) {
            return res.status(e.status).json(e);
        }
    }

    // POST
    async create(req = request, res = response) {
       try {
            const { user } = req.body;

            await userService.checkEmailExists(user.email);
            
            const encrypted = await authService.encrypt(user.password);
            
            await userRepository.create({ ...user, password: encrypted, avatar_url: 'https://imc-app-storage-files.s3.amazonaws.com/sem_foto.png', key: 'sem_foto.png' });
            return res.status(201).send();

       } catch (e) {
           console.log(e);
           return res.status(e.status).json(e);
       }
    }

    async avatar(req = request, res = response) {
        try {
            const { location, key } = req.file;
            const { id } = req.params;
            await userRepository.updateAvatar(location, key, id);
            return res.status(204).send();
        } catch (e) {
            return res.status(e.status).send(e);
        }
    }

    //PUT
    async update(req = request, res = response) {
        try {
            const { id } = req.params;
            const { user } = req.body;

            await userRepository.update(user, id);

            return res.status(201).send();
        } catch (e) {
            return res.status(e.status).json(e);
        }
    }

    // DELETE
    async delete(req = request, res = response) {
       try {
            const { id } = req.params;
            await userRepository.delete(id);
            return res.status(204).send();
       } catch (e) {
           return res.status(e.status).json(e);
       }
    }

}  

module.exports = UserController;