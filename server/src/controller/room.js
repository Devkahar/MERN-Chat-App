const Room = require('../model/rooms');
const bcrypt = require('bcrypt');
const { updateOne } = require('../model/user');
const { addRoomToUser } = require('../util/addRoomToUser');

exports.createRoom = async (req,res)=>{
    const {userId,roomName,roomId,password,participants} = req.body;
    bcrypt.hash(password,10)
    .then((_password)=>{
        const _room = new Room({roomName,roomId,password: _password,participants,creator: userId});
        _room.save((error,room)=>{
            if(error) return res.status(400).json({error, message:"Failed TO Create Room"});
            if (room) {
                addRoomToUser(userId,room._id);
                return res.status(201).json({
                    room,
                    message: "Room Created Successfully" 
                })
            };
        })
    })
    .catch(error => console.log(error));
}

exports.addParticipantsInRoom = async(req,res)=>{
    const {roomId,participants} = req.body;
    try {
        Room.findOne({roomId}).exec((error,rooms)=>{
            if(rooms){
                
                const participantsArray = rooms.participants;
                participants.map(e =>{
                    addRoomToUser(e.user,rooms._id);
                    console.log(e.user);
                    let should = participantsArray.filter(_e => _e.user.toString() === e.user.toString());
                    console.log("Should",should);
                    if(should.length === 0){
                        participantsArray.push(e);
                    }
                })
                Room.updateOne({roomId},{participants: participantsArray}).exec((error,data)=>{
                    if (data) return res.status(201).json({message:"User Added Success Fully"});
                    console.log(data);
                    if(error) return res.status(400).json({error,message:"Failure"});
                })
            }
            if(error) return res.status(400).json({error,message:"Failure"});
        
        })
    }catch (error){
        console.log(error);
    }
}