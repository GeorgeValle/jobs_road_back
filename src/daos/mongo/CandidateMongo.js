import {MongoDAO} from './MongoDAO.js';
import CandidateModel from './models/CandidateModel.js';


//create the new class Candidate
class Candidate extends MongoDAO{ //extends methodes in common
    constructor(){
        super(CandidateModel)
    }

}

export default new Candidate