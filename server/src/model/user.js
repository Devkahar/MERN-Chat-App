const mongoose = require('mongoose');

const userSchema = new  mongoose.Schema({
    firstName:{
        type: String,
        max: 10,
        min:2,
        required: true
    },
    lastName:{
        type: String,
        max: 10,
        min:2,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    }
})


module.exports = mongoose.model("User",userSchema);