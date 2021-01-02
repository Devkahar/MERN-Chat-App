const user = require('../model/user');
const User = require('../model/user');

exports.userSignIn = (req,res)=>{
    const _user = new User({...req.body});

    _user.save((error,user)=>{
        if(error) return res.status(400).json({error});
        if(user) return res.status(201).json({message: "User Is Created Successfully"})
    })

}