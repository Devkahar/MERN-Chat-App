const Room = require('../model/rooms');
const Pusher = require("pusher");
const MessageBox = require('../model/messageBox');
const pusher = new Pusher({
  appId: "1132743",
  key: "9b822891a5982d38f046",
  secret: "55192ef756e50a34d7cd",
  cluster: "ap2",
  useTLS: true
});

exports.addMessage = (req,res)=>{
    const {message,userId,id,name} = req.body;
    const changeStream = MessageBox.watch();
    changeStream.on("change",(change)=>{
        console.log("Here was Change",change);
        if(change.operationType === 'update'){
            const messageKeyArray = Object.keys(change.updateDescription.updatedFields)[0];
            const messageDetails =  change.updateDescription.updatedFields[messageKeyArray];
            console.log("message details",messageDetails);
            pusher.trigger("message", "inserted", {
                ...messageDetails
            });
        }else{
            console.log("Error");
        }
    })
    MessageBox.updateOne({parentId: id},{
        $push:{
            messageBox:{
                date: new Date().toUTCString(),
                author: userId,
                name,
                message
            }
        }
    })
    .exec((error,_message)=>{
        if(error) return res.status(400).json({error});
        if(_message) return res.status(201).json({message: "message Created"});
    })
}

exports.getMessage = (req,res)=>{
    const {id} = req.body;
    MessageBox.findOne({parentId: id}).exec((error,messages)=>{
        if (messages) res.status(200).json({messages: messages.messageBox})
        if(error) return res.status(400).json({error});
    })
}