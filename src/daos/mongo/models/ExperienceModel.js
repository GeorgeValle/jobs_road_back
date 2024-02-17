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

export default  model('experience', experienceSchema);