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
    

},


    {timestamps: true})

export default  model('user', candidateSchema);