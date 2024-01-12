import {Schema,model} from 'mongoose';

const experienceSchema = new Schema({
    company: {
        type: String,
        required: true
    },
    branch: { 
            type: String,
            required: true,
        },
    city:{
        type: String,
        required: true
    },
    position:{
        type:String
    },
    tasks:{
        type:String
    },
    init_date: {
        type: Date,  
    },
    end_date:{
        type: Date, 
    },
    

})

export default  model('user', experienceSchema);