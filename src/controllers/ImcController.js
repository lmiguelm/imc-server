const { request, response } = require('express');

const ImcRepository = require('../repositories/ImcRepository');
const ValidateException = require('./ValidateException');
const imcRepository = new ImcRepository();

class ImcController {

    // GET
    async findAll(req = request, res = response) {
        try {
            const imcs = await imcRepository.findAll();
            console.log(imcs);
            res.status(200).json(imcs);
        } catch(e) {
            res.status(e.status).json(e);
        }
    }

    async findByUser(req = request, res = response) {
        try {
            const { userId } = req.params;
            const userIdToken = req.userId;

            if(userId != userIdToken) throw new ValidateException('Acesso negado!', 401);

            console.log(userId, userIdToken);
            

            const imcs = await imcRepository.findByUser(userId);
            res.status(200).json(imcs);
        } catch(e) {
            res.status(e.status).json(e);
        }
    }

    async filter(req = request, res = response) {
        try {
            const { id } = req.params;
            const { date, imc } = req.query;

            const imcs = await imcRepository.findByFilter(id, date, imc);

            res.status(200).json(imcs);
        } catch (e) {
            res.status(e.status).json(e);
        }
    }

    // POST
    async create(req = request, res = response) {
        try {
            const { imc } = req.body;
            const userId = req.userId;

            if(userId != imc.user_id) throw new ValidateException('Acesso negado!', 401);

            await imcRepository.create(imc);
            res.status(201).send();
        }  catch (e) {
            res.status(e.status).json(e);
        }
    }

    // PUT
    async update(req = request, res = response) {
        try {
            const { imc } = req.body;
            const { id } = req.params;
            const {userId} = req;
            const {user_id} = imcRepository.findById(id);

            if(userId != user_id) throw new ValidateException('Acesso negado!', 401);
            
            await imcRepository.update(imc, id);
            res.status(204).send();
        } catch (e) {
            res.status(e.status).json(e);
        }
    }

    // DELETE 
    async delete(req = request, res = response) {
        try {
            const { id } = req.params;
            const {userId} = req;
            const {user_id} = await imcRepository.findById(id);
            
            if(userId != user_id) throw new ValidateException('Acesso negado!', 401);
            await imcRepository.delete(id);
            return res.status(204).send();
        } catch (e) {
            res.status(e.status).json(e);
        }
    }
}

module.exports = ImcController;