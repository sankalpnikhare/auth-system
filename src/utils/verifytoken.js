const jwt = require('jsonwebtoken');

function verifytoken(req,res,next){
    const jwtkey = process.env.JWT_SECRET_KEY ; 
    const token = req.cookies.token ; 
    if(!token){
        return res.status(401).send("No token provided");

    }

    try {
        const verfied = jwt.verify(token , jwtkey);
        req.user = verified ; 
        next();
        
    } catch (error) {
        return res.status(401).send("Invalid Token");
        
    }
}

module.exports = verifytoken ; 