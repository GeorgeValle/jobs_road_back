import {MongoDAO} from './MongoDAO.js';
import UserModel from './models/UserModel.js';


//create the new class User
class User extends MongoDAO{ //extends Connection
    constructor(){
        super(UserModel)
    }

}

export default new User