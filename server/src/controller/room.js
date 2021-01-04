const Room = require('../model/rooms');
const bcrypt = require('bcrypt');
const User = require('../model/user');

exports.createRoom = async (req,res)=>{
    const {userId,roomName,roomId,password,participants} = req.body;
    const user = await User.findOne({_id: userId});
    const roomArray = user.rooms;
    bcrypt.hash(password,10)
    .then((_password)=>{
        const _room = new Room({roomName,roomId,password: _password,participants,creator: userId});
        _room.save((error,room)=>{
            if(error) return res.status(400).json({error, message:"Failed TO Create Room"});
            if (room) {
                roomArray.push({roomID: room._id})
                User.findOneAndUpdate({_id:userId},{rooms: roomArray},(error,res)=>{
                    if(error) console.log(error);
                    else console.log(res);
                })
                return res.status(201).json({
                    room,
                    message: "Room Created Successfully" 
                })
            };
        })
    })
    .catch(error => console.log(error));
}

