const express = require('express')
const app = express();
const cors = require('cors')
const env = require('dotenv');
const { userSignIn, isUserAuthentic, signIn } = require('./controller/user');
env.config();
require('./db/connnect')
app.use(express.json());
app.use(cors())
app.get('/',(req,res)=>{
    res.send('ok')
})


app.post('/api/register',userSignIn);
app.get('/api/auth',isUserAuthentic);
app.post('/api/signin',signIn);
app.listen(2000,()=>{
    console.log('listning on port 2000');
})