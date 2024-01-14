import {MongoDAO} from './MongoDAO.js';
import EducationModel from './models/EducationModel.js';


//create the new class Education
class Education extends MongoDAO{ //extends Connection
    constructor(){
        super(EducationModel)
    }

}

export default new Education