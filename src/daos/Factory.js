// This File helpus to homogenize the name of DAOS variables.
import envs from "../config.js/Envs.js";
import mongoose from "mongoose";

let CandidateDAO, EducationDAO, ExperienceDAO, UserDAO;

console.log(`persistence with: ${envs.PERSISTENCE}`)

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
        console.log(`Database is connected to: `, uri)
    })

    ear.on('error', err => {console.log(`Type error: ${err}`)})

    const { default: CandidateMongo} = await import ('./mongo/')
    const { default: EducationMongo} = await import ('./mongo/')
    const { default: ExperienceMongo} = await import ('/mongo')
    const { default: UserMongo } = await import ('./mongo')

    
    CandidateDAO = CandidateMongo;
    EducationDAO = EducationMongo;
    ExperienceDAO = ExperienceMongo;
    UserDAO = UserMongo;
    break;
  default:
    break;
}

export {CandidateDAO,EducationDAO,ExperienceDAO,UserDAO}