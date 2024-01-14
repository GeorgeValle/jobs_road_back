import {MongoDAO} from './MongoDAO.js';
import ExperienceModel from './models/ExperienceModel.js';


//create the new class Education
class Experience extends MongoDAO{ //extends Connection
    constructor(){
        super(ExperienceModel)
    }

}

export default new Experience