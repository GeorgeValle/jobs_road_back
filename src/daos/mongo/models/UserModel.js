import {Schema,model} from 'mongoose';

const userSchema = new Schema({
    email: {
        type: String,
        lowercase: true,
        trim: true,
        index:true,
        unique:true,
        validate: {
        validator: function(value) {
            return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(value);
            },
            message: 'Invalid email format'}
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
    candidate:{ type: Schema.Types.ObjectId, ref: 'candidate' },
    //status the email verified or not
    status:{
        type: String,
        default: "not verified"
    }

},


    {timestamps: true})

export default  model('user', userSchema);