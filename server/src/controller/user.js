const bcrypt = require('bcrypt');
const User = require('../model/user');
const jwt = require('jsonwebtoken');
exports.userSignup = (req,res)=>{
    const {firstName,lastName,email,password} = req.body;
    bcrypt.hash(password,10)
    .then((_password)=>{
        const _user = new User({firstName,lastName,email,password: _password});
        _user.save((error,user)=>{
            if(error) return res.status(400).json({error});
            if(user){
                const token = jwt.sign({id: user._id},process.env.JWT_CLIENT_SECRATE,{expiresIn: 86400});
                return res.status(201).json({message: "User Created SuccessFully",token});
            }
        });
    })
    .catch(error => console.log(error))
}

exports.signIn = (req,res) =>{
    const {email,password} = req.body;
    User.findOne({email}).exec(async (error,user)=>{
        if(error) return res.status(400).json(error);
        if(user){
            const isAuth = await bcrypt.compare(password,user.password);
            if(isAuth){
                const token = jwt.sign({id: user._id},process.env.JWT_CLIENT_SECRATE,{expiresIn: 86400});
                return res.status(200).json({user,token})
            }
            if(!isAuth){
                return res.status(401).json({message: "invalid Password"})
            }
        }
    })
    
}