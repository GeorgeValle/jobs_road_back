# jobs_road_back
backend of a jobs site. 

## `introduction`
This project is the backend for a job search website called "Jobs Road". It's split in two different repositories, the services of Backend and Frontend

## Frontend
in the next link you can visit the frontend deploy
[Front-Inprogress]
in the next link you can visit the frontend repository
[Front-Inprogress]

## <a name="ab0"> </a> Content Table
- [Create Mongo DAOS](#ab1)
- [Define Services and Repository](#ab2)
















## <a name="ab1"> </a>Mongo Daos Creation
Utilized a DAOS Patern, in a folder whit this name. 

> mongo
>
>>models
>>
>>>CandidateModel.js, EducationModel.js, ExperienceModel.js, UserModel.js
>>>

### The code Models is the next:

User model, handle nesesary data for cerate an user for the web site,

```
import {Schema,model} from 'mongoose';

const userSchema = new Schema({
    username: { 
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "can't be blank"],
        match: [/\S+@\S+\.\S+/, 'is invalid'],
        index:true,
        trim: true,
        required: true
    },

    password: { 
            type: String,
            // match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
            trim: true,
            select: false,
            minlength: 7,
            maxlength: 15,
            required: [true, "can't be blank"],
            validate: {
                validator: function(value) {
                  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{7,15}$/.test(value);
                },
                message: 'Invalid password format',}
            
        },

    name:{
        type: String,
        trim: true,
        required: true
    },
    surname:{
        type:String,
        required: true
        },
    
    email: {
        type: String,
        lowercase: true,
        trim: true,
        unique:true,
        validate: {
        validator: function(value) {
            return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            },
            message: 'Invalid email format'}
    },
    lastLogin:{
        type:Date
    },
    inactive:{
        type: Boolean,
        default: false
    },
    role:{
        type:String,
        default:'Normal',
        enum: ['Normal', 'Recuiter', 'Admin']
    },

},


    {timestamps: true})

export default  model('user', userSchema);
```

Candidte Model, have the other data for user and two fields have un array the Education and Experience , for later generate a relation for population, too it have list of skills and Tecnologies:

```
import {Schema,model} from 'mongoose';

const candidateSchema = new Schema({
    birthday: {
        type: Date,
        required: true
    },
    nacionality: { 
            type: String,
            trim: true,
            required: true,
        },
    city:{
        type: String,
        required: true
    },
    neighborhood: {
        type: String,
        lowercase: true,
        trim: true,
    },
    about:{
        type: String,
        default: "",
    },
    experience: [{ type: Schema.Types.ObjectId, ref: 'experience' }],
    education: [{ type: Schema.Types.ObjectId, ref: 'education' }],
    skills:{
        type: Array,
        of: {type : String ,default:[]}
    },
    tecnologies:{
        type:Array,
        of: {type: String, default:[]}
    }
})

export default  model('user', candidateSchema);

```
Education Model, handle data of courses, carrers of grade, high schooll 
```
import {Schema,model} from 'mongoose';

const educationSchema = new Schema({
    educationTitle:{
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    degree: {
        type: String,
        required: true
    },
    // 
    startMonth: {
        type: Number,
        min: 1,
        max: 12
     },
     startYear: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear()
     },
     endMonth: {
        type: Number,
        min: 1,
        max: 12
     },
     endYear: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear()
     },
    status:{
        type: String,
        require: true,
        enum: ['In Progress', 'Completed', 'Abandoned'],
    },
    description: {
        type: String,
        required: true
    },
    candidate:{ type: Schema.Types.ObjectId, ref: 'experience' }

});

export default  model('education', educationSchema);

```
 Experience Model, have the different data employment list:

```
import {Schema,model} from 'mongoose';

const experienceSchema = new Schema({
    jobTitle:{
        type: String,
        required: true
    },
    companyName: {
        type: String,
        required: true
    },
    branch: { 
            type: String,
            required: true,
        },
    location:{
        type: String,
        required: true
    },
    tasks:{
        type:String
    },
    startMonth: {
        type: Number,
        min: 1,
        max: 12
     },
     startYear: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear()
     },
     endMonth: {
        type: Number,
        min: 1,
        max: 12
     },
     endYear: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear()
     }
    
})

export default  model('user', experienceSchema);

```
[back to Index](#ab0)
### Now the DAOS collections

The `DAO` class is a simple wrapper around mongoose. It provides methods for common operations, in this case the general class is MongoDAO.js:

```
// This Class have patterns of encapsulated methodes for mongo
class MongoDAO{
    constructor(options){
        this.collection= options
    }

    saveDataDAO = async obj =>{
        try{
            let objDAO = await this.collection.create(obj);
            return objDAO

        }
        catch(err){
            console.log(err)
        }
    }

    getAllDAO = async ()=>{
        try {
            let objDAO = await this.collection.find({});
            return objDAO;
        }
        catch(err) {
            console.log(err.message);
        }
    }

    getByIdDAO = async id =>{
        try {
            
            let objDAO = await this.collection.findById(id);
            if(objDAO[0] == undefined) throw new Error();
            return objDAO;
        } catch (err) {
            console.log(err.message);
        } 
    }

    getByFieldDAO = async field =>{
        try{
            let objDAO = await this.collection.find(field)
            return objDAO
        }catch(err) {

        }
    }

    updateByIdDAO = async (obj,id) =>{
        try {
            let objDAO = await this.collection.findByIdAndUpdate(id, obj,{new:true});
            return objDAO   
            
        } catch (err) {
            console.log(err.message);
        }  
    }
    

    deleteByIdDAO = async (id)=>{
        try {
            let objDAO = await this.collection.findByIdAndDelete(id);
            return objDAO
        } catch (err) {
            console.log(err.message);
        }  
    }



updateOneFieldById = async (id, fieldUpdate,)=>{
    try{

        //updates = have field update
        const updatedResult = await this.collection.findByIdAndUpdate(
            { _id: id },
            {
                fieldUpdate
            },
            {
                new: true
            }
        );
        console.log(updatedResult);


    }catch (err) {

    }
}

updateByFieldDAO = async (field, fieldUpdate,)=>{
    try{

        const res = await this.collection.findOneAndUpdate(field, fieldUpdate, {
            new: true,
        });
        //return modified field
        console.log(res);

    }catch (err) {

    }

}

incrementOneFieldDAO = async (field, fieldUpdate) => {
    try{
        await this.collection.findOneAndUpdate( field, 
            //{'field' : dataFieldUpdate}
            {$inc : fieldUpdate}, 
            //{new: true} 
            );

    }catch(err){

    }
}

incrementOneFieldById = async (id, fieldUpdate) => {
    try{

        await this.collection.findByIdAndUpdate(
            id,
            // example: fieldUpdate ={ goals: { $inc: 1 } }
            fieldUpdate,
            //{new: true}
            );
    }catch(err){

    }
}

resetAllDAO = async (fieldsUpdated) => {
    try{
        // example: fieldUpdate ={ goals: 0,wins:0,points:0}
        const reset = await this.collection.updateMany({}, { fieldsUpdated })
        //obtain the count of documents modified
        return reset.modifiedCount
            
    }catch(err){

    }
}

}
export {MongoDAO}
```
__All other classes inherit MongoDAO's methods:__

```
import {MongoDAO} from './MongoDAO.js';
import CandidateModel from './models/CandidateModel.js';


//create the new class Candidate
class Candidate extends MongoDAO{ //extends methodes in common
    constructor(){
        super(CandidateModel)
    }

}

export default new Candidate
```


```
import {MongoDAO} from './MongoDAO.js';
import EducationModel from './models/EducationModel.js';


//create the new class Education
class Education extends MongoDAO{ //extends Connection
    constructor(){
        super(EducationModel)
    }

}

export default new Education
```

```
import {MongoDAO} from './MongoDAO.js';
import ExperienceModel from './models/ExperienceModel.js';


//create the new class Education
class Experience extends MongoDAO{ //extends Connection
    constructor(){
        super(ExperienceModel)
    }

}

export default new Experience
```

```
import {MongoDAO} from './MongoDAO.js';
import UserModel from './models/UserModel.js';


//create the new class User
class User extends MongoDAO{ //extends Connection
    constructor(){
        super(UserModel)
    }

}

export default new User
```
[back to Index](#ab0)
### Homogenized names and swicht types of persistences whit Factory.js
In this section i use a factory pattern in order to create instances of different classes using the same file, It doesn't matter what persistence is active.

```
// This File helpus to homogenize the name of DAOS variables.
import envs from "../config.js/Envs.js";
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
```

__This factory file is going to be exported to The Service Index.__

[back to Index](#ab0)


## Define Services and Repository files
<a name="ab2">


