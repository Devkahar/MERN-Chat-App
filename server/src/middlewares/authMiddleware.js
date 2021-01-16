const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')
const Rooms = require('../model/rooms');
const User = require('../model/user');
exports.isUserAuthentic = (req,res,next)=>{
    const token =  req.headers.authorization;
    if(token) {
        jwt.verify(token.split(' ')[1],process.env.JWT_CLIENT_SECRATE, (error,user)=>{
            if(user){
                console.log(user);
                req.body.userId = user.id;
                next();
            }
            if(error){ 
                return res.status(404).json(error);
            }
        })
    }
    else{
        return res.status(400).json('Token is Required');
    }
}

exports.isRoomUserAuthentic = (req,res,next)=>{
    const {userId} = req.body;
    const {roomId} = req.params;
        console.log(req.params.roomId);
        console.log(req.body);
        
    Rooms.findOne({roomId}).exec(async (error,room)=>{
        if(error) return res.status(400).json({error: "Invalid Room Id"});
        if(room){
            let isMember = false;
            console.log("yyy");
            room.participants.map(e =>{ 
                if (e.user.toString() === userId.toString()){
                    req.body.id = room._id;
                    isMember = true;
                    next();
                }
            });
            if(!isMember){
                return res.status(400).json({error: "You are not allowed in room"});
            }
        }
    })
}

exports.joinRoom = (req,res,next)=>{
    try {
        const {userId,password} = req.body;
        req.body.participants = [{user: userId}];
        const {roomId} = req.params;
        req.body.roomId = roomId;
        Rooms.findOne({roomId}).exec(async (error,room)=>{
            if(room){
                const isAuth = await bcrypt.compare(password,room.password);
                console.log(isAuth);
                if(isAuth){
                    next();
                }else{
                    return res.status(400).json({message: "Invalid Password"});
                }
            }
            if(error){
                return res.status(400).json({message: "Invalid RoomId"});
            }
        })
    } catch (error) {
        return res.status(500).json({error});
    }
}


exports.userRoomsMiddleware = (req,res,next)=>{
    const {userId} = req.body;
    User.findById({_id: userId}).exec((error,user)=>{
        if(error) return res.status(400).json({error});
        if(user){
            const rooms = user.rooms;
            console.log(rooms);
            req.body.userRooms = rooms;
            next();
        }
    })
}