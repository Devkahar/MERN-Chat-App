const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomName:{
        type: String,
        required: true,
        unique: true,
    },
    roomId:{
        type: String,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    participants:[
        {user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}},
    ],
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model("Room",roomSchema);