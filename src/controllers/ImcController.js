const { request, response } = require('express');

const ImcRepository = require('../repositories/ImcRepository');
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
            const imcs = await imcRepository.findByUser(userId);
            res.status(200).json(imcs);
        } catch(e) {
            res.status(e.status).json(e);
        }
    }

    // POST
    async create(req = request, res = response) {
        try {
            const { imc } = req.body;
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
            await imcRepository.delete(id);
            return res.status(204).send();
        } catch (e) {
            res.status(e.status).json(e);
        }
    }
}

module.exports = ImcController;