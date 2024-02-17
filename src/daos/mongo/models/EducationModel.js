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
    

});

export default  model('education', educationSchema);