const express = require('express')
const app = express();
const cors = require('cors')
const env = require('dotenv');
const {  signIn, userSignup, getUserRooms } = require('./controller/user');
const { createRoom, addParticipantsInRoom, getRoomList } = require('./controller/room');
const { addMessage, getMessage } = require('./controller/message');
const { isUserAuthentic } = require('./middlewares/authMiddleware');
env.config();
require('./db/connnect')
app.use(express.json());
app.use(cors())
app.get('/',(req,res)=>{
    res.send('ok')
})
app.post('/api/register',userSignup);
//app.get('/api/auth',isUserAuthentic);
app.post('/api/signin',signIn);
app.post('/api/room',isUserAuthentic,createRoom);
app.post('/api/addtoroom',addParticipantsInRoom);
app.post('/api/message',isUserAuthentic,addMessage);
app.get('/api/message',isUserAuthentic,getMessage);
app.post('/api/roomList',getRoomList);
app.get('/api/getInitData',isUserAuthentic,getUserRooms);
console.log(new Date().toUTCString(2021, 01, 06, 3, 0, 0).split(' '));

app.listen(2000,()=>{
    console.log('listning on port 2000');
});
