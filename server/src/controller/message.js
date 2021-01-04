const Room = require('../model/rooms');
exports.addMessage = (req,res)=>{
    const {message,userId,roomId} = req.body;
    Room.updateOne({roomId},{
        $push:{
            messageBox:{
                date: new Date().toUTCString(),
                author: userId,
                message
            }
        }
    })
    .exec((error,_message)=>{
        if(error) return res.status(400).json({error});
        if(_message) return res.status(200).json({_message});
    })
}