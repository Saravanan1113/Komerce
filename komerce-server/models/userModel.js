const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'Please provide a Email Id'],
        unique: [true, 'Email id already Exists'],
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid emails']
    },
    password:{
        type: String,
        required: [true, 'Please provide a Password'],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    passwordConfirm:{
        type: String,
        required: [true, 'Please provide a Confirm Password'],
        validate: {
            validator: function(el){
                return el === this.password;
            },
            message: 'Passwords not matched!'
        }
    },
    role:{
        type: String,
        default: 'user',
    },
    cart_id:{
        type: String,
        default: null,
    }
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) return next();

    //hash the password
    this.password = await bcrypt.hash(this.password, 12);

    //Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.methods.correctPassword = async function(candidatePassword,userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = new mongoose.model("User", userSchema);

module.exports = User;