const mongoose = require('mongoose');

const messageBoxSchema = new mongoose.Schema({
    parentId: {type: mongoose.Schema.Types.ObjectId, ref: 'Room',required: true},
    messageBox:[
        {
            date: {type: String},
            author: {type: mongoose.Schema.Types.ObjectId, ref: 'User',required: true},
            name: {
                type: String,
                required: true
            },
            message: {type: String}
        }
    ],
})
module.exports = mongoose.model("MessageBox",messageBoxSchema);