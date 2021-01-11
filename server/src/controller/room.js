const Room = require("../model/rooms");
const bcrypt = require("bcrypt");
const { addRoomToUser } = require("../util/addRoomToUser");
const MessageBox = require("../model/messageBox");


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
        (error,data) => {
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

exports.getGlobalRooms = (req,res)=>{
  let roomArray = [];
  const {userRooms} = req.body;
  Room.find({}).exec((error,rooms)=>{
    if(rooms){
      // let prev = null;
      // rooms.forEach(e =>{
      //   if(userRooms.length >0){
      //     userRooms.map(ur =>{
      //       if(ur.roomID.toString() !== e._id.toString() && prev !== e._id.toString()){
      //         roomArray.push(roomDetails(e._id));
      //         prev = e._id.toString();
      //       }
      //     })
      //   }else{
      //     roomArray.push(roomDetails(e._id));
      //   }
      //   console.log("one",rooms);
      //   roomArray.push(roomDetails(e._id));
      // })
      // Promise.all(roomArray)
      // .then(data => {
      //   return res.status(200).json({roomDetails: data})})
      // .catch(error => res.status(400).json({message: "Something went wrong",error}))

      rooms.forEach(e => {
        const {roomName,roomId,participants} = e;
        if(userRooms && userRooms.length> 0){
          let isNot = true;
          userRooms.forEach(ur =>{
            if(e._id.toString() === ur.roomID.toString()){
              isNot = false;
            }
          })
          if(isNot){
            roomArray.push({roomName,roomId,participants});
          }
          isNot=true;
        }else{
          roomArray.push({roomName,roomId,participants});
        }
      })

      return res.status(200).json({roomDetails: roomArray})
    }
    if(error) return res.status(400).json({message: "Something went wrong",error});
  });
  
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
