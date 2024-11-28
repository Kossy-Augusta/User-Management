const JWT = require('jsonwebtoken');

const verifyJWT = (req,res,next)=>{
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if(!authHeader?.startsWith("Bearer")) return res.status(400).send({"message": "Unauthorized"});

    const token = authHeader.split(" ")[1];
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
        if (err) return res.status(403).send({message: err.message})
        req.first_name = decoded.userInfo.first_name;
        req.last_name = decoded.userInfo.last_name;
    })
    next();
}

module.exports = verifyJWT;