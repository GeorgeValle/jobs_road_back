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

export default  model('candidate', candidateSchema);