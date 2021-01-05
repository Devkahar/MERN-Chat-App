const jwt = require('jsonwebtoken');
exports.isUserAuthentic = (req,res,next)=>{
    const token =  req.headers.authorization;
    console.log(token);
    if(token) {
        jwt.verify(token.split(' ')[1],process.env.JWT_CLIENT_SECRATE, (error,user)=>{
            if(user){
                //console.log(user);
                req.body.userId = user.id;
                next();
            }
            // if(user) return(res.status(200).json({token}));
            if(error) return res.status(400).json(error);
        })
    }
    else{
        return res.status(400).json('Token is Required');
    }
}