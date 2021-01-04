const User = require('../model/user');

exports.addRoomToUser =(_id,roomID)=>{
    User.findOne({_id}).exec((error,user)=>{
        if(user){
            const roomArray = user.rooms;
            //const should = roomArray.filter(e => e.roomID.toString() === roomID.toString());
            // if(should.length === 0){
            //     roomArray.push({roomID});
            //     User.updateOne({_id},{rooms: roomArray}).exec((error,data)=>{
            //         if (data) 
            //         if (error) console.log(error);
            //     })
            // }
            roomArray.push({roomID});
            User.updateOne({_id},{rooms: roomArray}).exec((error,data)=>{
                if (data) 
                if (error) console.log(error);
            })
        }
        if(error) console.log(error);
    })
}