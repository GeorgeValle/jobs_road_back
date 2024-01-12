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
    admin:{
        type:Boolean,
        default:false
    },
    recruiter:{
        type:Boolean,
        default:false
    },


},


    {timestamps: true})

export default  model('user', userSchema);