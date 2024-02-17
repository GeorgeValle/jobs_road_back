// This File helpus to homogenize the name of DAOS variables.
import envs from "../config/Envs.js";
import mongoose from "mongoose";

let CandidateDAO, EducationDAO, ExperienceDAO, UserDAO;

switch (envs.PERSISTENCE) {
  case "MONGO":
    const uri= envs.MONGO_URI
    const ear= mongoose.connection;

    mongoose.connect(uri,
        {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).catch(err => {console.log(err)})
    
    ear.once('open',_=>{
        console.log(`Mongo Database is connected to: `, uri)
    })

    ear.on('error', err => {console.log(`Type error: ${err}`)})

    const { default: CandidateMongo} = await import ('./mongo/CandidateMongo.js')
    const { default: EducationMongo} = await import ('./mongo/EducationMongo.js')
    const { default: ExperienceMongo} = await import ('./mongo/ExperienceMongo.js')
    const { default: UserMongo } = await import ('./mongo/UserMongo.js')

    
    CandidateDAO = CandidateMongo;
    EducationDAO = EducationMongo;
    ExperienceDAO = ExperienceMongo;
    UserDAO = UserMongo;
    break;
  default:
    break;
}

export {CandidateDAO,EducationDAO,ExperienceDAO,UserDAO}