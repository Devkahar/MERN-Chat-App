const Room = require("../model/rooms");
const bcrypt = require("bcrypt");
const { updateOne, findById } = require("../model/user");
const { addRoomToUser } = require("../util/addRoomToUser");
const MessageBox = require("../model/messageBox");
const User = require("../model/user");
const user = require("../model/user");

exports.createRoom = async (req, res) => {
  const { userId, roomName, roomId, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((_password) => {
      const _room = new Room({
        roomName,
        roomId,
        password: _password,
        participants: [{user: userId}],
        creator: userId,
      });
      _room.save((error, room) => {
        if (error)
          return res
            .status(400)
            .json({ error, message: "Failed TO Create Room" });
        if (room) {
          addRoomToUser(userId, room._id);
          const messageBox = new MessageBox({ parentId: room._id }).save();
          return res.status(201).json({
            room,
            message: "Room Created Successfully",
          });
        }
      });
    })
    .catch((error) => console.log(error));
};

exports.addParticipantsInRoom = async (req, res) => {
  const { roomId, participants } = req.body;

  Room.findOne({ roomId }).exec((error, rooms) => {
    if (rooms) {
      const participantsArray = rooms.participants;
      participants.map((e) => {
        addRoomToUser(e.user, rooms._id);
        console.log(e.user);
        let should = participantsArray.filter(
          (_e) => _e.user.toString() === e.user.toString()
        );
        console.log("Should", should);
        if (should.length === 0) {
          participantsArray.push(e);
        }
      });
      Room.updateOne({ roomId }, { participants: participantsArray }).exec(
        (error, data) => {
          if (data)
            return res
              .status(201)
              .json({ message: "User Added Success Fully" });
          console.log(data);
          if (error) return res.status(400).json({ error, message: "Failure" });
        }
      );
    }
    if (error) return res.status(400).json({ error, message: "Failure" });
  });
};

const  roomDetails =  (roomID)=>{

  return new Promise((resolve,reject)=>{
    Room.findOne({_id: roomID}).populate('creator')
    .exec((error,data)=>{
      if(error) return reject(error);
      if(data){
        const {roomName,roomId,participants} = data;
        const {firstName,lastName} = data.creator;
        //console.log(data);
        return resolve({roomName,roomId,participants,author:{firstName,lastName}})
      }
    })
  })
}

exports.getRoomList = (req, res) => {
    const {roomIDArray} = req.body;
    //console.log(req.body);
    if(roomIDArray){

      const roomArray = [];
      roomIDArray.map(e =>{
        roomArray.push(roomDetails(e.roomID));
      })
  
      Promise.all(roomArray)
      .then(data => {
        return res.status(200).json({roomDetails: data})})
      .catch(error => res.status(400).json({message: "Something went wrong",error}))
    }
    
};
