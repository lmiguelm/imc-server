const bcrypt = require('bcrypt');

const UserRepository = require('../repositories/UserRepository');
const userRepository = new UserRepository();

const ValidateException = require('../controllers/ValidateException');

class UserService {

    async checkEmailExists(email) {
        const user = await userRepository.findByEmail(email);
        
        if(user != undefined) {
            throw new ValidateException('Este e-mail já esta sendo utilizado', 400);
        } 
    }
}

module.exports = UserService;