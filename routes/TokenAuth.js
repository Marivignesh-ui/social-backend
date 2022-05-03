const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{
    const token = req.body.token || req.query.token || req.headers["x-access-token"];

    if(!token){
        return res.status(403).json({ok:false,message:"authentication failed! Invalid Token"});
    }
    try{
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ok:false,message:"authentication failed! Login again"})
    }

    return next();
}

module.exports = verifyToken;